import { formatUGX, generateId, calculateCourierPrice, formatDate, generateQRCodeSVG } from '../utils.js';

export function renderCourierHandler(container, state, navigate) {
  // Get active departures that are either Scheduled or In Transit for package routing
  const activeDepartures = state.journeys.filter(j => j.status === 'Scheduled' || j.status === 'In Transit');

  // Categorize packages
  const packagesAwaitingDispatch = state.parcels.filter(p => p.status === 'Intake');
  const packagesInTransit = state.parcels.filter(p => p.status === 'Dispatched');
  const packagesAwaitingPickup = state.parcels.filter(p => p.status === 'Arrived');
  const draftPrebookings = state.parcels.filter(p => p.status === 'Draft');

  container.innerHTML = `
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-maroon);">📦 Courier Handler Terminal</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Receive client packages, route to departing buses, and coordinate regional collections</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Stats summary Row -->
    <div class="stats-grid" style="margin-bottom: 1.5rem;">
      <div class="stat-card">
        <div class="stat-icon maroon">📥</div>
        <div class="stat-info">
          <span class="stat-label">Warehouse Inventory</span>
          <span class="stat-value">${packagesAwaitingDispatch.length}</span>
          <span class="stat-trend" style="color: var(--text-light)">Awaiting dispatch</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">🚌</div>
        <div class="stat-info">
          <span class="stat-label">Parcels En Route</span>
          <span class="stat-value">${packagesInTransit.length}</span>
          <span class="stat-trend trend-up">▲ In Transit</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">📦</div>
        <div class="stat-info">
          <span class="stat-label">Awaiting Collection</span>
          <span class="stat-value">${packagesAwaitingPickup.length}</span>
          <span class="stat-trend" style="color: var(--success)">Ready for pickup</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">📝</div>
        <div class="stat-info">
          <span class="stat-label">Online Drafts</span>
          <span class="stat-value">${draftPrebookings.length}</span>
          <span class="stat-trend" style="color: var(--primary-maroon)">Pre-bookings</span>
        </div>
      </div>
    </div>

    <!-- Navigation Sub-Tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--accent-gray-medium); padding-bottom: 1px;">
      <button class="btn btn-sm btn-maroon" id="subtab-intake-btn" style="border-radius: 6px 6px 0 0; margin-bottom: -2px;">📥 Package In-Take</button>
      <button class="btn btn-sm btn-secondary" id="subtab-dispatch-btn" style="border-radius: 6px 6px 0 0; border-bottom: none; margin-bottom: -2px; background: transparent; color: var(--text-medium);">🚌 Dispatch to Bus</button>
      <button class="btn btn-sm btn-secondary" id="subtab-pickup-btn" style="border-radius: 6px 6px 0 0; border-bottom: none; margin-bottom: -2px; background: transparent; color: var(--text-medium);">🎁 Arrivals & Collections</button>
    </div>

    <!-- Section 1: Package In-Take -->
    <div id="subtab-intake-content">
      <div class="grid-2">
        <!-- New intake form -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Package Registration</h3>
            <span style="color: var(--text-light); font-size: 0.8rem;">Register cargo packages</span>
          </div>

          <!-- Draft Lookup Bar -->
          <div style="background: var(--accent-gray-light); padding: 10px; border-radius: var(--border-radius-md); margin-bottom: 1.25rem; display: flex; gap: 10px; align-items: center;">
            <span style="font-size: 1.1rem;">🔍</span>
            <input type="text" id="draft-lookup-id" placeholder="Look up Pre-booking Code (e.g. YY-DFT-...)" style="padding: 6px 10px; font-size: 0.85rem;">
            <button class="btn btn-maroon btn-sm" id="btn-lookup-draft">Fetch</button>
          </div>

          <form id="intake-form">
            <input type="hidden" id="intake-draft-id" value="">
            <div class="form-row">
              <div class="form-group">
                <label for="int-sender">Sender Name</label>
                <input type="text" id="int-sender" required>
              </div>
              <div class="form-group">
                <label for="int-sender-phone">Sender Phone</label>
                <input type="text" id="int-sender-phone" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="int-receiver">Receiver Name</label>
                <input type="text" id="int-receiver" required>
              </div>
              <div class="form-group">
                <label for="int-receiver-phone">Receiver Phone</label>
                <input type="text" id="int-receiver-phone" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="int-route">Destination Station</label>
                <select id="int-route" required>
                  ${state.destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="int-size">Package Size</label>
                <select id="int-size">
                  <option value="small">Small (Envelope)</option>
                  <option value="medium" selected>Medium (Box/Bag)</option>
                  <option value="large">Large (Suitcase)</option>
                  <option value="extra-large">Extra Large (Undercarriage sack)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="int-weight">Measured Weight (kg)</label>
                <input type="number" id="int-weight" min="0.1" step="0.1" value="2.0" required>
              </div>
              <div class="form-group">
                <label for="int-desc">Contents Description</label>
                <input type="text" id="int-desc" required>
              </div>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="int-fragile" style="width: auto; margin-right: 6px;">
              <label for="int-fragile" style="margin-bottom: 0;">Fragile / Special handling requested</label>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 1rem;">
              <button type="submit" class="btn btn-maroon btn-block">📥 Complete Intake & Generate Tag</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-intake">Clear</button>
            </div>
          </form>
        </div>

        <!-- Print slip review area -->
        <div class="card" id="intake-print-preview" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; border: 2px dashed var(--accent-gray-medium);">
          <div style="text-align: center; color: var(--text-light);">
            <span style="font-size: 4rem;">🏷️</span>
            <h4 style="margin-top: 10px; color: var(--text-medium);">Intake Print Preview</h4>
            <p style="font-size: 0.85rem; max-width: 320px; margin: 6px auto;">
              Complete the intake registration form or look up a customer pre-booking to generate a barcoded parcel sticker tag and receipt.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Dispatch to Bus -->
    <div id="subtab-dispatch-content" style="display: none;">
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-title-bar">
          <h3>Load Parcels onto YY Bus Journeys</h3>
          <span class="badge badge-maroon">${packagesAwaitingDispatch.length} Items Pending Dispatch</span>
        </div>
        
        ${packagesAwaitingDispatch.length === 0 ? `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-light);">
            <span style="font-size: 2.5rem;">📦</span>
            <p style="margin-top: 10px; font-weight: 500;">No packages currently sitting in the warehouse. All set!</p>
          </div>
        ` : `
          <div class="grid-3" style="align-items: stretch; margin-bottom: 1.5rem;">
            <!-- Select Bus Journey Dropdown -->
            <div class="card" style="box-shadow: none; border-color: var(--accent-gray-medium); display: flex; flex-direction: column; justify-content: space-between; padding: 1rem;">
              <div>
                <label for="dispatch-journey-id" style="font-weight: 700;">1. Select Bus Route Journey</label>
                <select id="dispatch-journey-id" style="margin-top: 6px;" required>
                  <option value="">-- Choose Departing Bus Journey --</option>
                  ${activeDepartures.map(j => {
                    const bus = state.buses.find(b => b.id === j.busId);
                    return `<option value="${j.id}">[${j.id.toUpperCase()}] ${j.routeFrom} ➔ ${j.routeTo} (${bus ? bus.regNo : 'No Bus'})</option>`;
                  }).join('')}
                </select>
                <p style="font-size: 0.75rem; color: var(--text-medium); margin-top: 8px;">
                  Only scheduled or active in-transit journeys are listed here.
                </p>
              </div>
              <button class="btn btn-blue btn-block" id="btn-execute-dispatch" style="margin-top: 1rem;" disabled>
                🚚 Dispatch Selected Parcels
              </button>
            </div>

            <!-- Hint instructions -->
            <div style="grid-column: span 2; display: flex; flex-direction: column; justify-content: center; padding: 0 1rem;">
              <h4 style="color: var(--primary-blue);">Routing Guidance</h4>
              <p style="font-size: 0.85rem; color: var(--text-medium); margin-top: 4px;">
                Select the parcels on the table below that are bound for stations along the chosen bus journey corridor, and click "Dispatch Selected Parcels". The system will update client tracking and add these items to the bus's cargo manifests automatically.
              </p>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 40px;"><input type="checkbox" id="select-all-dispatch" style="width: auto; cursor: pointer;"></th>
                  <th>Parcel ID</th>
                  <th>Destination</th>
                  <th>Description</th>
                  <th>Receiver Details</th>
                  <th>Size / Weight</th>
                  <th>Logged Date</th>
                </tr>
              </thead>
              <tbody>
                ${packagesAwaitingDispatch.map(p => `
                  <tr>
                    <td><input type="checkbox" class="dispatch-parcel-check" value="${p.id}" style="width: auto; cursor: pointer;"></td>
                    <td><strong>${p.id}</strong></td>
                    <td><span class="badge badge-maroon">${p.routeTo}</span></td>
                    <td>${p.description}</td>
                    <td>${p.receiverName} (${p.receiverPhone})</td>
                    <td>${p.weightKg} kg (${p.dimensions})</td>
                    <td style="font-size: 0.8rem; color: var(--text-light);">${formatDate(p.createdDate)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>

    <!-- Section 3: Arrivals & Pickups -->
    <div id="subtab-pickup-content" style="display: none;">
      <div class="grid-2">
        <!-- Arrivals Manager -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Coordinate Terminal Arrivals</h3>
            <span class="badge badge-blue">${packagesInTransit.length} En Route</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-medium); margin-bottom: 1rem;">
            When a bus arrives at your station, search the bus journey and mark all parcels on it as "Arrived" so customers are notified for collection.
          </p>

          ${packagesInTransit.length === 0 ? `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
              <p>No parcels currently en-route on buses.</p>
            </div>
          ` : `
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Parcel ID</th>
                    <th>Bus Journey</th>
                    <th>Destination</th>
                    <th>Receiver</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${packagesInTransit.map(p => `
                    <tr>
                      <td><strong>${p.id}</strong></td>
                      <td><span class="badge badge-blue">${p.journeyId ? p.journeyId.toUpperCase() : 'N/A'}</span></td>
                      <td>${p.routeTo}</td>
                      <td>${p.receiverName}</td>
                      <td>
                        <button class="btn btn-sm btn-success btn-arrive-parcel" data-id="${p.id}">📥 Arrived</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Collection / Pickup Registrar -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Receiver Collection Registry</h3>
            <span class="badge badge-success">${packagesAwaitingPickup.length} Ready</span>
          </div>

          <!-- Pickup Search Bar -->
          <div class="search-bar-row">
            <div class="search-input-wrapper">
              <input type="text" id="pickup-search-input" placeholder="Search Parcel ID or Receiver Name..." style="padding-left: 14px;">
            </div>
          </div>

          <div class="table-wrapper" style="max-height: 300px;">
            <table>
              <thead>
                <tr>
                  <th>Parcel ID</th>
                  <th>Receiver</th>
                  <th>Destination</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="pickup-list-tbody">
                ${packagesAwaitingPickup.map(p => `
                  <tr class="pickup-table-row" data-search="${p.id.toLowerCase()} ${p.receiverName.toLowerCase()}">
                    <td><strong>${p.id}</strong></td>
                    <td>
                      <div><strong>${p.receiverName}</strong></div>
                      <div style="font-size: 0.75rem; color: var(--text-light);">${p.receiverPhone}</div>
                    </td>
                    <td>${p.routeTo}</td>
                    <td>
                      <button class="btn btn-sm btn-maroon btn-collect-parcel" data-id="${p.id}">📦 Handout</button>
                    </td>
                  </tr>
                `).join('')}
                ${packagesAwaitingPickup.length === 0 ? `
                  <tr><td colspan="4" style="text-align: center; color: var(--text-light);">No parcels currently awaiting collection.</td></tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- Sub-Tab Navigation ---
  const tabIntake = document.getElementById('subtab-intake-btn');
  const tabDispatch = document.getElementById('subtab-dispatch-btn');
  const tabPickup = document.getElementById('subtab-pickup-btn');

  const contentIntake = document.getElementById('subtab-intake-content');
  const contentDispatch = document.getElementById('subtab-dispatch-content');
  const contentPickup = document.getElementById('subtab-pickup-content');

  tabIntake.addEventListener('click', () => {
    tabIntake.className = 'btn btn-sm btn-maroon';
    tabDispatch.className = 'btn btn-sm btn-secondary';
    tabDispatch.style.background = 'transparent';
    tabPickup.className = 'btn btn-sm btn-secondary';
    tabPickup.style.background = 'transparent';
    contentIntake.style.display = 'block';
    contentDispatch.style.display = 'none';
    contentPickup.style.display = 'none';
  });

  tabDispatch.addEventListener('click', () => {
    tabDispatch.className = 'btn btn-sm btn-maroon';
    tabIntake.className = 'btn btn-sm btn-secondary';
    tabIntake.style.background = 'transparent';
    tabPickup.className = 'btn btn-sm btn-secondary';
    tabPickup.style.background = 'transparent';
    contentDispatch.style.display = 'block';
    contentIntake.style.display = 'none';
    contentPickup.style.display = 'none';
  });

  tabPickup.addEventListener('click', () => {
    tabPickup.className = 'btn btn-sm btn-maroon';
    tabIntake.className = 'btn btn-sm btn-secondary';
    tabIntake.style.background = 'transparent';
    tabDispatch.className = 'btn btn-sm btn-secondary';
    tabDispatch.style.background = 'transparent';
    contentPickup.style.display = 'block';
    contentIntake.style.display = 'none';
    contentDispatch.style.display = 'none';
  });

  // Back button
  document.getElementById('btn-back-portal').addEventListener('click', () => navigate('portal'));

  // --- 1. Intake Handlers ---
  const intakeForm = document.getElementById('intake-form');
  const draftLookupIdInput = document.getElementById('draft-lookup-id');
  const btnLookupDraft = document.getElementById('btn-lookup-draft');
  const intakeDraftIdHidden = document.getElementById('intake-draft-id');

  // Draft fetch logic
  btnLookupDraft.addEventListener('click', () => {
    const code = draftLookupIdInput.value.trim().toUpperCase();
    if (!code) return;

    const draft = state.parcels.find(p => p.id === code && p.status === 'Draft');
    if (!draft) {
      alert("Draft booking code not found or already verified.");
      return;
    }

    // Prefill form
    document.getElementById('int-sender').value = draft.senderName;
    document.getElementById('int-sender-phone').value = draft.senderPhone;
    document.getElementById('int-receiver').value = draft.receiverName;
    document.getElementById('int-receiver-phone').value = draft.receiverPhone;
    document.getElementById('int-desc').value = draft.description;
    document.getElementById('int-weight').value = draft.weightKg;
    document.getElementById('int-fragile').checked = draft.history[0]?.description.includes('Fragile') || false;
    
    const matchedRoute = state.destinations.find(d => d.name === draft.routeTo);
    if (matchedRoute) {
      document.getElementById('int-route').value = matchedRoute.id;
    }

    intakeDraftIdHidden.value = draft.id;
    alert(`Fetched draft pre-booking details for ${draft.senderName}!`);
  });

  // New Intake Submit
  intakeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const sender = document.getElementById('int-sender').value;
    const senderPhone = document.getElementById('int-sender-phone').value;
    const receiver = document.getElementById('int-receiver').value;
    const receiverPhone = document.getElementById('int-receiver-phone').value;
    const routeId = document.getElementById('int-route').value;
    const size = document.getElementById('int-size').value;
    const weight = parseFloat(document.getElementById('int-weight').value) || 1;
    const desc = document.getElementById('int-desc').value;
    const isFragile = document.getElementById('int-fragile').checked;
    const draftId = intakeDraftIdHidden.value;

    const route = state.destinations.find(d => d.id === routeId);
    if (!route) return;

    const price = calculateCourierPrice(weight, route.courierBase, route.courierPerKg, isFragile, size);
    const newCode = generateId('YY-PRC', 6);

    navigate('update-state', (currentState) => {
      // If we loaded from a draft, delete the draft first
      if (draftId) {
        currentState.parcels = currentState.parcels.filter(p => p.id !== draftId);
      }

      const activeParcel = {
        id: newCode,
        senderName: sender,
        senderPhone: senderPhone,
        receiverName: receiver,
        receiverPhone: receiverPhone,
        routeFrom: 'Kampala',
        routeTo: route.name,
        weightKg: weight,
        dimensions: `${size.toUpperCase()} package`,
        description: desc,
        priceUGX: price,
        status: 'Intake',
        journeyId: null,
        history: [
          { status: 'Intake', time: new Date().toISOString(), description: `Verified & checked-in at Kampala terminal. Logged by Handler.` }
        ],
        createdDate: new Date().toISOString()
      };

      currentState.parcels.unshift(activeParcel);
      return currentState;
    });

    // Render print tag sticker
    const previewContainer = document.getElementById('intake-print-preview');
    previewContainer.className = "card";
    previewContainer.style.border = "1px solid var(--primary-maroon)";
    
    const qrSVG = generateQRCodeSVG(newCode);

    previewContainer.innerHTML = `
      <div class="simulated-receipt" id="label-receipt" style="width: 100%; border: 3px solid var(--primary-blue); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary-blue); padding-bottom: 6px;">
          <div>
            <strong style="font-size: 1.1rem; color: var(--primary-maroon);">YY COURIER</strong>
            <span style="font-size: 0.65rem; display: block; letter-spacing: 1px; color: var(--text-medium)">UGANDA PARCEL SERVICE</span>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 1.25rem; font-family: monospace; color: var(--primary-blue);">${newCode}</strong>
          </div>
        </div>

        <div style="margin: 10px 0; font-size: 0.8rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Sender</span>
              <div style="font-weight: 700;">${sender}</div>
              <div>${senderPhone}</div>
            </div>
            <div>
              <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Receiver (Call on arrival)</span>
              <div style="font-weight: 700; color: var(--primary-maroon);">${receiver}</div>
              <div style="font-weight: 700;">${receiverPhone}</div>
            </div>
          </div>
        </div>

        <div style="border-top: 1px dashed var(--accent-gray-medium); border-bottom: 1px dashed var(--accent-gray-medium); padding: 6px 0; margin: 10px 0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Destination Station</span>
            <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary-blue);">${route.name.toUpperCase()}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Weight / Charge</span>
            <div style="font-weight: 700; font-size: 1.05rem;">${weight} kg</div>
            <div style="font-weight: 700; color: var(--primary-maroon);">${formatUGX(price)}</div>
          </div>
        </div>

        <div style="font-size: 0.75rem; background: var(--accent-gray-light); padding: 4px; border-radius: 4px;">
          <strong>Contents:</strong> ${desc} ${isFragile ? '⚠️ <strong style="color: var(--danger)">FRAGILE</strong>' : ''}
        </div>

        <div style="display: flex; justify-content: center; align-items: center; margin-top: 12px; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px;">
          ${qrSVG}
        </div>
      </div>

      <div style="display: flex; gap: 8px; width: 100%; margin-top: 1rem;">
        <button class="btn btn-blue btn-block btn-sm" id="btn-print-label">🖨️ Print Shipping Label</button>
        <button class="btn btn-secondary btn-block btn-sm" id="btn-reset-intake">🔄 Reset Form</button>
      </div>
    `;

    // Reset form field inputs
    intakeForm.reset();
    intakeDraftIdHidden.value = "";

    // Label printing logic
    document.getElementById('btn-print-label').addEventListener('click', () => {
      const printContainer = document.createElement('div');
      printContainer.className = 'print-only-container';
      printContainer.innerHTML = document.getElementById('label-receipt').innerHTML;
      document.body.appendChild(printContainer);
      
      window.print();
      
      document.body.removeChild(printContainer);
    });

    document.getElementById('btn-reset-intake').addEventListener('click', () => {
      // Re-renders the current view to restore original placeholder
      navigate('courier-handler');
    });
  });

  document.getElementById('btn-clear-intake').addEventListener('click', () => {
    intakeForm.reset();
    intakeDraftIdHidden.value = "";
  });

  // --- 2. Dispatch Handlers ---
  const selectAllDispatch = document.getElementById('select-all-dispatch');
  const dispatchChecks = document.querySelectorAll('.dispatch-parcel-check');
  const selectJourney = document.getElementById('dispatch-journey-id');
  const btnExecuteDispatch = document.getElementById('btn-execute-dispatch');

  if (selectAllDispatch) {
    selectAllDispatch.addEventListener('change', (e) => {
      const checked = e.target.checked;
      dispatchChecks.forEach(cb => {
        cb.checked = checked;
      });
      toggleDispatchButton();
    });

    dispatchChecks.forEach(cb => {
      cb.addEventListener('change', toggleDispatchButton);
    });

    selectJourney.addEventListener('change', toggleDispatchButton);
  }

  function toggleDispatchButton() {
    const checkedCount = document.querySelectorAll('.dispatch-parcel-check:checked').length;
    const hasJourneySelected = selectJourney.value !== "";
    btnExecuteDispatch.disabled = !(checkedCount > 0 && hasJourneySelected);
  }

  if (btnExecuteDispatch) {
    btnExecuteDispatch.addEventListener('click', () => {
      const journeyId = selectJourney.value;
      const checkedParcels = Array.from(document.querySelectorAll('.dispatch-parcel-check:checked')).map(cb => cb.value);
      
      const journey = state.journeys.find(j => j.id === journeyId);
      const bus = state.buses.find(b => b.id === (journey ? journey.busId : ''));
      if (!journey) return;

      // Update state: assign selected parcels to this journey, change status to Dispatched
      navigate('update-state', (currentState) => {
        checkedParcels.forEach(pid => {
          const parcel = currentState.parcels.find(p => p.id === pid);
          if (parcel) {
            parcel.status = 'Dispatched';
            parcel.journeyId = journeyId;
            parcel.history.push({
              status: 'Dispatched',
              time: new Date().toISOString(),
              description: `Dispatched on Bus ${bus ? bus.regNo : 'N/A'} (Journey ${journeyId.toUpperCase()}) departing for ${journey.routeTo}`
            });

            // Also load into the bus's cargo manifest!
            const routeJourney = currentState.journeys.find(j => j.id === journeyId);
            if (routeJourney) {
              routeJourney.cargo.push({
                id: `crg-pkg-${pid}`,
                description: `Courier Parcel: ${parcel.description} (Ref: ${pid})`,
                weightKg: parcel.weightKg,
                chargeUGX: 0, // already paid in courier system
                status: 'Loaded'
              });
            }
          }
        });
        return currentState;
      });

      alert(`Successfully loaded ${checkedParcels.length} parcels onto Bus journey ${journeyId.toUpperCase()}!`);
      navigate('courier-handler'); // Refresh view
    });
  }

  // --- 3. Arrivals & Collection Handlers ---
  const arriveButtons = document.querySelectorAll('.btn-arrive-parcel');
  arriveButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.target.getAttribute('data-id');
      
      navigate('update-state', (currentState) => {
        const parcel = currentState.parcels.find(p => p.id === pid);
        if (parcel) {
          parcel.status = 'Arrived';
          parcel.history.push({
            status: 'Arrived',
            time: new Date().toISOString(),
            description: `Arrived at regional office hub in ${parcel.routeTo}. Receiver notified for collection.`
          });
        }
        return currentState;
      });

      alert(`Parcel ${pid} checked into station. Ready for customer pickup!`);
      navigate('courier-handler'); // Refresh view
    });
  });

  // Collect parcel checkout
  const collectButtons = document.querySelectorAll('.btn-collect-parcel');
  collectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.target.getAttribute('data-id');
      const verificationName = prompt("Please enter Receiver's verification ID number / document name for validation:");
      if (verificationName === null) return; // cancel click

      navigate('update-state', (currentState) => {
        const parcel = currentState.parcels.find(p => p.id === pid);
        if (parcel) {
          parcel.status = 'Collected';
          parcel.history.push({
            status: 'Collected',
            time: new Date().toISOString(),
            description: `Collected by recipient. Verification info: [${verificationName || 'Mobile Code Verified'}].`
          });
        }
        return currentState;
      });

      alert(`Parcel ${pid} handed out successfully! Shipment archive closed.`);
      navigate('courier-handler'); // Refresh view
    });
  });

  // Pickup registry search filter
  const pickupSearchInput = document.getElementById('pickup-search-input');
  if (pickupSearchInput) {
    pickupSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.pickup-table-row');
      rows.forEach(row => {
        const text = row.getAttribute('data-search');
        if (text.includes(query)) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
}
