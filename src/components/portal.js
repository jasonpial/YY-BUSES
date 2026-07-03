import { formatUGX } from '../utils.js';

export function renderPortal(container, state, navigate) {
  // Compute some quick statistics
  const activeJourneys = state.journeys.filter(j => j.status === 'In Transit').length;
  const scheduledToday = state.journeys.filter(j => j.status === 'Scheduled').length;
  const packagesIntake = state.parcels.filter(p => p.status === 'Intake').length;
  const packagesInTransit = state.parcels.filter(p => p.status === 'Dispatched').length;
  const totalBuses = state.buses.length;

  container.innerHTML = `
    <div class="portal-container" style="max-width: 1100px; margin: 0 auto; padding: 2rem 0;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-size: 2.8rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary-maroon); margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          YY BUSES UGANDA
        </h2>
        <p style="font-size: 1.15rem; color: var(--text-medium); max-width: 600px; margin: 0 auto; font-weight: 500;">
          Welcome to the Integrated Transport & Courier Management Platform. Choose a system module to get started.
        </p>
      </div>

      <!-- Quick Live Stats Panel -->
      <div class="stats-grid" style="margin-bottom: 3rem;">
        <div class="stat-card" style="border-left: 4px solid var(--primary-blue);">
          <div class="stat-icon blue">🚌</div>
          <div class="stat-info">
            <span class="stat-label">Active Journeys</span>
            <span class="stat-value">${activeJourneys}</span>
            <span class="stat-trend trend-up">▲ Live Tracking</span>
          </div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--primary-maroon);">
          <div class="stat-icon maroon">📦</div>
          <div class="stat-info">
            <span class="stat-label">Parcels at Terminal</span>
            <span class="stat-value">${packagesIntake}</span>
            <span class="stat-trend trend-up">▲ Awaiting Dispatch</span>
          </div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--success);">
          <div class="stat-icon success">🚚</div>
          <div class="stat-info">
            <span class="stat-label">Parcels in Transit</span>
            <span class="stat-value">${packagesInTransit}</span>
            <span class="stat-trend trend-up">▲ En Route</span>
          </div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--info);">
          <div class="stat-icon info">📋</div>
          <div class="stat-info">
            <span class="stat-label">Scheduled Today</span>
            <span class="stat-value">${scheduledToday}</span>
            <span class="stat-trend" style="color: var(--text-light)">Total fleet size: ${totalBuses}</span>
          </div>
        </div>
      </div>

      <div class="portal-grid">
        <!-- Transportation Operations Panel -->
        <div class="portal-panel blue">
          <div class="portal-icon blue">🚌</div>
          <h3 style="font-size: 1.6rem; color: var(--primary-blue); font-weight: 700;">Bus Transport Section</h3>
          <p style="color: var(--text-medium); font-size: 0.95rem; min-height: 48px;">
            Manage passenger ticket bookings, load undercarriage cargo, track route progression, log conductor expenses, and oversee financials.
          </p>
          <div class="role-selector">
            <button class="btn btn-blue btn-block" id="btn-bus-handler">
              🎟️ Ticketing & Dispatch (Handler)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-bus-conductor" style="border-color: var(--primary-blue-light); color: var(--primary-blue);">
              📱 Journey Logs & Expenses (Conductor)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-bus-manager" style="border-color: var(--primary-blue-light); color: var(--primary-blue);">
              📊 Fleet Analytics & Live Map (Manager)
            </button>
          </div>
        </div>

        <!-- Courier Operations Panel -->
        <div class="portal-panel maroon">
          <div class="portal-icon maroon">📦</div>
          <h3 style="font-size: 1.6rem; color: var(--primary-maroon); font-weight: 700;">Courier & Parcel Section</h3>
          <p style="color: var(--text-medium); font-size: 0.95rem; min-height: 48px;">
            Calculate delivery costs, intake client packages, print labels with barcode tracking, assign to transit buses, and check out deliveries.
          </p>
          <div class="role-selector">
            <button class="btn btn-maroon btn-block" id="btn-courier-client">
              🔍 Track & Pre-Book Parcel (Client)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-courier-handler" style="border-color: var(--primary-maroon-light); color: var(--primary-maroon);">
              📥 Parcel Intake & Dispatch (Handler)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-courier-admin" style="border-color: var(--primary-maroon-light); color: var(--primary-maroon);">
              📊 Pricing & Package Audits (Admin)
            </button>
          </div>
        </div>
      </div>

      <!-- Public Info Banner -->
      <div style="margin-top: 3rem; text-align: center;">
        <button class="btn btn-secondary" id="btn-destinations-pricing" style="padding: 12px 24px;">
          🗺️ View Public Destinations & Pricing Directory
        </button>
      </div>
    </div>
  `;

  // Attach event handlers
  document.getElementById('btn-bus-handler').addEventListener('click', () => navigate('bus-handler'));
  document.getElementById('btn-bus-conductor').addEventListener('click', () => navigate('bus-conductor'));
  document.getElementById('btn-bus-manager').addEventListener('click', () => navigate('bus-manager'));
  
  document.getElementById('btn-courier-client').addEventListener('click', () => navigate('courier-client'));
  document.getElementById('btn-courier-handler').addEventListener('click', () => navigate('courier-handler'));
  document.getElementById('btn-courier-admin').addEventListener('click', () => navigate('courier-admin'));
  
  document.getElementById('btn-destinations-pricing').addEventListener('click', () => navigate('destinations'));
}
