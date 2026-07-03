import { formatUGX, formatDate } from '../utils.js';

export function renderCourierAdmin(container, state, navigate) {
  // Calculations for analytics
  const totalParcels = state.parcels.length;
  const activeLogistics = state.parcels.filter(p => p.status === 'Intake' || p.status === 'Dispatched' || p.status === 'Arrived').length;
  const completedLogistics = state.parcels.filter(p => p.status === 'Collected').length;
  const draftBookingsCount = state.parcels.filter(p => p.status === 'Draft').length;

  // Calculate gross revenue (exclude Draft status)
  const courierRevenue = state.parcels
    .filter(p => p.status !== 'Draft')
    .reduce((sum, p) => sum + p.priceUGX, 0);

  // Group packages by destination for route metrics
  const routeStats = {};
  state.destinations.forEach(d => {
    routeStats[d.name] = { count: 0, revenue: 0 };
  });

  state.parcels.forEach(p => {
    if (p.status !== 'Draft' && routeStats[p.routeTo]) {
      routeStats[p.routeTo].count++;
      routeStats[p.routeTo].revenue += p.priceUGX;
    }
  });

  container.innerHTML = `
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-maroon);">📊 Courier Admin Dashboard</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Overview parcel volumes, revenue growth, adjust route tariffs, and audit records</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Analytics Dashboard Cards -->
    <div class="stats-grid">
      <div class="stat-card" style="border-top: 4px solid var(--primary-maroon);">
        <div class="stat-icon maroon">💵</div>
        <div class="stat-info">
          <span class="stat-label">Gross Parcel Revenue</span>
          <span class="stat-value" style="color: var(--primary-maroon); font-size: 1.5rem;">${formatUGX(courierRevenue)}</span>
          <span class="stat-trend trend-up">▲ Satisfied Clients</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--primary-blue);">
        <div class="stat-icon blue">📦</div>
        <div class="stat-info">
          <span class="stat-label">Total Shipments</span>
          <span class="stat-value">${totalParcels}</span>
          <span class="stat-trend trend-up">▲ In system ledger</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--info);">
        <div class="stat-icon info">⏳</div>
        <div class="stat-info">
          <span class="stat-label">Active Cargo</span>
          <span class="stat-value">${activeLogistics}</span>
          <span class="stat-trend" style="color: var(--warning)">● In warehouse / Bus</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--success);">
        <div class="stat-icon success">🤝</div>
        <div class="stat-info">
          <span class="stat-label">Delivered & Collected</span>
          <span class="stat-value">${completedLogistics}</span>
          <span class="stat-trend trend-up">▲ Archives closed</span>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Route Tariffs Modifier -->
      <div class="card">
        <div class="card-title-bar">
          <h3>📍 Route Pricing Adjustment</h3>
          <span class="badge badge-maroon">Manage Tariffs</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-medium); margin-bottom: 1rem;">
          YY Courier pricing rules operate on a baseline booking charge plus weight calculation per kg. Adjust tariffs below:
        </p>
        <div class="table-wrapper" style="max-height: 380px;">
          <table>
            <thead>
              <tr>
                <th>Route Destination</th>
                <th>Base Fare (UGX)</th>
                <th>Rate / Kg (UGX)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.destinations.map(d => `
                <tr>
                  <td><strong>Kampala to ${d.name}</strong></td>
                  <td>
                    <input type="number" id="base-tariff-${d.id}" value="${d.courierBase}" step="500" style="padding: 6px; font-size: 0.85rem; width: 100px;">
                  </td>
                  <td>
                    <input type="number" id="kg-tariff-${d.id}" value="${d.courierPerKg}" step="100" style="padding: 6px; font-size: 0.85rem; width: 80px;">
                  </td>
                  <td>
                    <button class="btn btn-sm btn-blue btn-save-tariff" data-id="${d.id}">Save</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Volume Performance Chart -->
      <div class="card">
        <div class="card-title-bar">
          <h3>📈 Regional Route Performance</h3>
          <span class="badge badge-blue">Sales Volume</span>
        </div>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 14px;">
          ${Object.entries(routeStats).map(([routeName, metrics]) => {
            const percentage = courierRevenue > 0 ? (metrics.revenue / courierRevenue) * 100 : 0;
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">
                  <span>Kampala ➔ ${routeName}</span>
                  <span style="color: var(--primary-maroon);">${metrics.count} pkgs (${formatUGX(metrics.revenue)})</span>
                </div>
                <div style="height: 12px; background: var(--accent-gray-medium); border-radius: 6px; overflow: hidden;">
                  <div style="width: ${Math.max(3, percentage)}%; height: 100%; background: linear-gradient(90deg, var(--primary-blue), var(--primary-maroon)); border-radius: 6px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Complete Ledger Audit -->
    <div class="card" style="margin-top: 1.5rem;">
      <div class="card-title-bar">
        <h3>📜 Unified Courier Ledger & Auditing</h3>
        <span class="badge badge-secondary">${state.parcels.length} Transactions</span>
      </div>

      <!-- Filters Row -->
      <div style="display: flex; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap;">
        <select id="filter-audit-status" style="max-width: 150px; font-size: 0.85rem; padding: 6px 10px;">
          <option value="ALL">All Statuses</option>
          <option value="Intake">Intake</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Arrived">Arrived</option>
          <option value="Collected">Collected</option>
          <option value="Draft">Draft Prebookings</option>
        </select>
        <select id="filter-audit-route" style="max-width: 180px; font-size: 0.85rem; padding: 6px 10px;">
          <option value="ALL">All Destinations</option>
          ${state.destinations.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
        </select>
        <button class="btn btn-secondary btn-sm" id="btn-reset-audit-filters">Reset Filters</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Destination</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Parcel details</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="ledger-audit-tbody">
            ${state.parcels.map(p => `
              <tr class="ledger-row" data-status="${p.status}" data-destination="${p.routeTo}">
                <td><strong style="font-family: monospace;">${p.id}</strong></td>
                <td>Kampala ➔ ${p.routeTo}</td>
                <td>${p.senderName}</td>
                <td>${p.receiverName}</td>
                <td><span style="font-size: 0.85rem; color: var(--text-medium);">${p.description} (${p.weightKg} kg)</span></td>
                <td style="font-weight: 600; color: var(--primary-maroon);">${formatUGX(p.priceUGX)}</td>
                <td>
                  <span class="badge ${
                    p.status === 'Collected' ? 'badge-success' :
                    p.status === 'Arrived' ? 'badge-info' :
                    p.status === 'Dispatched' ? 'badge-maroon' : 
                    p.status === 'Draft' ? 'badge-secondary' : 'badge-warning'
                  }">
                    ${p.status}
                  </span>
                </td>
                <td style="font-size: 0.75rem; color: var(--text-light);">${formatDate(p.createdDate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // --- Tariff Adjustment Actions ---
  const saveTariffButtons = document.querySelectorAll('.btn-save-tariff');
  saveTariffButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const baseVal = parseFloat(document.getElementById(`base-tariff-${id}`).value) || 0;
      const kgVal = parseFloat(document.getElementById(`kg-tariff-${id}`).value) || 0;

      navigate('update-state', (currentState) => {
        const dest = currentState.destinations.find(d => d.id === id);
        if (dest) {
          dest.courierBase = baseVal;
          dest.courierPerKg = kgVal;
        }
        return currentState;
      });

      alert(`Pricing rules updated successfully for route destination!`);
      navigate('courier-admin'); // Reload view
    });
  });

  // --- Auditing Filters ---
  const filterStatus = document.getElementById('filter-audit-status');
  const filterRoute = document.getElementById('filter-audit-route');
  const btnResetFilters = document.getElementById('btn-reset-audit-filters');

  function applyLedgerFilters() {
    const selectedStatus = filterStatus.value;
    const selectedRoute = filterRoute.value;
    const rows = document.querySelectorAll('.ledger-row');

    rows.forEach(row => {
      const rowStatus = row.getAttribute('data-status');
      const rowDest = row.getAttribute('data-destination');

      const statusMatch = selectedStatus === 'ALL' || rowStatus === selectedStatus;
      const routeMatch = selectedRoute === 'ALL' || rowDest === selectedRoute;

      if (statusMatch && routeMatch) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });
  }

  filterStatus.addEventListener('change', applyLedgerFilters);
  filterRoute.addEventListener('change', applyLedgerFilters);
  btnResetFilters.addEventListener('click', () => {
    filterStatus.value = 'ALL';
    filterRoute.value = 'ALL';
    applyLedgerFilters();
  });
}
