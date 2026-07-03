/* ==========================================================================
   PM CRM Studio — Shared layout (sidebar / topbar) renderer
   ========================================================================== */

const PM_LOGIN_URL = 'https://m.pmi-korea.com/auth/login.do';

const NAV_ITEMS = [
  { href: 'index.html', icon: 'fa-gauge-high', label: '대시보드', key: 'dashboard' },
  { href: 'customers.html', icon: 'fa-users', label: '고객관리', key: 'customers' },
  { href: 'products.html', icon: 'fa-boxes-stacked', label: '상품관리', key: 'products' },
  { href: 'purchases.html', icon: 'fa-receipt', label: '구매기록', key: 'purchases' },
  { href: 'purchase-new.html', icon: 'fa-cart-plus', label: '구매등록', key: 'purchase-new' },
  { href: 'reminders.html', icon: 'fa-bell', label: '리마인더', key: 'reminders' },
  { href: 'faq.html', icon: 'fa-circle-question', label: '제품 FAQ', key: 'faq' },
];

function renderSidebar(activeKey) {
  const links = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="nav-link ${item.key === activeKey ? 'active' : ''}">
      <i class="fa-solid ${item.icon}"></i><span>${item.label}</span>
    </a>`).join('');

  return `
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-brand">
        <div class="logo-badge">PM</div>
        <div class="brand-text">
          <div class="name">PM CRM Studio</div>
          <div class="tag">Customer &amp; Product Hub</div>
        </div>
      </div>
      <div class="sidebar-section-label">메뉴</div>
      ${links}
      <a href="export-customers.html" class="nav-link">
        <i class="fa-solid fa-file-csv"></i><span>고객 CSV 내보내기</span>
      </a>
      <div class="sidebar-note">
        <div style="font-weight:700;color:#fff;">공식 PM 로그인</div>
        <div style="margin-top:4px;">파트너 포털에서 정식 주문/정산을 진행하세요.</div>
        <a class="btn" href="${PM_LOGIN_URL}" target="_blank" rel="noreferrer">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> 로그인 페이지 열기
        </a>
      </div>
    </aside>`;
}

function renderTopbar(title, subtitle, actionsHtml = '') {
  return `
    <header class="topbar">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="btn icon-only sidebar-toggle" id="sidebar-toggle-btn" aria-label="메뉴 열기">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div>
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
      </div>
      <div class="topbar-actions">${actionsHtml}</div>
    </header>`;
}

function mountLayout({ activeKey, title, subtitle, actionsHtml = '' }) {
  const shell = document.getElementById('app-shell');
  const sidebarHtml = renderSidebar(activeKey);
  const topbarHtml = renderTopbar(title, subtitle, actionsHtml);
  const contentHtml = shell.innerHTML;
  shell.innerHTML = `
    ${sidebarHtml}
    <div class="app-main">
      ${topbarHtml}
      <main class="page-content" id="page-content">${contentHtml}</main>
    </div>
    <div class="modal-backdrop" id="global-modal-backdrop" onclick="if(event.target===this) this.classList.remove('open')"></div>
  `;
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('app-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}
