import { formatUGX, generateId, formatDate, generateBarcodeSVG } from '../utils.js';

export function renderBusHandler(container, state, navigate) {
  // Available resources
  const activeBuses = state.buses.filter(b => b.status === 'Active');
  const availableDrivers = state.staff.drivers.filter(d => d.status === 'Available');
  const availableConductors = state.staff.conductors.filter(c => c.status === 'Available');

  // Active scheduled journeys
  const ongoingJourneys = state.journeys.filter(j => j.status === 'Scheduled' || j.status === 'In Transit');

  // State local parameters to hold current selected journey and selected seats
  let selectedJourneyId = ongoingJourneys[0]?.id || '';
  let selectedSeats = [];

  function drawView() {
    const selectedJourney = state.journeys.find(j => j.id === selectedJourneyId);
    const bus = selectedJourney ? state.buses.find(b => b.id === selectedJourney.busId) : null;
    const capacity = bus ? bus.capacity : 67;
    const soldTickets = selectedJourney ? selectedJourney.tickets : {};
    const routeFare = selectedJourney ? state.destinations.find(d => d.name === selectedJourney.routeTo)?.ticketPrice || 30000 : 30000;

    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2 style="color: var(--primary-blue);">🎟️ Bus Dispatch & Ticketing</h2>
          <p style="color: var(--text-medium); font-size: 0.9rem;">Roster departures, book passenger seats, and manage undercarriage commercial cargo</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
      </div>

      <div class="grid-3" style="grid-template-columns: 320px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Column 1: Journey Selector & Roster Scheduling Form -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- 1. Select Active Journey -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-blue)">1. Select Departure</h3>
            </div>
            <div class="form-group">
              <label for="select-ticketing-journey">Active Journey Ticket Desk</label>
              <select id="select-ticketing-journey" style="margin-top: 4px;">
                ${ongoingJourneys.map(j => `
                  <option value="${j.id}" ${j.id === selectedJourneyId ? 'selected' : ''}>
                    [${j.id.toUpperCase()}] ${j.routeFrom} ➔ ${j.routeTo} (${j.status})
                  </option>
                `).join('')}
                ${ongoingJourneys.length === 0 ? '<option value="">-- No Active Journeys --</option>' : ''}
              </select>
            </div>
            ${selectedJourney ? `
              <div style="font-size: 0.8rem; background: var(--primary-blue-light); padding: 10px; border-radius: 8px;">
                <div class="receipt-row"><span>Bus Assigned:</span><strong>${bus ? bus.regNo : 'N/A'}</strong></div>
                <div class="receipt-row"><span>Driver:</span><span>${state.staff.drivers.find(d => d.id === selectedJourney.driverId)?.name || 'N/A'}</span></div>
                <div class="receipt-row"><span>Conductor:</span><span>${state.staff.conductors.find(c => c.id === selectedJourney.conductorId)?.name || 'N/A'}</span></div>
                <div class="receipt-row"><span>Fare Rate:</span><strong>${formatUGX(routeFare)}</strong></div>
              </div>
            ` : ''}
          </div>

          <!-- 2. Daily Roster Scheduler Form -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-maroon);">Create Route Roster</h3>
              <span class="badge badge-maroon">New Journey</span>
            </div>
            <form id="roster-form">
              <div class="form-group">
                <label for="rost-route">Destination Route</label>
                <select id="rost-route" required>
                  ${state.destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-bus">Assign Bus Fleet</label>
                <select id="rost-bus" required>
                  ${activeBuses.map(b => `<option value="${b.id}">${b.regNo} (${b.model})</option>`).join('')}
                  ${activeBuses.length === 0 ? '<option value="" disabled>No Buses Available</option>' : ''}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-driver">Assign Driver</label>
                <select id="rost-driver" required>
                  ${availableDrivers.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                  ${availableDrivers.length === 0 ? '<option value="" disabled>No Drivers Available</option>' : ''}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-conductor">Assign Conductor</label>
                <select id="rost-conductor" required>
                  ${availableConductors.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                  ${availableConductors.length === 0 ? '<option value="" disabled>No Conductors Available</option>' : ''}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-time">Scheduled Departure Time</label>
                <input type="time" id="rost-time" required>
              </div>

              <button type="submit" class="btn btn-maroon btn-block btn-sm" ${activeBuses.length === 0 || availableDrivers.length === 0 || availableConductors.length === 0 ? 'disabled' : ''}>
                📋 Schedule & Open Booking
              </button>
            </form>
          </div>
        </div>

        <!-- Column 2: 67-Seater Interactive Seating Layout & Ticketing Checkout -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${!selectedJourney ? `
            <div class="card" style="text-align: center; padding: 4rem 1rem;">
              <span style="font-size: 3rem;">🚌</span>
              <h3 style="color: var(--text-medium); margin-top: 10px;">No Active Journey Selected</h3>
              <p style="color: var(--text-light); max-width: 400px; margin: 6px auto;">
                Schedule a route on the left panel or check in to a current scheduled roster to access the interactive seat desk.
              </p>
            </div>
          ` : `
            <div class="grid-2" style="grid-template-columns: 1.1fr 0.9fr; gap: 1.5rem; align-items: start;">
              <!-- Seating cabin chart -->
              <div class="bus-seating-container">
                <div class="bus-layout-header">
                  <span style="font-weight: 700; color: var(--primary-blue);">67-SEATER BUS SEATING MAP</span>
                  <span class="badge badge-blue">${Object.keys(soldTickets).length} / ${capacity} Sold</span>
                </div>
                
                <div class="bus-cabin">
                  <!-- Front Cabin driver steering representation -->
                  <div class="cabin-front">
                    <div class="driver-seat">🎛️</div>
                    <div class="door-way">🚪 Entrance</div>
                  </div>

                  <!-- 67 Seat Layout (3 left, aisle, 2 right) -->
                  <div class="cabin-seats">
                    ${renderCabinSeats(capacity, soldTickets)}
                  </div>
                </div>

                <div class="seat-legend">
                  <div class="legend-item"><div class="legend-box available"></div><span>Available</span></div>
                  <div class="legend-item"><div class="legend-box selected"></div><span>Selected</span></div>
                  <div class="legend-item"><div class="legend-box occupied"></div><span>Sold</span></div>
                </div>
              </div>

              <!-- Ticket Checkout & Undercarriage Cargo Manager -->
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Section A: Ticketing office booking -->
                <div class="card">
                  <div class="card-title-bar">
                    <h3 style="color: var(--primary-blue);">🎫 Ticket Checkout</h3>
                  </div>
                  
                  <div id="checkout-panel-content">
                    <p style="font-size: 0.8rem; color: var(--text-medium); margin-bottom: 1rem;">
                      Select vacant seat(s) on the bus cabin grid to activate ticket billing.
                    </p>

                    <form id="passenger-ticket-form" style="display: ${selectedSeats.length > 0 ? 'block' : 'none'};">
                      <div class="form-group" style="background: var(--accent-gray-light); padding: 8px; border-radius: 6px;">
                        <span style="font-size: 0.85rem; font-weight: 600;">Selected Seats: </span>
                        <strong id="display-selected-seats" style="color: var(--primary-maroon); font-size: 1rem;">${selectedSeats.join(', ')}</strong>
                      </div>

                      <div class="form-group">
                        <label for="tkt-name">Passenger Name</label>
                        <input type="text" id="tkt-name" placeholder="e.g. Kato Ivan" required>
                      </div>

                      <div class="form-group">
                        <label for="tkt-phone">Passenger Phone Number</label>
                        <input type="text" id="tkt-phone" placeholder="e.g. +256 782 112233" required>
                      </div>

                      <div style="margin-top: 1rem; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px;">
                        <div class="receipt-row">
                          <span>Fare Per Seat:</span>
                          <span>${formatUGX(routeFare)}</span>
                        </div>
                        <div class="receipt-row" style="font-size: 1.25rem;">
                          <span>Total Amount:</span>
                          <strong style="color: var(--primary-blue);" id="display-total-fare">${formatUGX(routeFare * selectedSeats.length)}</strong>
                        </div>
                      </div>

                      <button type="submit" class="btn btn-blue btn-block btn-sm" style="margin-top: 10px;">
                        🖨️ Purchase & Print Tickets
                      </button>
                    </form>
                  </div>
                </div>

                <!-- Section B: Undercarriage cargo logger -->
                <div class="card">
                  <div class="card-title-bar">
                    <h3 style="color: var(--primary-maroon);">📦 Luggage & Undercarriage Cargo</h3>
                    <span class="badge badge-maroon">${selectedJourney.cargo.length} Items</span>
                  </div>
                  
                  <form id="cargo-booking-form">
                    <div class="form-group">
                      <label for="crg-desc">Cargo Description</label>
                      <input type="text" id="crg-desc" placeholder="e.g. Bag of Mbale Coffee Beans, electronics carton" required>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="crg-weight">Est. Weight (kg)</label>
                        <input type="number" id="crg-weight" min="1" value="20" required>
                      </div>
                      <div class="form-group">
                        <label for="crg-charge">Cargo Loading Fee (UGX)</label>
                        <input type="number" id="crg-charge" min="1000" step="500" value="15000" required>
                      </div>
                    </div>

                    <button type="submit" class="btn btn-maroon btn-block btn-sm">
                      📦 Log Undercarriage Cargo
                    </button>
                  </form>

                  <!-- Brief Cargo list -->
                  ${selectedJourney.cargo.length > 0 ? `
                    <div style="margin-top: 10px; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px; max-height: 120px; overflow-y: auto;">
                      <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">Undercarriage Cargo Registry:</span>
                      <ul style="padding-left: 14px; font-size: 0.8rem; margin-top: 4px; display: flex; flex-direction: column; gap: 4px;">
                        ${selectedJourney.cargo.map(c => `
                          <li>${c.description} (${c.weightKg} kg) - <span style="font-weight:600; color:var(--primary-maroon);">${formatUGX(c.chargeUGX)}</span></li>
                        `).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    `;

    // --- Roster scheduling actions ---
    const rosterForm = document.getElementById('roster-form');
    if (rosterForm) {
      rosterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const routeId = document.getElementById('rost-route').value;
        const busId = document.getElementById('rost-bus').value;
        const driverId = document.getElementById('rost-driver').value;
        const conductorId = document.getElementById('rost-conductor').value;
        const timeInput = document.getElementById('rost-time').value;

        const route = state.destinations.find(d => d.id === routeId);
        if (!route) return;

        // Departure date parsing
        const departureDate = new Date();
        const [hours, minutes] = timeInput.split(':');
        departureDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const newJourneyId = generateId('JNY', 3).toLowerCase();

        navigate('update-state', (currentState) => {
          // Set driver and conductor status to on-duty
          const driver = currentState.staff.drivers.find(d => d.id === driverId);
          if (driver) driver.status = 'On Duty';

          const conductor = currentState.staff.conductors.find(c => c.id === conductorId);
          if (conductor) conductor.status = 'On Duty';

          const newJourney = {
            id: newJourneyId,
            busId: busId,
            routeFrom: 'Kampala',
            routeTo: route.name,
            driverId: driverId,
            conductorId: conductorId,
            departureTime: departureDate.toISOString(),
            status: 'Scheduled',
            progress: 0,
            currentLocation: 'Kampala Terminal',
            routePath: ['Kampala', 'Jinja', 'Iganga', 'Mbale', 'Soroti', 'Lira', 'Gulu'].slice(0, 4), // simple path helper
            tickets: {},
            expenses: [],
            cargo: []
          };

          currentState.journeys.unshift(newJourney);
          return currentState;
        });

        alert(`Journey scheduled and registered successfully under code ${newJourneyId.toUpperCase()}!`);
        selectedJourneyId = newJourneyId;
        navigate('bus-handler'); // Refresh
      });
    }

    // --- Interactive Seat Clicks ---
    const seatButtons = document.querySelectorAll('.seat:not(.occupied)');
    seatButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const seatNo = parseInt(e.target.getAttribute('data-seat'));
        
        if (selectedSeats.includes(seatNo)) {
          selectedSeats = selectedSeats.filter(s => s !== seatNo);
          e.target.classList.remove('selected');
        } else {
          selectedSeats.push(seatNo);
          e.target.classList.add('selected');
        }

        // Update checkout panel
        const checkoutForm = document.getElementById('passenger-ticket-form');
        const displaySeats = document.getElementById('display-selected-seats');
        const displayTotal = document.getElementById('display-total-fare');

        if (selectedSeats.length > 0) {
          checkoutForm.style.display = 'block';
          displaySeats.textContent = selectedSeats.join(', ');
          displayTotal.textContent = formatUGX(routeFare * selectedSeats.length);
        } else {
          checkoutForm.style.display = 'none';
        }
      });
    });

    // --- Ticket sales checkout submission ---
    const ticketForm = document.getElementById('passenger-ticket-form');
    if (ticketForm) {
      ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('tkt-name').value;
        const phone = document.getElementById('tkt-phone').value;

        // Generate tickets
        const ticketsGenerated = [];
        navigate('update-state', (currentState) => {
          const journey = currentState.journeys.find(j => j.id === selectedJourneyId);
          if (journey) {
            selectedSeats.forEach(seatNo => {
              const ticketId = `YY-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
              const tktObj = {
                ticketId,
                seatNo,
                passengerName: name,
                passengerPhone: phone,
                amountPaid: routeFare,
                purchaseDate: new Date().toISOString(),
                status: 'CheckedIn'
              };
              journey.tickets[seatNo] = tktObj;
              ticketsGenerated.push(tktObj);
            });
          }
          return currentState;
        });

        // Show ticket print popup representation
        showPrintTicketPreview(ticketsGenerated, selectedJourney);
        
        selectedSeats = []; // Reset selected seats
        drawView(); // Redraw
      });
    }

    // --- Undercarriage cargo logger submit ---
    const cargoForm = document.getElementById('cargo-booking-form');
    if (cargoForm) {
      cargoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const desc = document.getElementById('crg-desc').value;
        const weight = parseFloat(document.getElementById('crg-weight').value) || 10;
        const charge = parseFloat(document.getElementById('crg-charge').value) || 10000;

        navigate('update-state', (currentState) => {
          const journey = currentState.journeys.find(j => j.id === selectedJourneyId);
          if (journey) {
            journey.cargo.push({
              id: `crg-pkg-${Math.floor(1000 + Math.random() * 9000)}`,
              description: desc,
              weightKg: weight,
              chargeUGX: charge,
              status: 'Loaded'
            });
          }
          return currentState;
        });

        alert("Commercial cargo loaded into bus undercarriage!");
        drawView(); // Redraw view
      });
    }

    // --- Journey Select Desk Trigger ---
    const jnySelect = document.getElementById('select-ticketing-journey');
    if (jnySelect) {
      jnySelect.addEventListener('change', (e) => {
        selectedJourneyId = e.target.value;
        selectedSeats = [];
        drawView();
      });
    }

    // Back to portal
    document.getElementById('btn-back-portal').addEventListener('click', () => navigate('portal'));
  }

  // Generate Cabin rows representation (3 seats, aisle, 2 seats)
  function renderCabinSeats(capacity, soldTickets) {
    let rowsHTML = '';
    
    // Ugandan buses typical 3 + 2 layout.
    // Seat mapping:
    // Left row: Seat A, B, C | Aisle | Right row: Seat D, E
    // Row 1 to 13 = 65 seats. Row 14 back seat holds 2 seats. Total 67.
    let seatCounter = 1;
    const numRows = Math.ceil(capacity / 5);

    for (let r = 0; r < numRows; r++) {
      rowsHTML += `<div class="seat-row">`;
      
      // Left side: 3 seats
      for (let sLeft = 0; sLeft < 3; sLeft++) {
        if (seatCounter <= capacity) {
          rowsHTML += renderSingleSeat(seatCounter, soldTickets);
          seatCounter++;
        } else {
          rowsHTML += `<div></div>`;
        }
      }

      // Middle: Aisle
      rowsHTML += `<div class="seat-aisle"></div>`;

      // Right side: 2 seats
      for (let sRight = 0; sRight < 2; sRight++) {
        if (seatCounter <= capacity) {
          rowsHTML += renderSingleSeat(seatCounter, soldTickets);
          seatCounter++;
        } else {
          rowsHTML += `<div></div>`;
        }
      }

      rowsHTML += `</div>`;
    }

    return rowsHTML;
  }

  function renderSingleSeat(num, soldTickets) {
    const isOccupied = soldTickets[num] !== undefined;
    const tkt = soldTickets[num];
    
    if (isOccupied) {
      return `
        <div class="seat occupied" data-seat="${num}">
          ${num}
          <div class="seat-tooltip">
            <strong>${tkt.passengerName}</strong><br>
            Phone: ${tkt.passengerPhone}<br>
            Tkt: ${tkt.ticketId}<br>
            Paid: ${formatUGX(tkt.amountPaid)}
          </div>
        </div>
      `;
    } else {
      const isSel = selectedSeats.includes(num);
      return `
        <div class="seat ${isSel ? 'selected' : ''}" data-seat="${num}">
          ${num}
        </div>
      `;
    }
  }

  // Modal ticket print dialog representation
  function showPrintTicketPreview(tickets, journey) {
    // Open a modal over lay dynamically
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    
    const bus = state.buses.find(b => b.id === journey.busId);

    const ticketsHTML = tickets.map(t => {
      const barcodeSVG = generateBarcodeSVG(t.ticketId);
      return `
        <div class="simulated-receipt print-tkt-section" style="width: 100%; border: 2px dashed #000; padding: 1rem; margin-bottom: 1.5rem; background: #fff;">
          <div class="receipt-header">
            <strong style="font-size: 1.2rem; color: #7a0016; letter-spacing: 1px;">YY BUSES UGANDA</strong>
            <span style="font-size: 0.65rem; display: block; text-transform: uppercase;">Quality Services, Safe Journeys</span>
            <strong style="font-size: 0.85rem; display: block; border: 1px solid #000; margin-top: 4px; padding: 2px;">BOARDING PASS PASSENGER TICKET</strong>
          </div>

          <div class="receipt-row"><span>Ticket No:</span><strong style="font-family: monospace;">${t.ticketId}</strong></div>
          <div class="receipt-row"><span>Roster Voyage:</span><strong>${journey.routeFrom} ➔ ${journey.routeTo}</strong></div>
          <div class="receipt-row"><span>Departure Time:</span><span>${formatDate(journey.departureTime)}</span></div>
          <div class="receipt-row"><span>Bus Reg No:</span><strong style="font-family: monospace;">${bus ? bus.regNo : 'N/A'}</strong></div>
          <div class="receipt-divider"></div>

          <div class="receipt-row"><span>Passenger:</span><strong>${t.passengerName}</strong></div>
          <div class="receipt-row"><span>Phone:</span><span>${t.passengerPhone}</span></div>
          <div class="receipt-row" style="font-size: 1.3rem; border: 2px solid #000; padding: 4px; text-align: center; margin: 10px 0; justify-content: center; font-weight: 900;">
            SEAT NO: ${t.seatNo}
          </div>
          
          <div class="receipt-divider"></div>
          <div class="receipt-row"><span>Fare Paid:</span><strong>${formatUGX(t.amountPaid)}</strong></div>
          <div style="font-size: 0.6rem; text-align: center; margin-top: 6px; color: #555;">
            * Tickets are non-refundable. Please report 30 minutes before departure.
          </div>

          <div class="receipt-barcode">
            ${barcodeSVG}
          </div>
        </div>
      `;
    }).join('');

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 420px;">
        <button class="modal-close" id="btn-close-print-modal">×</button>
        <h3 style="margin-bottom: 1rem; color: var(--primary-blue); text-align: center;">Ticket Printing Office</h3>
        <p style="font-size: 0.8rem; text-align: center; margin-bottom: 1rem; color: var(--text-medium)">
          Verify details and trigger printing for passenger boarding.
        </p>

        <div id="print-area-tickets" style="max-height: 450px; overflow-y: auto; padding-right: 5px;">
          ${ticketsHTML}
        </div>

        <button class="btn btn-blue btn-block" id="btn-trigger-ticket-print" style="margin-top: 1rem;">
          🖨️ Send to Ticket Printer
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-print-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.getElementById('btn-trigger-ticket-print').addEventListener('click', () => {
      // Print handling logic
      const printContainer = document.createElement('div');
      printContainer.className = 'print-only-container';
      printContainer.innerHTML = document.getElementById('print-area-tickets').innerHTML;
      document.body.appendChild(printContainer);
      
      window.print();
      
      document.body.removeChild(printContainer);
      document.body.removeChild(modal);
    });
  }

  // Render initial run
  drawView();
}
