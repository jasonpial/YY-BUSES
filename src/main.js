import { getState, saveState } from './mockData.js';

// Import Views
import { renderPortal } from './components/portal.js';
import { renderDestinations } from './components/destinations.js';
import { renderCourierClient } from './components/courierClient.js';
import { renderCourierHandler } from './components/courierHandler.js';
import { renderCourierAdmin } from './components/courierAdmin.js';
import { renderBusHandler } from './components/busHandler.js';
import { renderBusConductor } from './components/busConductor.js';
import { renderBusManager } from './components/busManager.js';

// Application State
let appState = getState();

// Current Active View & Navigation Stack
let currentView = 'portal';
let navigationParams = {};

// Register listener to update local state dynamically
window.addEventListener('yy_state_changed', (e) => {
  appState = e.detail;
});

// Navigation router
function navigate(viewName, params = {}) {
  // If the navigation is a state modifier callback:
  if (viewName === 'update-state' && typeof params === 'function') {
    appState = params(appState);
    saveState(appState);
    // Re-render current active view
    renderApp();
    return;
  }

  currentView = viewName;
  navigationParams = params;
  renderApp();
}

// Sidebar menus config based on roles
const sidebarConfigs = {
  'bus-handler': {
    title: 'Bus Desk (Handler)',
    themeClass: 'active-blue',
    links: [
      { name: '🎟️ Booking & Roster', view: 'bus-handler' },
      { name: '📊 Fleet Analytics', view: 'bus-manager' },
      { name: '🗺️ Public Rates', view: 'destinations' }
    ]
  },
  'bus-conductor': {
    title: 'Voyage Log (Conductor)',
    themeClass: 'active-maroon',
    links: [
      { name: '📱 Mobile Desk', view: 'bus-conductor' },
      { name: '🗺️ Public Rates', view: 'destinations' }
    ]
  },
  'bus-manager': {
    title: 'Operations (Manager)',
    themeClass: 'active-blue',
    links: [
      { name: '📊 Fleet Analytics', view: 'bus-manager' },
      { name: '🎟️ Dispatch Board', view: 'bus-handler' },
      { name: '🗺️ Public Rates', view: 'destinations' }
    ]
  },
  'courier-client': {
    title: 'YY Courier Client',
    themeClass: 'active-maroon',
    links: [
      { name: '🔍 Track & Pre-Book', view: 'courier-client' },
      { name: '🗺️ Pricing Directory', view: 'destinations' }
    ]
  },
  'courier-handler': {
    title: 'Parcel counter (Handler)',
    themeClass: 'active-maroon',
    links: [
      { name: '📥 Intake & Dispatch', view: 'courier-handler' },
      { name: '📊 Audit Records', view: 'courier-admin' },
      { name: '🗺️ Price Sheet', view: 'destinations' }
    ]
  },
  'courier-admin': {
    title: 'Logistics (Admin)',
    themeClass: 'active-maroon',
    links: [
      { name: '📊 Rates & Auditing', view: 'courier-admin' },
      { name: '📥 Counter Intake', view: 'courier-handler' },
      { name: '🗺️ Price Sheet', view: 'destinations' }
    ]
  }
};

// Render App Shell
function renderApp() {
  const container = document.getElementById('app');
  if (!container) return;

  const showsSidebar = sidebarConfigs[currentView] !== undefined;
  const sidebarConf = sidebarConfigs[currentView];

  // Build shell template
  container.innerHTML = `
    <!-- Top Nav Header -->
    <header class="app-header">
      <div class="logo-section" id="brand-logo-btn">
        <div class="logo-icon">YY</div>
        <div class="logo-text">
          <h1>YY BUSES</h1>
          <span>Uganda Transport & Courier</span>
        </div>
      </div>

      <div class="nav-actions">
        ${currentView !== 'portal' ? `
          <div class="portal-badge">
            ⚡ ${currentView.replace('-', ' ').toUpperCase()} Mode
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-header-logout" style="background: rgba(255,255,255,0.15); color: var(--text-white); border: none;">
            🚪 Exit Desk
          </button>
        ` : ''}
        <button class="btn-icon" id="theme-toggle-btn" title="Toggle Dark/Light Mode">🌓</button>
      </div>
    </header>

    <!-- Main Body Container -->
    <div class="dashboard-container">
      <!-- Dynamic Sidebar -->
      ${showsSidebar ? `
        <aside class="sidebar">
          <div style="margin-bottom: 1rem;">
            <span class="sidebar-title">${sidebarConf.title}</span>
            <div style="font-size: 0.8rem; color: var(--text-medium); margin-top: 4px; padding-left: 8px;">
              User: Branch Officer
            </div>
          </div>
          <nav>
            <ul class="menu-list">
              ${sidebarConf.links.map(l => `
                <li class="menu-item ${l.view === currentView ? sidebarConf.themeClass : ''}" data-view="${l.view}">
                  ${l.name}
                </li>
              `).join('')}
            </ul>
          </nav>

          <div style="margin-top: auto; padding: 10px; background: var(--accent-gray-light); border-radius: var(--border-radius-md); font-size: 0.75rem; text-align: center; border: 1px solid var(--panel-border);">
            <strong>YY Buses Kampala</strong><br>
            Terminal System v1.2
          </div>
        </aside>
      ` : ''}

      <!-- Main Workspace View -->
      <main class="workspace" style="${!showsSidebar ? 'grid-column: span 2;' : ''}" id="workspace-view">
        <!-- Dashboard components render here -->
      </main>
    </div>
  `;

  // Attach Top Shell Event Handlers
  document.getElementById('brand-logo-btn').addEventListener('click', () => navigate('portal'));
  
  const logoutBtn = document.getElementById('btn-header-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => navigate('portal'));
  }

  // Theme Toggler
  const themeBtn = document.getElementById('theme-toggle-btn');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('yy_theme_dark', isDark ? 'true' : 'false');
  });

  // Sidebar navigation links trigger
  if (showsSidebar) {
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const viewName = e.target.getAttribute('data-view');
        navigate(viewName);
      });
    });
  }

  // Render Component Content into Workspace
  const workspaceView = document.getElementById('workspace-view');
  
  switch (currentView) {
    case 'portal':
      renderPortal(workspaceView, appState, navigate);
      break;
    case 'destinations':
      renderDestinations(workspaceView, appState, navigate);
      break;
    case 'courier-client':
      renderCourierClient(workspaceView, appState, navigate, navigationParams);
      break;
    case 'courier-handler':
      renderCourierHandler(workspaceView, appState, navigate);
      break;
    case 'courier-admin':
      renderCourierAdmin(workspaceView, appState, navigate);
      break;
    case 'bus-handler':
      renderBusHandler(workspaceView, appState, navigate);
      break;
    case 'bus-conductor':
      renderBusConductor(workspaceView, appState, navigate);
      break;
    case 'bus-manager':
      renderBusManager(workspaceView, appState, navigate);
      break;
    default:
      renderPortal(workspaceView, appState, navigate);
  }
}

// App Initialization
function init() {
  // Restore theme preference
  const cachedDark = localStorage.getItem('yy_theme_dark');
  if (cachedDark === 'true') {
    document.body.classList.add('dark-theme');
  }

  renderApp();
}

window.onload = init;
export { navigate };
