import { formatUGX, formatDate } from '../utils.js';

export function renderBusManager(container, state, navigate) {
  // Compute analytics
  let totalTicketRevenue = 0;
  let totalCargoRevenue = 0;
  let totalExpenses = 0;
  let completedTripsCount = 0;
  let totalSeatsSoldOnCompleted = 0;
  let totalCapacityOnCompleted = 0;

  state.journeys.forEach(j => {
    // Ticket revenue
    const tktSum = Object.values(j.tickets).reduce((sum, t) => sum + t.amountPaid, 0);
    totalTicketRevenue += tktSum;

    // Cargo revenue
    const cargoSum = j.cargo.reduce((sum, c) => sum + c.chargeUGX, 0);
    totalCargoRevenue += cargoSum;

    // Expenses
    const expSum = j.expenses.reduce((sum, e) => sum + e.amount, 0);
    totalExpenses += expSum;

    // Completed seating efficiency indicators
    if (j.status === 'Completed') {
      completedTripsCount++;
      const bus = state.buses.find(b => b.id === j.busId);
      totalSeatsSoldOnCompleted += Object.keys(j.tickets).length;
      totalCapacityOnCompleted += bus ? bus.capacity : 67;
    }
  });

  const totalGrossRevenue = totalTicketRevenue + totalCargoRevenue;
  const netOperationalProfit = totalGrossRevenue - totalExpenses;
  const seatingEfficiency = totalCapacityOnCompleted > 0 
    ? (totalSeatsSoldOnCompleted / totalCapacityOnCompleted) * 100 
    : 82.5; // fallback default representation

  // Find active journey to draw on the visual timeline map
  const activeJourney = state.journeys.find(j => j.status === 'In Transit');

  container.innerHTML = `
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-blue);">📊 Bus Operations Analytics</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Consolidated business metrics, live vehicle dispatch positioning, and roster status</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Manager Financials widget row -->
    <div class="stats-grid">
      <div class="stat-card" style="border-top: 4px solid var(--primary-blue);">
        <div class="stat-icon blue">💰</div>
        <div class="stat-info">
          <span class="stat-label">Total Bus Revenues</span>
          <span class="stat-value" style="color: var(--primary-blue); font-size: 1.5rem;">${formatUGX(totalGrossRevenue)}</span>
          <span class="stat-trend" style="color: var(--text-light)">Ticketing + Cargo luggage</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--danger);">
        <div class="stat-icon" style="background: var(--danger);">⛽</div>
        <div class="stat-info">
          <span class="stat-label">Route Expenditures</span>
          <span class="stat-value" style="color: var(--danger); font-size: 1.5rem;">-${formatUGX(totalExpenses)}</span>
          <span class="stat-trend trend-down">▼ Conductor disbursements</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--success);">
        <div class="stat-icon success">📈</div>
        <div class="stat-info">
          <span class="stat-label">Net Operating Profit</span>
          <span class="stat-value" style="color: var(--success); font-size: 1.5rem;">${formatUGX(netOperationalProfit)}</span>
          <span class="stat-trend trend-up">▲ UGX Net Income</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--info);">
        <div class="stat-icon info">👥</div>
        <div class="stat-info">
          <span class="stat-label">Seating Efficiency</span>
          <span class="stat-value">${seatingEfficiency.toFixed(1)}%</span>
          <span class="stat-trend trend-up">▲ Avg completed load</span>
        </div>
      </div>
    </div>

    <!-- Visual Revenue Proportions -->
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-title-bar">
        <h3>📊 Revenue vs Expense Apportionment</h3>
      </div>
      <div class="revenue-progress-bar">
        <div class="rev-portion rev-tickets" style="width: ${(totalTicketRevenue / (totalGrossRevenue || 1)) * 100}%;">
          Tickets: ${formatUGX(totalTicketRevenue)}
        </div>
        <div class="rev-portion rev-cargo" style="width: ${(totalCargoRevenue / (totalGrossRevenue || 1)) * 100}%;">
          Cargo: ${formatUGX(totalCargoRevenue)}
        </div>
      </div>
      <div style="display: flex; gap: 20px; font-size: 0.8rem; margin-top: 8px;">
        <div><span style="display:inline-block; width:12px; height:12px; background:var(--primary-blue); margin-right:6px; vertical-align:middle; border-radius:3px;"></span>Ticket Sales</div>
        <div><span style="display:inline-block; width:12px; height:12px; background:var(--primary-maroon); margin-right:6px; vertical-align:middle; border-radius:3px;"></span>Undercarriage Cargo</div>
        <div><span style="display:inline-block; width:12px; height:12px; background:var(--danger); margin-right:6px; vertical-align:middle; border-radius:3px;"></span>Logged Expenses (${((totalExpenses / (totalGrossRevenue || 1)) * 100).toFixed(1)}% of gross)</div>
      </div>
    </div>

    <!-- Live Corridor Journey Map Monitor -->
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-title-bar">
        <h3>📍 Live Journey Corridor Monitor</h3>
        <span class="badge badge-maroon">Active Bus Positioning</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-medium); margin-bottom: 1rem;">
        Real-time GPS tracking simulator representing YY buses currently traveling along the Kampala-Eastern Highway corridor:
      </p>

      <div class="timeline-map-container">
        ${activeJourney ? `
          <div class="uganda-map-grid">
            <div style="font-weight: 700; color: var(--primary-blue); margin-bottom: 5px; font-size: 0.9rem; text-align: center;">
              Active Voyage: Voyage #${activeJourney.id.toUpperCase()} (Kampala to ${activeJourney.routeTo})
            </div>
            
            <div class="map-corridor-row">
              <!-- Background highway line -->
              <div class="map-corridor-line"></div>
              <div class="map-corridor-line-progress" style="width: ${activeJourney.progress}%;"></div>
              
              <!-- Checkpoint Nodes -->
              <div class="map-station-node active-passed">
                KLA
                <span class="station-label">Kampala</span>
              </div>
              <div class="map-station-node ${activeJourney.progress >= 30 ? (activeJourney.currentLocation.toLowerCase().includes('jinja') ? 'active-current' : 'active-passed') : ''}">
                JJA
                <span class="station-label">Jinja</span>
              </div>
              <div class="map-station-node ${activeJourney.progress >= 60 ? (activeJourney.currentLocation.toLowerCase().includes('iganga') ? 'active-current' : 'active-passed') : ''}">
                IGA
                <span class="station-label">Iganga</span>
              </div>
              <div class="map-station-node ${activeJourney.progress >= 90 ? 'active-current' : ''}">
                MBL
                <span class="station-label">Mbale final</span>
              </div>

              <!-- Pulser Avatar position -->
              <div class="bus-pulsing-avatar" style="left: calc(${activeJourney.progress}% - 35px);">
                🚌 ${state.buses.find(b => b.id === activeJourney.busId)?.regNo || 'BUS'}
              </div>
            </div>
          </div>
        ` : `
          <div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-light); flex-direction:column; gap:10px;">
            <span style="font-size:3rem;">🛰️</span>
            <strong>No bus journeys are currently in-transit on Ugandan corridors.</strong>
            <span style="font-size:0.8rem;">Monitor active departures by dispatching scheduled buses.</span>
          </div>
        `}
      </div>
    </div>

    <div class="grid-2">
      <!-- Active Departures Table -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-title-bar">
          <h3>📋 Active departures & Dispatch logs</h3>
          <span class="badge badge-blue">${state.journeys.length} logs</span>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Voyage ID</th>
                <th>Route Corridor</th>
                <th>Bus Info</th>
                <th>Crew (Driver/Conductor)</th>
                <th>Departure Time</th>
                <th>Cargo loaded</th>
                <th>Finances</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.journeys.map(j => {
                const bus = state.buses.find(b => b.id === j.busId);
                const driver = state.staff.drivers.find(d => d.id === j.driverId);
                const conductor = state.staff.conductors.find(c => c.id === j.conductorId);
                
                const tktRevenue = Object.values(j.tickets).reduce((sum, t) => sum + t.amountPaid, 0);
                const cargoRevenue = j.cargo.reduce((sum, c) => sum + c.chargeUGX, 0);
                const expTotal = j.expenses.reduce((sum, e) => sum + e.amount, 0);
                const netIncome = (tktRevenue + cargoRevenue) - expTotal;

                return `
                  <tr>
                    <td><strong>${j.id.toUpperCase()}</strong></td>
                    <td>${j.routeFrom} ➔ ${j.routeTo}</td>
                    <td>
                      <div><strong>${bus ? bus.regNo : 'N/A'}</strong></div>
                      <div style="font-size: 0.75rem; color: var(--text-light);">${bus ? bus.model : 'N/A'}</div>
                    </td>
                    <td>
                      <div style="font-size: 0.85rem;">👨‍✈️ D: ${driver ? driver.name.split(' ')[0] : 'N/A'}</div>
                      <div style="font-size: 0.85rem;">📋 C: ${conductor ? conductor.name.split(' ')[0] : 'N/A'}</div>
                    </td>
                    <td>${formatDate(j.departureTime)}</td>
                    <td>${j.cargo.length} items (${j.cargo.reduce((sum,c) => sum + c.weightKg, 0)} kg)</td>
                    <td>
                      <div style="font-size:0.85rem; color:var(--success);">Rev: ${formatUGX(tktRevenue + cargoRevenue)}</div>
                      <div style="font-size:0.85rem; color:var(--danger);">Exp: -${formatUGX(expTotal)}</div>
                      <div style="font-weight:700; font-size:0.85rem;">Net: ${formatUGX(netIncome)}</div>
                    </td>
                    <td>
                      <span class="badge ${
                        j.status === 'Completed' ? 'badge-success' :
                        j.status === 'In Transit' ? 'badge-maroon' :
                        j.status === 'Scheduled' ? 'badge-blue' : 'badge-danger'
                      }">
                        ${j.status}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fleet registry states -->
      <div class="card">
        <div class="card-title-bar">
          <h3>🚌 Fleet Status Registry</h3>
          <span class="badge badge-secondary">${state.buses.length} Buses</span>
        </div>
        <div class="table-wrapper" style="max-height: 250px;">
          <table>
            <thead>
              <tr><th>Reg No</th><th>Specs</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${state.buses.map(b => `
                <tr>
                  <td><strong>${b.regNo}</strong></td>
                  <td>${b.model}</td>
                  <td>
                    <span class="badge ${b.status === 'Active' ? 'badge-success' : 'badge-warning'}">
                      ${b.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Staff duty details -->
      <div class="card">
        <div class="card-title-bar">
          <h3>👨‍✈️ Crew Duty Status Roster</h3>
        </div>
        <div class="table-wrapper" style="max-height: 250px;">
          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${state.staff.drivers.map(d => `
                <tr>
                  <td><strong>${d.name}</strong></td>
                  <td>Driver</td>
                  <td>
                    <span class="badge ${d.status === 'Available' ? 'badge-success' : 'badge-maroon'}">
                      ${d.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
              ${state.staff.conductors.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>Conductor</td>
                  <td>
                    <span class="badge ${c.status === 'Available' ? 'badge-success' : 'badge-maroon'}">
                      ${c.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Back to portal trigger
  document.getElementById('btn-back-portal').addEventListener('click', () => navigate('portal'));
}
