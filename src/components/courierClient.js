import { formatUGX, generateId, calculateCourierPrice, formatDate } from '../utils.js';

export function renderCourierClient(container, state, navigate, params = {}) {
  // Check for pre-fill parameters
  const prefill = params.prefill || {};

  container.innerHTML = `
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-maroon);">📦 Courier Customer Portal</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Track packages in real-time or register new courier shipments</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Navigation Tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--accent-gray-medium); padding-bottom: 1px;">
      <button class="btn btn-sm active-tab-btn btn-maroon" id="tab-track-btn" style="border-radius: 6px 6px 0 0; margin-bottom: -2px;">🔍 Track Parcel</button>
      <button class="btn btn-sm btn-secondary" id="tab-book-btn" style="border-radius: 6px 6px 0 0; border-bottom: none; margin-bottom: -2px; background: transparent;">📋 Online Pre-Booking</button>
    </div>

    <!-- Tab 1: Track Package -->
    <div id="tab-track-content">
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-title-bar">
          <h3>Search Package Shipment</h3>
          <span style="color: var(--text-light); font-size: 0.8rem;">Enter 6-digit tracking code</span>
        </div>
        <div class="search-bar-row">
          <div class="search-input-wrapper">
            <input type="text" id="track-id-input" placeholder="e.g. YY-PRC-881920" style="padding-left: 14px;" value="${params.trackId || ''}">
          </div>
          <button class="btn btn-maroon" id="btn-track-submit">Track Status</button>
        </div>
        
        <!-- Suggestions helper -->
        <div style="font-size: 0.85rem; color: var(--text-medium);">
          <span>Demo Tracking Codes to try: </span>
          ${state.parcels.slice(0, 3).map(p => `
            <a href="#" class="demo-track-link" style="color: var(--primary-maroon); margin-right: 12px; font-family: monospace; font-weight: 700;">${p.id}</a>
          `).join('')}
        </div>
      </div>

      <!-- Tracking Results Workspace -->
      <div id="tracking-results-card" style="display: none;">
        <!-- Inject tracker results dynamically -->
      </div>
    </div>

    <!-- Tab 2: Pre-Booking Pannel -->
    <div id="tab-book-content" style="display: none;">
      <div class="grid-2">
        <!-- Input Form -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Pre-Book Delivery Pouch</h3>
            <span class="badge badge-maroon">Quick Check-in</span>
          </div>
          <form id="prebook-form">
            <div class="form-row">
              <div class="form-group">
                <label for="pb-sender">Sender Name</label>
                <input type="text" id="pb-sender" placeholder="e.g. Opio Samuel" required>
              </div>
              <div class="form-group">
                <label for="pb-sender-phone">Sender Phone Number</label>
                <input type="text" id="pb-sender-phone" placeholder="e.g. +256 772 123456" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pb-receiver">Receiver Name</label>
                <input type="text" id="pb-receiver" placeholder="e.g. Akello Sarah" required>
              </div>
              <div class="form-group">
                <label for="pb-receiver-phone">Receiver Phone Number</label>
                <input type="text" id="pb-receiver-phone" placeholder="e.g. +256 701 987654" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pb-route">Destination (From Kampala)</label>
                <select id="pb-route" required>
                  ${state.destinations.map(d => `<option value="${d.id}" ${d.id === prefill.routeId ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="pb-size">Approx. Size</label>
                <select id="pb-size">
                  <option value="small" ${prefill.size === 'small' ? 'selected' : ''}>Small (Envelope)</option>
                  <option value="medium" ${prefill.size === 'medium' || !prefill.size ? 'selected' : ''}>Medium (Box/Bag)</option>
                  <option value="large" ${prefill.size === 'large' ? 'selected' : ''}>Large (Suitcase)</option>
                  <option value="extra-large" ${prefill.size === 'extra-large' ? 'selected' : ''}>Extra Large (Huge sack)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pb-weight">Estimated Weight (kg)</label>
                <input type="number" id="pb-weight" min="0.1" step="0.1" value="${prefill.weight || '2.0'}" required>
              </div>
              <div class="form-group">
                <label for="pb-desc">Item Description</label>
                <input type="text" id="pb-desc" placeholder="e.g. Documents, Electronics, Shoes" required>
              </div>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="pb-fragile" style="width: auto; margin-right: 6px;" ${prefill.isFragile ? 'checked' : ''}>
              <label for="pb-fragile" style="margin-bottom: 0;">Contains Fragile / Electronic Items</label>
            </div>

            <button type="submit" class="btn btn-maroon btn-block" style="margin-top: 1rem;">
              💾 Generate Pre-Booking Voucher
            </button>
          </form>
        </div>

        <!-- Cost Breakdown / Receipt preview -->
        <div class="card" id="prebook-voucher-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 350px;">
          <div style="text-align: center; color: var(--text-light);">
            <span style="font-size: 3.5rem;">🎫</span>
            <h4 style="margin-top: 10px; color: var(--text-medium);">Pre-Booking Voucher</h4>
            <p style="font-size: 0.85rem; max-width: 320px; margin: 6px auto;">
              Complete the form on the left to generate your booking barcode. Show it to any YY Courier Handler at the gate to check-in your luggage quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // UI elements
  const tabTrackBtn = document.getElementById('tab-track-btn');
  const tabBookBtn = document.getElementById('tab-book-btn');
  const tabTrackContent = document.getElementById('tab-track-content');
  const tabBookContent = document.getElementById('tab-book-content');

  // Tab switching
  tabTrackBtn.addEventListener('click', () => {
    tabTrackBtn.className = 'btn btn-sm btn-maroon';
    tabBookBtn.className = 'btn btn-sm btn-secondary';
    tabBookBtn.style.background = 'transparent';
    tabBookBtn.style.borderBottom = 'none';
    tabTrackContent.style.display = 'block';
    tabBookContent.style.display = 'none';
  });

  tabBookBtn.addEventListener('click', () => {
    tabBookBtn.className = 'btn btn-sm btn-maroon';
    tabTrackBtn.className = 'btn btn-sm btn-secondary';
    tabTrackBtn.style.background = 'transparent';
    tabTrackBtn.style.borderBottom = 'none';
    tabBookContent.style.display = 'block';
    tabTrackContent.style.display = 'none';
  });

  // Switch tab if prefill parameters exist
  if (params.prefill) {
    tabBookBtn.click();
  }

  // Back button
  document.getElementById('btn-back-portal').addEventListener('click', () => navigate('portal'));

  // Tracking query executor
  const trackIdInput = document.getElementById('track-id-input');
  const trackingResultsCard = document.getElementById('tracking-results-card');

  const executeTracking = (trackId) => {
    trackId = trackId.trim().toUpperCase();
    if (!trackId) return;

    const parcel = state.parcels.find(p => p.id === trackId || p.id.replace(/-/g, '').includes(trackId.replace(/-/g, '')));
    
    if (!parcel) {
      trackingResultsCard.style.display = 'block';
      trackingResultsCard.innerHTML = `
        <div class="card" style="border: 2px dashed var(--danger); text-align: center; padding: 2rem;">
          <span style="font-size: 2.5rem; color: var(--danger);">⚠️</span>
          <h3 style="color: var(--danger); margin-top: 8px;">Shipment Not Found</h3>
          <p style="color: var(--text-medium); font-size: 0.9rem; max-width: 400px; margin: 8px auto;">
            We couldn't find a package registered under "<strong>${trackId}</strong>". Please double check your tracking code or verify with the dispatch handler.
          </p>
        </div>
      `;
      return;
    }

    // Build visual progress timeline
    // Status list: Draft, Intake, Dispatched, Arrived, Collected
    const statuses = ['Intake', 'Dispatched', 'Arrived', 'Collected'];
    const currentStatusIdx = statuses.indexOf(parcel.status);

    const stepsHTML = statuses.map((status, idx) => {
      let nodeClass = 'accent-gray-medium';
      let icon = '⚪';
      let textStyle = 'color: var(--text-light);';

      if (idx < currentStatusIdx) {
        nodeClass = 'success';
        icon = '✅';
        textStyle = 'color: var(--success); font-weight: 600;';
      } else if (idx === currentStatusIdx) {
        nodeClass = 'maroon';
        icon = '📦';
        textStyle = 'color: var(--primary-maroon); font-weight: 700; scale: 1.1;';
      }

      return `
        <div class="history-node ${nodeClass}" style="flex: 1; text-align: center;">
          <div style="font-size: 1.5rem; margin-bottom: 4px;">${icon}</div>
          <div class="history-node-title" style="${textStyle}">${status}</div>
          <div class="history-node-time" style="font-size: 0.75rem;">
            ${parcel.history.find(h => h.status === status) 
              ? formatDate(parcel.history.find(h => h.status === status).time) 
              : ''
            }
          </div>
        </div>
      `;
    }).join('');

    trackingResultsCard.style.display = 'block';
    trackingResultsCard.innerHTML = `
      <div class="card" style="border-top: 6px solid var(--primary-maroon); margin-bottom: 2rem;">
        <div class="card-title-bar">
          <div>
            <h3 style="color: var(--primary-maroon)">Tracking Reference: ${parcel.id}</h3>
            <span style="font-size: 0.8rem; color: var(--text-light)">Booked on ${formatDate(parcel.createdDate)}</span>
          </div>
          <span class="badge ${
            parcel.status === 'Collected' ? 'badge-success' :
            parcel.status === 'Arrived' ? 'badge-info' :
            parcel.status === 'Dispatched' ? 'badge-maroon' : 'badge-warning'
          }" style="font-size: 0.9rem; padding: 6px 14px;">
            ${parcel.status}
          </span>
        </div>

        <!-- Progress Timeline -->
        <div style="display: flex; justify-content: space-between; position: relative; margin: 2rem 0; background: var(--accent-gray-light); padding: 1.5rem; border-radius: var(--border-radius-md);">
          <!-- Connecting Line -->
          <div style="position: absolute; top: calc(50% - 10px); left: 10%; right: 10%; height: 3px; background: var(--accent-gray-medium); z-index: 1;"></div>
          <!-- Colored Progress Indicator Line -->
          <div style="position: absolute; top: calc(50% - 10px); left: 10%; width: ${Math.max(0, currentStatusIdx) * 26.6}%; height: 3px; background: var(--primary-maroon); z-index: 2; transition: var(--transition);"></div>
          
          <div style="display: flex; width: 100%; justify-content: space-between; z-index: 3;">
            ${stepsHTML}
          </div>
        </div>

        <div class="grid-2" style="margin-top: 1.5rem;">
          <!-- Parcel Specs -->
          <div>
            <h4 style="margin-bottom: 12px; color: var(--primary-blue); font-size: 1rem; border-bottom: 1px solid var(--accent-gray-medium); padding-bottom: 6px;">📋 Shipment Details</h4>
            <div class="receipt-row"><span>Route Corridor:</span><strong>Kampala ➔ ${parcel.routeTo}</strong></div>
            <div class="receipt-row"><span>Sender:</span><span>${parcel.senderName} (${parcel.senderPhone})</span></div>
            <div class="receipt-row"><span>Receiver:</span><strong>${parcel.receiverName} (${parcel.receiverPhone})</strong></div>
            <div class="receipt-row"><span>Item Info:</span><span>${parcel.description}</span></div>
            <div class="receipt-row"><span>Package Size:</span><span>Weight: ${parcel.weightKg} kg (${parcel.dimensions})</span></div>
            <div class="receipt-row"><span>Courier Fee Paid:</span><strong style="color: var(--primary-maroon);">${formatUGX(parcel.priceUGX)}</strong></div>
            ${parcel.journeyId ? `
              <div style="margin-top: 10px; padding: 8px; background: var(--primary-blue-light); border-radius: 6px; border: 1px solid var(--primary-blue-light); font-size: 0.8rem; display: flex; align-items: center; gap: 8px;">
                <span>🚌</span>
                <span>Assigned to active Bus journey <strong>${parcel.journeyId.toUpperCase()}</strong>.</span>
              </div>
            ` : ''}
          </div>

          <!-- Package Logs -->
          <div>
            <h4 style="margin-bottom: 12px; color: var(--primary-blue); font-size: 1rem; border-bottom: 1px solid var(--accent-gray-medium); padding-bottom: 6px;">📜 History Logs</h4>
            <div class="history-timeline">
              ${parcel.history.map(h => `
                <div class="history-node success">
                  <div class="history-node-title">${h.description}</div>
                  <div class="history-node-time">${formatDate(h.time)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  document.getElementById('btn-track-submit').addEventListener('click', () => {
    executeTracking(trackIdInput.value);
  });

  trackIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      executeTracking(trackIdInput.value);
    }
  });

  // Demo Links support
  document.querySelectorAll('.demo-track-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const code = e.target.textContent;
      trackIdInput.value = code;
      executeTracking(code);
    });
  });

  // Pre-load tracking if trackId parameter is passed in URL/navigation state
  if (params.trackId) {
    executeTracking(params.trackId);
  }

  // Prebooking submission
  const prebookForm = document.getElementById('prebook-form');
  const voucherCard = document.getElementById('prebook-voucher-card');

  prebookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const sender = document.getElementById('pb-sender').value;
    const senderPhone = document.getElementById('pb-sender-phone').value;
    const receiver = document.getElementById('pb-receiver').value;
    const receiverPhone = document.getElementById('pb-receiver-phone').value;
    const routeId = document.getElementById('pb-route').value;
    const size = document.getElementById('pb-size').value;
    const weight = parseFloat(document.getElementById('pb-weight').value) || 1;
    const desc = document.getElementById('pb-desc').value;
    const isFragile = document.getElementById('pb-fragile').checked;

    const route = state.destinations.find(d => d.id === routeId);
    if (!route) return;

    // Generate price
    const finalPrice = calculateCourierPrice(weight, route.courierBase, route.courierPerKg, isFragile, size);
    const draftCode = generateId('YY-DFT', 6);

    // Save as draft in local database
    const newParcelDraft = {
      id: draftCode,
      senderName: sender,
      senderPhone: senderPhone,
      receiverName: receiver,
      receiverPhone: receiverPhone,
      routeFrom: 'Kampala',
      routeTo: route.name,
      weightKg: weight,
      dimensions: `${size} box / package`,
      description: desc,
      priceUGX: finalPrice,
      status: 'Draft', // client prebooking is 'Draft' status
      journeyId: null,
      history: [
        { status: 'Draft', time: new Date().toISOString(), description: 'Pre-booked online by sender. Awaiting counter check-in.' }
      ],
      createdDate: new Date().toISOString()
    };

    // Update global state
    navigate('update-state', (currentState) => {
      currentState.parcels.unshift(newParcelDraft);
      return currentState;
    });

    // Render Voucher
    voucherCard.innerHTML = `
      <div class="simulated-receipt" style="width: 100%; border-color: var(--primary-maroon); border-style: solid;">
        <div class="receipt-header">
          <div class="receipt-title">YY BUSES COURIER</div>
          <div style="font-size: 0.75rem; text-transform: uppercase;">Uganda Parcel Service</div>
          <strong style="color: var(--primary-maroon); font-size: 0.85rem; display: block; margin-top: 4px;">PRE-BOOKING VOUCHER</strong>
        </div>
        
        <div class="receipt-row"><span>Voucher ID:</span><strong style="font-family: monospace; font-size: 1.1rem;">${draftCode}</strong></div>
        <div class="receipt-row"><span>Date:</span><span>${formatDate(new Date())}</span></div>
        <div class="receipt-divider"></div>
        
        <div class="receipt-row"><span>From:</span><span>Kampala Terminal</span></div>
        <div class="receipt-row"><span>To:</span><strong>${route.name} Hub</strong></div>
        <div class="receipt-row"><span>Sender:</span><span>${sender}</span></div>
        <div class="receipt-row"><span>Receiver:</span><strong>${receiver} (${receiverPhone})</strong></div>
        <div class="receipt-row"><span>Content:</span><span>${desc} (${weight} kg)</span></div>
        
        <div class="receipt-divider"></div>
        <div class="receipt-row" style="font-size: 1.1rem;"><span>Estimated Cost:</span><strong style="color: var(--primary-maroon);">${formatUGX(finalPrice)}</strong></div>
        
        <div class="receipt-barcode">
          <!-- Inline Mock Barcode using SVG -->
          <div style="margin-top: 10px;">
            <svg width="200" height="60" viewBox="0 0 200 60">
              <rect width="100%" height="100%" fill="white" />
              <!-- Generate simulated stripes -->
              ${Array.from({length: 30}).map((_, i) => {
                const width = (i % 3 === 0) ? 4 : (i % 2 === 0) ? 2 : 1;
                const x = i * 6 + 10;
                return `<rect x="${x}" y="5" width="${width}" height="40" fill="black" />`;
              }).join('')}
              <text x="100" y="55" text-anchor="middle" font-size="9" font-family="monospace">${draftCode}</text>
            </svg>
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 8px; width: 100%; margin-top: 1rem;">
        <button class="btn btn-secondary btn-block btn-sm" id="btn-print-voucher">🖨️ Print Voucher</button>
        <button class="btn btn-maroon btn-block btn-sm" id="btn-reset-voucher">📋 Book Another</button>
      </div>
    `;

    // Print logic handler
    document.getElementById('btn-print-voucher').addEventListener('click', () => {
      // Create a print container with print elements visible
      const printContainer = document.createElement('div');
      printContainer.className = 'print-only-container';
      printContainer.innerHTML = document.querySelector('.simulated-receipt').innerHTML;
      document.body.appendChild(printContainer);
      
      window.print();
      
      // Cleanup
      document.body.removeChild(printContainer);
    });

    document.getElementById('btn-reset-voucher').addEventListener('click', () => {
      prebookForm.reset();
      navigate('courier-client', { prefill: {} }); // Reload view
    });
  });
}
