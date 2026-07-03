const STORAGE_KEY = 'yy_buses_system_state_v1';

const defaultDestinations = [
  { id: 'kla', name: 'Kampala', code: 'KLA', ticketPrice: 30000, courierBase: 10000, courierPerKg: 1500 },
  { id: 'mbl', name: 'Mbale', code: 'MBL', ticketPrice: 35000, courierBase: 12000, courierPerKg: 1800 },
  { id: 'srt', name: 'Soroti', code: 'SRT', ticketPrice: 40000, courierBase: 15000, courierPerKg: 2000 },
  { id: 'lra', name: 'Lira', code: 'LRA', ticketPrice: 45000, courierBase: 18000, courierPerKg: 2200 },
  { id: 'glu', name: 'Gulu', code: 'GLU', ticketPrice: 45000, courierBase: 18000, courierPerKg: 2200 },
  { id: 'jja', name: 'Jinja', code: 'JJA', ticketPrice: 15000, courierBase: 6000, courierPerKg: 1000 },
  { id: 'iga', name: 'Iganga', code: 'IGA', ticketPrice: 20000, courierBase: 8000, courierPerKg: 1200 },
  { id: 'trr', name: 'Tororo', code: 'TRR', ticketPrice: 30000, courierBase: 10000, courierPerKg: 1500 }
];

const defaultBuses = [
  { id: 'bus-01', regNo: 'UBE 102Y', model: 'Scania F310 (67 Seater)', capacity: 67, status: 'Active' },
  { id: 'bus-02', regNo: 'UBF 455X', model: 'Yutong ZK6122H (67 Seater)', capacity: 67, status: 'Active' },
  { id: 'bus-03', regNo: 'UBG 789B', model: 'Scania F310 (67 Seater)', capacity: 67, status: 'Active' },
  { id: 'bus-04', regNo: 'UBH 220Z', model: 'Yutong ZK6122H (67 Seater)', capacity: 67, status: 'Active' },
  { id: 'bus-05', regNo: 'UBJ 304K', model: 'Scania F310 (67 Seater)', capacity: 67, status: 'Maintenance' },
  { id: 'bus-06', regNo: 'UBK 911F', model: 'Yutong ZK6122H (67 Seater)', capacity: 67, status: 'Active' }
];

const defaultStaff = {
  drivers: [
    { id: 'drv-01', name: 'Okello John Bosco', phone: '+256 772 123456', license: 'DL78291X', status: 'Available' },
    { id: 'drv-02', name: 'Mugisha Ronald', phone: '+256 701 987654', license: 'DL65192B', status: 'Available' },
    { id: 'drv-03', name: 'Wanyama Godfrey', phone: '+256 781 456789', license: 'DL89021C', status: 'On Duty' },
    { id: 'drv-04', name: 'Otim Peter', phone: '+256 755 321098', license: 'DL43210M', status: 'Available' },
    { id: 'drv-05', name: 'Ssewankambo Yusuf', phone: '+256 779 881122', license: 'DL11294K', status: 'Available' }
  ],
  conductors: [
    { id: 'cnd-01', name: 'Nsubuga David', phone: '+256 774 234567', badge: 'CND-882', status: 'Available' },
    { id: 'cnd-02', name: 'Akello Sarah', phone: '+256 703 112233', badge: 'CND-409', status: 'Available' },
    { id: 'cnd-03', name: 'Chemutai Alex', phone: '+256 788 556677', badge: 'CND-152', status: 'On Duty' },
    { id: 'cnd-04', name: 'Atwine Brenda', phone: '+256 752 443322', badge: 'CND-762', status: 'Available' },
    { id: 'cnd-05', name: 'Kaganda Moses', phone: '+256 712 990088', badge: 'CND-305', status: 'Available' }
  ]
};

