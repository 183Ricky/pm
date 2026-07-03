/* ==========================================================================
   PM CRM Studio — reminder generation engine (mirrors Flask generate_reminders_core)
   ========================================================================== */

async function generateReminders() {
  const today = todayStr();
  let created = 0;

  const [subsRes, plansRes, customersRes, queueRes] = await Promise.all([
    Api.list('subscriptions', { limit: 1000 }),
    Api.list('intake_plans', { limit: 1000 }),
    Api.list('customers', { limit: 1000 }),
    Api.list('notification_queue', { limit: 1000 }),
  ]);

  const customersById = {};
  customersRes.data.forEach(c => { customersById[c.id] = c; });
  const queue = queueRes.data.slice();

  function hasDuplicate(sourceType, sourceId, scheduledAt) {
    return queue.some(q => q.source_type === sourceType
      && String(q.source_id) === String(sourceId)
      && fmtDate(q.scheduled_at) === scheduledAt
      && ['pending', 'sent'].includes(q.send_status));
  }

  // 1) Active subscriptions (autoship) — remind 3 days before next billing
  for (const s of subsRes.data.filter(r => r.status === 'active')) {
    if (!s.next_billing_date) continue;
    const trigger = addDays(fmtDate(s.next_billing_date), -3);
    if (trigger <= today && !hasDuplicate('subscription', s.id, trigger)) {
      const c = customersById[s.customer_id] || {};
      const row = await Api.create('notification_queue', {
        customer_id: s.customer_id,
        customer_name: s.customer_name || c.customer_name || '',
        pm_member_no: c.pm_member_no || '',
        source_type: 'subscription',
        source_id: s.id,
        kind: 'autoship',
        channel: c.preferred_channel || 'sms',
        recipient_phone: c.phone_number || '',
        title: '오토십 예정 안내',
        body: `${s.customer_name || c.customer_name || ''}님, ${s.product_name || '상품'} 오토십 결제 예정일은 ${fmtDate(s.next_billing_date)} 입니다.`,
        scheduled_at: trigger,
        send_status: 'pending',
      });
      queue.push(row);
      created += 1;
    }
  }

  // 2) Active "repurchase" intake plans — remind on next_reminder_date (일 단위, 며칠 전 알림)
  //    "intake"(복용 알림, 분 단위)는 이 배치 로직이 아니라 고객 상세 페이지의
  //    실시간 감지(checkDueIntakeAlerts)에서 별도로 처리됩니다.
  for (const p of plansRes.data.filter(r => r.status === 'active' && r.plan_type === 'repurchase')) {
    if (!p.next_reminder_date) continue;
    const trigger = fmtDate(p.next_reminder_date);
    if (trigger <= today && !hasDuplicate('intake_plan', p.id, trigger)) {
      const c = customersById[p.customer_id] || {};
      const row = await Api.create('notification_queue', {
        customer_id: p.customer_id,
        customer_name: p.customer_name || c.customer_name || '',
        pm_member_no: c.pm_member_no || '',
        source_type: 'intake_plan',
        source_id: p.id,
        kind: 'repurchase',
        channel: c.preferred_channel || 'sms',
        recipient_phone: c.phone_number || '',
        title: '재구매 리마인더',
        body: `${p.customer_name || c.customer_name || ''}님, ${p.product_name || '상품'} 재구매 시점이 도래했습니다. 재구매 여부를 확인해주세요.`,
        scheduled_at: trigger,
        send_status: 'pending',
      });
      queue.push(row);
      created += 1;
    }
  }

  // 3) Customer follow-ups
  for (const c of customersRes.data.filter(r => r.status === 'active' && r.next_followup_at)) {
    const trigger = fmtDate(c.next_followup_at);
    if (trigger <= today && !hasDuplicate('customer_followup', c.id, trigger)) {
      const row = await Api.create('notification_queue', {
        customer_id: c.id,
        customer_name: c.customer_name || '',
        pm_member_no: c.pm_member_no || '',
        source_type: 'customer_followup',
        source_id: c.id,
        kind: 'followup',
        channel: c.preferred_channel || 'sms',
        recipient_phone: c.phone_number || '',
        title: '후속관리 일정',
        body: `${c.customer_name}님 후속관리 예정일입니다. 상담/재구매 여부를 확인하세요.`,
        scheduled_at: trigger,
        send_status: 'pending',
      });
      queue.push(row);
      created += 1;
    }
  }

  return created;
}
