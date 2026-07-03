import { formatUGX, formatDate } from '../utils.js';

export function renderBusConductor(container, state, navigate) {
  // Find conductor's assigned active or scheduled journeys
  // In demo we can list all active/scheduled journeys and let them act as conductor
  const ongoingJourneys = state.journeys.filter(j => j.status === 'Scheduled' || j.status === 'In Transit');
  
  let selectedJourneyId = ongoingJourneys[0]?.id || '';

  function drawView() {
    const journey = state.journeys.find(j => j.id === selectedJourneyId);
    const bus = journey ? state.buses.find(b => b.id === journey.busId) : null;
    const capacity = bus ? bus.capacity : 67;
    const tickets = journey ? journey.tickets : {};
    const totalFareCollected = Object.values(tickets).reduce((sum, t) => sum + t.amountPaid, 0);
    const totalExpensesLogged = journey ? journey.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;

    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2 style="color: var(--primary-maroon);">📱 Bus Conductor Log</h2>
          <p style="color: var(--text-medium); font-size: 0.9rem;">Mobile terminal for checkpoint logs, roadside sales, and expense entries</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
      </div>

      <!-- Select active voyage -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="form-group" style="margin-bottom: 0;">
          <label for="conductor-journey-select" style="font-weight: 700;">Select Your Assigned Active Voyage</label>
          <select id="conductor-journey-select" style="margin-top: 4px;">
            ${ongoingJourneys.map(j => `
              <option value="${j.id}" ${j.id === selectedJourneyId ? 'selected' : ''}>
                [${j.id.toUpperCase()}] ${j.routeFrom} ➔ ${j.routeTo} (${j.status})
              </option>
            `).join('')}
            ${ongoingJourneys.length === 0 ? '<option value="">-- No Active Journeys to Manage --</option>' : ''}
          </select>
        </div>
      </div>

      ${!journey ? `
        <div class="card" style="text-align: center; padding: 4rem 1rem;">
          <span style="font-size: 3rem;">📋</span>
          <h3 style="color: var(--text-medium); margin-top: 10px;">No Active Journey Assinged</h3>
          <p style="color: var(--text-light); max-width: 400px; margin: 6px auto;">
            Ensure there is an active scheduled bus route dispatched in the system to load the mobile conductor terminal.
          </p>
        </div>
      ` : `
        <!-- Mobile dashboard summary grid -->
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 1.5rem;">
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">💰</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Fare Cash</span>
              <span class="stat-value" style="font-size: 1.15rem; color: var(--success);">${formatUGX(totalFareCollected)}</span>
            </div>
          </div>
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">⛽</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Expenses</span>
              <span class="stat-value" style="font-size: 1.15rem; color: var(--danger);">${formatUGX(totalExpensesLogged)}</span>
            </div>
          </div>
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">🎟️</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Passengers</span>
              <span class="stat-value" style="font-size: 1.15rem;">${Object.keys(tickets).length} / ${capacity}</span>
            </div>
          </div>
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">📍</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Location</span>
              <span class="stat-value" style="font-size: 1.15rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 110px;">${journey.currentLocation}</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Section 1: Journey Progression Checkpoint Log -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-maroon)">📍 Route Progression Checkpoints</h3>
              <span class="badge badge-maroon">${journey.progress}% Done</span>
            </div>
            
            <div style="margin: 1rem 0;">
              <span style="font-size: 0.85rem; color: var(--text-medium); font-weight: 600;">Current Station Stop:</span>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-blue); margin-top: 2px;">
                🏢 ${journey.currentLocation}
              </div>
            </div>

            <!-- Progression actions -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 1.5rem;">
              <label style="font-weight: 700;">Check-in to next Uganda Transit Stop:</label>
              
              ${journey.status === 'Scheduled' ? `
                <button class="btn btn-blue btn-block" id="btn-start-journey">
                  🏁 Depart Kampala Terminal (Start Voyage)
                </button>
              ` : journey.status === 'In Transit' ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <button class="btn btn-secondary btn-sm" id="btn-advance-stop">
                    📍 Arrived next Hub stop
                  </button>
                  <button class="btn btn-success btn-sm" id="btn-complete-journey">
                    🏁 Complete Journey
                  </button>
                </div>
              ` : `
                <div style="text-align: center; color: var(--success); font-weight: 700; padding: 10px; background: var(--success-light); border-radius: 6px;">
                  ✓ Journey Completed at Final Hub
                </div>
              `}
            </div>
          </div>

          <!-- Section 2: Operational Expense Logger -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-maroon)">⛽ Log Route Expense</h3>
              <span class="badge badge-danger">${journey.expenses.length} Entries</span>
            </div>
            
            <form id="conductor-expense-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="exp-category">Expense Type</label>
                  <select id="exp-category" required>
                    <option value="Fuel">Fuel stop</option>
                    <option value="Police/Tolls">Traffic Police / Toll gate</option>
                    <option value="Meals">Conductor/Driver Meals</option>
                    <option value="Maintenance">Emergency repairs</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exp-amount">Amount paid (UGX)</label>
                  <input type="number" id="exp-amount" min="500" step="500" value="20000" required>
                </div>
              </div>

              <div class="form-group">
                <label for="exp-desc">Detailed Description</label>
                <input type="text" id="exp-desc" placeholder="e.g. 50 liters diesel shell Jinja, Highway police checkpoint ticket" required>
              </div>

              <button type="submit" class="btn btn-maroon btn-sm btn-block">
                💾 Log Operational Expense
              </button>
            </form>

            <!-- Exp ledger list -->
            ${journey.expenses.length > 0 ? `
              <div style="margin-top: 10px; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px; max-height: 120px; overflow-y: auto;">
                <table style="font-size: 0.8rem;">
                  <thead>
                    <tr><th>Type</th><th>Description</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    ${journey.expenses.map(e => `
                      <tr>
                        <td><strong>${e.category}</strong></td>
                        <td>${e.description}</td>
                        <td style="color: var(--danger); font-weight:600;">-${formatUGX(e.amount)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="grid-2" style="margin-top: 1.5rem;">
          <!-- Section 3: Mid-Journey Ticket Seller (Waysiders) -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-blue)">🎟️ Sell Waysider Cash Ticket</h3>
              <span class="badge badge-blue">Roadside cash sales</span>
            </div>
            
            <form id="wayside-sale-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="way-seat">Choose Vacant Seat</label>
                  <select id="way-seat" required>
                    ${Array.from({length: capacity}).map((_, i) => {
                      const num = i + 1;
                      if (!tickets[num]) {
                        return `<option value="${num}">Seat #${num}</option>`;
                      }
                      return '';
                    }).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="way-fare">Midway Fare (UGX)</label>
                  <input type="number" id="way-fare" value="25000" min="5000" step="1000" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="way-name">Wayside Passenger Name</label>
                  <input type="text" id="way-name" value="Waysider Client" required>
                </div>
                <div class="form-group">
                  <label for="way-phone">Phone Number</label>
                  <input type="text" id="way-phone" value="+256 " required>
                </div>
              </div>

              <button type="submit" class="btn btn-blue btn-sm btn-block">
                💾 Log Cash Ticket Sale
              </button>
            </form>
          </div>

          <!-- Section 4: Passenger Seating Manifest & Boarding verification -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-blue)">📋 Seat Boarding Manifest</h3>
              <span class="badge badge-success">${Object.keys(tickets).length} Booked</span>
            </div>
            
            <div class="table-wrapper" style="max-height: 280px; overflow-y: auto;">
              <table>
                <thead>
                  <tr>
                    <th>Seat</th>
                    <th>Passenger</th>
                    <th>Status</th>
                    <th>Validation Code</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.values(tickets).sort((a,b) => a.seatNo - b.seatNo).map(t => `
                    <tr>
                      <td><strong>Seat ${t.seatNo}</strong></td>
                      <td>
                        <strong>${t.passengerName}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${t.passengerPhone}</div>
                      </td>
                      <td>
                        <span class="badge ${t.status === 'Boarded' ? 'badge-success' : 'badge-warning'}">
                          ${t.status || 'CheckedIn'}
                        </span>
                      </td>
                      <td>
                        ${t.status !== 'Boarded' 
                          ? `<button class="btn btn-xs btn-success btn-board-manifest" data-seat="${t.seatNo}">Board</button>`
                          : `<span style="font-size: 0.75rem; color: var(--text-light);">On Board</span>`
                        }
                      </td>
                    </tr>
                  `).join('')}
                  ${Object.keys(tickets).length === 0 ? `
                    <tr><td colspan="4" style="text-align: center; color: var(--text-light)">Manifest empty. No passenger tickets sold.</td></tr>
                  ` : ''}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `}
    `;;

      // --- Progress Button Triggers ---
      const btnStart = document.getElementById('btn-start-journey');
      const btnAdvance = document.getElementById('btn-advance-stop');
      const btnComplete = document.getElementById('btn-complete-journey');

      if (btnStart) {
        btnStart.addEventListener('click', () => {
          navigate('update-state', (currentState) => {
            const j = currentState.journeys.find(x => x.id === selectedJourneyId);
            if (j) {
              j.status = 'In Transit';
              j.currentLocation = 'Kampala (Departed)';
              j.progress = 10;
            }
            return currentState;
          });
          alert("Bus has departed Kampala Terminal! Voyage is now live.");
          drawView();
        });
      }

      if (btnAdvance) {
        btnAdvance.addEventListener('click', () => {
          const nextStop = prompt("Enter the name of the next checkpoint/town the bus has reached (e.g. Jinja, Iganga, Mbale):");
          if (!nextStop) return;

          navigate('update-state', (currentState) => {
            const j = currentState.journeys.find(x => x.id === selectedJourneyId);
            if (j) {
              j.currentLocation = nextStop;
              j.progress = Math.min(j.progress + 25, 90); // increase progress percentage
            }
            return currentState;
          });
          drawView();
        });
      }

      if (btnComplete) {
        btnComplete.addEventListener('click', () => {
          navigate('update-state', (currentState) => {
            const j = currentState.journeys.find(x => x.id === selectedJourneyId);
            if (j) {
              j.status = 'Completed';
              j.currentLocation = j.routeTo;
              j.progress = 100;

              // Roster the driver and conductor back to "Available"
              const driver = currentState.staff.drivers.find(d => d.id === j.driverId);
              if (driver) driver.status = 'Available';

              const conductor = currentState.staff.conductors.find(c => c.id === j.conductorId);
              if (conductor) conductor.status = 'Available';
            }
            return currentState;
          });
          alert("Voyage complete! Bus arrived at final terminal. Resources returned to roster.");
          drawView();
        });
      }

      // --- Log Expense Trigger ---
      const expenseForm = document.getElementById('conductor-expense-form');
      if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const category = document.getElementById('exp-category').value;
          const amount = parseFloat(document.getElementById('exp-amount').value) || 0;
          const desc = document.getElementById('exp-desc').value;

          navigate('update-state', (currentState) => {
            const j = currentState.journeys.find(x => x.id === selectedJourneyId);
            if (j) {
              j.expenses.push({
                id: `exp-${Math.floor(1000 + Math.random() * 9000)}`,
                category,
                description: desc,
                amount,
                time: new Date().toISOString()
              });
            }
            return currentState;
          });

          alert("Operational route expense logged!");
          drawView();
        });
      }

      // --- Waysider ticket log trigger ---
      const waysideForm = document.getElementById('wayside-sale-form');
      if (waysideForm) {
        waysideForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const seatNo = parseInt(document.getElementById('way-seat').value);
          const fare = parseFloat(document.getElementById('way-fare').value) || 20000;
          const name = document.getElementById('way-name').value;
          const phone = document.getElementById('way-phone').value;

          const ticketId = `YY-TKT-${Math.floor(100000 + Math.random() * 900000)}`;

          navigate('update-state', (currentState) => {
            const j = currentState.journeys.find(x => x.id === selectedJourneyId);
            if (j) {
              j.tickets[seatNo] = {
                ticketId,
                seatNo,
                passengerName: name,
                passengerPhone: phone,
                amountPaid: fare,
                purchaseDate: new Date().toISOString(),
                status: 'Boarded'
              };
            }
            return currentState;
          });

          alert(`Logged mid-journey passenger ticket sale for Seat #${seatNo}!`);
          drawView();
        });
      }

      // --- Board manifest passenger checker ---
      const boardButtons = document.querySelectorAll('.btn-board-manifest');
      boardButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const seatNo = parseInt(e.target.getAttribute('data-seat'));
          
          navigate('update-state', (currentState) => {
            const j = currentState.journeys.find(x => x.id === selectedJourneyId);
            if (j && j.tickets[seatNo]) {
              j.tickets[seatNo].status = 'Boarded';
            }
            return currentState;
          });
          drawView();
        });
      });

      // Roster Voyage Select Dropdown
      const jnySel = document.getElementById('conductor-journey-select');
      if (jnySel) {
        jnySel.addEventListener('change', (e) => {
          selectedJourneyId = e.target.value;
          drawView();
        });
      }

    // Back to portal button
    document.getElementById('btn-back-portal').addEventListener('click', () => navigate('portal'));
  }

  drawView();
}
