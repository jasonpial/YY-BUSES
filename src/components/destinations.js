import { formatUGX, calculateCourierPrice } from '../utils.js';

export function renderDestinations(container, state, navigate) {
  container.innerHTML = `
    <div class="destinations-hero">
      <h2>Routes & Pricing Directory</h2>
      <p>Official schedules, passenger fares, and parcel delivery rates for YY Buses Uganda</p>
    </div>

    <div class="grid-2">
      <!-- Destinations List -->
      <div class="card">
        <div class="card-title-bar">
          <h3 style="color: var(--primary-blue)">📍 Active Stations & Rates</h3>
          <span class="badge badge-blue">8 Hubs</span>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Code</th>
                <th>Passenger Fare</th>
                <th>Courier Base</th>
                <th>Per Kg Rate</th>
              </tr>
            </thead>
            <tbody id="destinations-list-tbody">
              ${state.destinations.map(d => `
                <tr>
                  <td><strong>Kampala to ${d.name}</strong></td>
                  <td><span class="badge badge-secondary">${d.code}</span></td>
                  <td style="font-weight: 600; color: var(--primary-blue);">${formatUGX(d.ticketPrice)}</td>
                  <td>${formatUGX(d.courierBase)}</td>
                  <td style="color: var(--text-medium); font-size: 0.85rem;">+${formatUGX(d.courierPerKg)} / kg</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Live Pricing Calculator -->
      <div class="card calculator-card">
        <div class="card-title-bar">
          <h3 style="color: var(--primary-maroon)">📦 Parcel Cost Calculator</h3>
          <span class="badge badge-maroon">Quick Estimate</span>
        </div>
        
        <form id="calc-form">
          <div class="form-group">
            <label for="calc-route">Select Route (From Kampala to)</label>
            <select id="calc-route" required>
              ${state.destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="calc-weight">Package Weight (kg)</label>
              <input type="number" id="calc-weight" min="0.1" step="0.1" value="2.0" required>
            </div>

            <div class="form-group">
              <label for="calc-size">Approx. Size</label>
              <select id="calc-size">
                <option value="small">Small (Envelope / Document pouch)</option>
                <option value="medium" selected>Medium (Shoebox / Laptop bag)</option>
                <option value="large">Large (Suitcase / Large sack)</option>
                <option value="extra-large">Extra Large (Undercarriage commercial sack)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
            <input type="checkbox" id="calc-fragile" style="width: auto; margin-right: 6px; cursor: pointer;">
            <label for="calc-fragile" style="margin-bottom: 0; cursor: pointer;">Requires Fragile/Special Handling (+${formatUGX(5000)})</label>
          </div>

          <div id="calc-result" style="margin-top: 1.5rem; padding: 1rem; border-radius: var(--border-radius-md); background: var(--primary-maroon-light); border: 1px solid rgba(122,0,22,0.15); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary-maroon); font-weight: 700; display: block;">Estimated Fee</span>
              <strong id="calc-price-display" style="font-size: 1.8rem; font-family: var(--font-heading); color: var(--primary-maroon);">UGX 15,600</strong>
            </div>
            <button type="button" class="btn btn-maroon btn-sm" id="btn-prebook-shortcut">Pre-Book Parcel Now</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Active Schedules Grid -->
    <div class="card" style="margin-top: 1.5rem;">
      <div class="card-title-bar">
        <h3 style="color: var(--primary-blue)">📅 Scheduled Departures (Today)</h3>
        <span class="badge badge-success">Active departures</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Journey Code</th>
              <th>Route</th>
              <th>Bus Reg No</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>Booking Status</th>
            </tr>
          </thead>
          <tbody>
            ${state.journeys.map(j => {
              const bus = state.buses.find(b => b.id === j.busId);
              const soldSeats = Object.keys(j.tickets).length;
              const remainingSeats = bus ? bus.capacity - soldSeats : 0;
              
              let statusBadge = '';
              if (j.status === 'In Transit') statusBadge = `<span class="badge badge-maroon">In Transit</span>`;
              else if (j.status === 'Scheduled') statusBadge = `<span class="badge badge-blue">Scheduled</span>`;
              else if (j.status === 'Completed') statusBadge = `<span class="badge badge-success">Completed</span>`;
              else statusBadge = `<span class="badge badge-danger">Cancelled</span>`;

              return `
                <tr>
                  <td><strong>${j.id.toUpperCase()}</strong></td>
                  <td>${j.routeFrom} ➔ ${j.routeTo}</td>
                  <td><code style="font-weight: 700; font-size: 0.95rem; color: var(--primary-blue);">${bus ? bus.regNo : 'N/A'}</code></td>
                  <td>${new Date(j.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                  <td>${statusBadge}</td>
                  <td>
                    ${j.status === 'Scheduled' 
                      ? `<span style="font-weight: 600; color: var(--success);">${remainingSeats} Seats Available</span>`
                      : `<span style="color: var(--text-light); font-size: 0.85rem;">Booking closed</span>`
                    }
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Calculator update logic
  const calcForm = document.getElementById('calc-form');
  const routeSelect = document.getElementById('calc-route');
  const weightInput = document.getElementById('calc-weight');
  const sizeSelect = document.getElementById('calc-size');
  const fragileCheck = document.getElementById('calc-fragile');
  const priceDisplay = document.getElementById('calc-price-display');

  const updateCalculation = () => {
    const routeId = routeSelect.value;
    const weight = parseFloat(weightInput.value) || 0;
    const size = sizeSelect.value;
    const isFragile = fragileCheck.checked;
    
    const route = state.destinations.find(d => d.id === routeId);
    if (!route) return;

    const price = calculateCourierPrice(weight, route.courierBase, route.courierPerKg, isFragile, size);
    priceDisplay.textContent = formatUGX(price);
  };

  routeSelect.addEventListener('change', updateCalculation);
  weightInput.addEventListener('input', updateCalculation);
  sizeSelect.addEventListener('change', updateCalculation);
  fragileCheck.addEventListener('change', updateCalculation);

  // Initial calculation trigger
  updateCalculation();

  // Pre-book shortcut
  document.getElementById('btn-prebook-shortcut').addEventListener('click', () => {
    const routeId = routeSelect.value;
    const weight = weightInput.value;
    const size = sizeSelect.value;
    const isFragile = fragileCheck.checked;
    
    // Pass search queries or values to pre-fill client booking
    navigate('courier-client', {
      prefill: { routeId, weight, size, isFragile }
    });
  });
}
