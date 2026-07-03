/* ==========================================================================
   PM CRM Studio — small UI helpers (badges, empty states)
   ========================================================================== */

function customerStatusBadge(status) {
  const map = {
    active: ['b-green', '활성'],
    inactive: ['b-gray', '비활성'],
    paused: ['b-amber', '일시중지'],
  };
  const [cls, label] = map[status] || ['b-gray', status || '-'];
  return `<span class="badge ${cls}">${label}</span>`;
}

function customerTypeLabel(type) {
  const map = {
    prospect: '예비고객',
    customer: '고객',
    member: '회원',
    business_member: '사업자회원',
  };
  return map[type] || type;
}

function purchaseStatusBadge(status) {
  const map = {
    completed: ['b-green', '완료'],
    pending: ['b-amber', '대기'],
    cancelled: ['b-red', '취소'],
  };
  const [cls, label] = map[status] || ['b-gray', status || '-'];
  return `<span class="badge ${cls}">${label}</span>`;
}

function sendStatusBadge(status) {
  const map = {
    pending: ['b-amber', '대기'],
    sent: ['b-green', '발송완료'],
  };
  const [cls, label] = map[status] || ['b-gray', status || '-'];
  return `<span class="badge ${cls}">${label}</span>`;
}

function itemTypeBadge(type) {
  const map = {
    PRODUCT: ['b-indigo', '상품'],
    PACKAGE: ['b-cyan', '패키지'],
    AUTOSHIP_PLAN: ['b-amber', '오토십 플랜'],
  };
  const [cls, label] = map[type] || ['b-gray', type || '-'];
  return `<span class="badge ${cls}">${label}</span>`;
}

function channelLabel(channel) {
  const map = { manual: '수동입력', pm_online: 'PM 온라인', dsc: 'DSC', sms: 'SMS', kakao: '카카오', push: '푸시', none: '없음' };
  return map[channel] || channel || '-';
}

function emptyRow(colspan, message, icon = 'fa-inbox') {
  return `<tr><td colspan="${colspan}" class="empty"><i class="fa-solid ${icon}"></i>${escapeHtml(message)}</td></tr>`;
}