// Standard Ugandan 67-seater layout is 3 + 2 seats per row with a central aisle.
// Total 13 rows + 2 seats at front or back = 67. We can model seats 1 to 67.
// Let's pre-generate passenger ticket mock data
const generateTickets = (count, fare) => {
  const tickets = {};
  const names = ['Kato Ivan', 'Namubiru Sylvia', 'Onyango Emmanuel', 'Aisha Kemigisa', 'Musoke Fred', 'Alupo Agnes', 'Chelimo Mercy', 'Mwebaze Moses', 'Alowo Rebecca', 'Odongo Francis', 'Aceng Beatrice', 'Mukasa Arthur', 'Kizza Patrick', 'Namatovu Florence', 'Ssemwanga Timothy'];
  const phones = ['+256 782 112233', '+256 773 445566', '+256 701 556677', '+256 752 998877', '+256 779 123456', '+256 704 654321'];
  
  for (let i = 0; i < count; i++) {
    const seatNo = Math.floor(Math.random() * 60) + 1; // randomly assign seats
    if (!tickets[seatNo]) {
      const ticketId = `YY-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      tickets[seatNo] = {
        ticketId,
        seatNo,
        passengerName: names[Math.floor(Math.random() * names.length)],
        passengerPhone: phones[Math.floor(Math.random() * phones.length)],
        amountPaid: fare,
        purchaseDate: new Date(Date.now() - Math.random() * 24 * 3600 * 1000).toISOString(),
        status: 'CheckedIn'
      };
    }
  }
  return tickets;
};

const defaultJourneys = [
  {
    id: 'jny-001',
    busId: 'bus-01',
    routeFrom: 'Kampala',
    routeTo: 'Mbale',
    driverId: 'drv-03',
    conductorId: 'cnd-03',
    departureTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    status: 'In Transit', // In Transit, Scheduled, Completed, Cancelled
    progress: 75, // percentage of route completed
    currentLocation: 'Iganga', // e.g. Jinja, Iganga, Mbale
    routePath: ['Kampala', 'Jinja', 'Iganga', 'Mbale'],
    tickets: generateTickets(38, 35000), // 38 seats sold
    expenses: [
      { id: 'exp-01', category: 'Fuel', description: 'Initial fuel Kampala shell', amount: 180000, time: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
      { id: 'exp-02', category: 'Police/Tolls', description: 'Jinja bridge toll', amount: 10000, time: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
      { id: 'exp-03', category: 'Meals', description: 'Driver & Conductor lunch Namawojjolo', amount: 25000, time: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString() }
    ],
    cargo: [
      { id: 'crg-01', description: 'Bag of Mbale Coffee Beans (Commercial)', weightKg: 50, chargeUGX: 20000, status: 'Loaded' },
      { id: 'crg-02', description: 'Plastic crate of electronics', weightKg: 15, chargeUGX: 12000, status: 'Loaded' }
    ]
  },
  {
    id: 'jny-002',
    busId: 'bus-02',
    routeFrom: 'Kampala',
    routeTo: 'Soroti',
    driverId: 'drv-01',
    conductorId: 'cnd-01',
    departureTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), // Departs in 2 hours
    status: 'Scheduled',
    progress: 0,
    currentLocation: 'Kampala Terminal',
    routePath: ['Kampala', 'Jinja', 'Iganga', 'Mbale', 'Kumi', 'Soroti'],
    tickets: generateTickets(12, 40000), // 12 early bookings
    expenses: [],
    cargo: []
  },
  {
    id: 'jny-003',
    busId: 'bus-04',
    routeFrom: 'Lira',
    routeTo: 'Kampala',
    driverId: 'drv-02',
    conductorId: 'cnd-02',
    departureTime: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), // 10 hours ago
    status: 'Completed',
    progress: 100,
    currentLocation: 'Kampala Terminal',
    routePath: ['Lira', 'Kaberamaido', 'Soroti', 'Mbale', 'Iganga', 'Jinja', 'Kampala'],
    tickets: generateTickets(58, 45000), // Full house
    expenses: [
      { id: 'exp-04', category: 'Fuel', description: 'Fuel in Lira', amount: 200000, time: new Date(Date.now() - 11 * 3600 * 1000).toISOString() },
      { id: 'exp-05', category: 'Maintenance', description: 'Flat tire patch at Soroti', amount: 15000, time: new Date(Date.now() - 7 * 3600 * 1000).toISOString() },
      { id: 'exp-06', category: 'Police/Tolls', description: 'Highway traffic clearing', amount: 20000, time: new Date(Date.now() - 5 * 3600 * 1000).toISOString() }
    ],
    cargo: [
      { id: 'crg-03', description: 'Baskets of smoked fish', weightKg: 30, chargeUGX: 15000, status: 'Delivered' }
    ]
  }
];

const defaultParcels = [
  {
    id: 'YY-PRC-492810',
    senderName: 'Opio Samuel',
    senderPhone: '+256 772 901827',
    receiverName: 'Akwero Beatrice',
    receiverPhone: '+256 701 443322',
    routeFrom: 'Kampala',
    routeTo: 'Soroti',
    weightKg: 8.5,
    dimensions: '30x30x20 cm',
    description: 'Academic documents & laptop charger',
    priceUGX: 27000,
    status: 'Intake', // Draft, Intake, Dispatched, Arrived, Collected
    journeyId: null,
    history: [
      { status: 'Intake', time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), description: 'Package checked in at Kampala Office by Handler Brenda' }
    ],
    createdDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'YY-PRC-881920',
    senderName: 'Namaganda Proscovia',
    senderPhone: '+256 788 112299',
    receiverName: 'Mukasa Ronald',
    receiverPhone: '+256 754 887766',
    routeFrom: 'Kampala',
    routeTo: 'Mbale',
    weightKg: 22.0,
    dimensions: '50x50x50 cm large box',
    description: 'Personal effects & clothing bag',
    priceUGX: 51600, // base 12000 + 22 * 1800
    status: 'Dispatched',
    journeyId: 'jny-001', // Loaded on current active bus
    history: [
      { status: 'Intake', time: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), description: 'Checked in at Kampala Terminal' },
      { status: 'Dispatched', time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), description: 'Loaded on Bus UBE 102Y departing for Mbale' }
    ],
    createdDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'YY-PRC-109283',
    senderName: 'Kimbugwe Fred',
    senderPhone: '+256 775 889900',
    receiverName: 'Malinga Moses',
    receiverPhone: '+256 777 665544',
    routeFrom: 'Kampala',
    routeTo: 'Mbale',
    weightKg: 2.0,
    dimensions: 'Envelop small',
    description: 'Land Title Deeds & Birth Certificates',
    priceUGX: 15600,
    status: 'Arrived',
    journeyId: null,
    history: [
      { status: 'Intake', time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), description: 'Checked in at Kampala Terminal' },
      { status: 'Dispatched', time: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), description: 'Loaded on Bus UBF 455X' },
      { status: 'Arrived', time: new Date(Date.now() - 15 * 3600 * 1000).toISOString(), description: 'Arrived at Mbale Office. Awaiting collection.' }
    ],
    createdDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'YY-PRC-772619',
    senderName: 'Lanyero Christine',
    senderPhone: '+256 782 554433',
    receiverName: 'Odoch Patrick',
    receiverPhone: '+256 703 998811',
    routeFrom: 'Gulu',
    routeTo: 'Kampala',
    weightKg: 12.0,
    dimensions: 'Medium bag',
    description: 'Fresh shea butter cosmetic tubs',
    priceUGX: 44400,
    status: 'Collected',
    journeyId: null,
    history: [
      { status: 'Intake', time: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), description: 'Received in Gulu' },
      { status: 'Dispatched', time: new Date(Date.now() - 44 * 3600 * 1000).toISOString(), description: 'Dispatched on Bus UBJ 304K' },
      { status: 'Arrived', time: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), description: 'Arrived at Kampala Depot' },
      { status: 'Collected', time: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), description: 'Collected by Odoch Patrick. ID verified.' }
    ],
    createdDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

export const initializeState = () => {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to parse cached state", e);
    }
  }
  
  const initialState = {
    destinations: defaultDestinations,
    buses: defaultBuses,
    staff: defaultStaff,
    journeys: defaultJourneys,
    parcels: defaultParcels
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  return initialState;
};

export const getState = () => {
  return initializeState();
};

export const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  
  // Dispatch custom event to notify other modules of state change
  const event = new CustomEvent('yy_state_changed', { detail: state });
  window.dispatchEvent(event);
};

export const updateState = (updateFn) => {
  const state = getState();
  const newState = updateFn(state);
  saveState(newState || state);
  return newState || state;
};
