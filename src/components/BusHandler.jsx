import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, Select, InputNumber, Row, Col, Typography, Space, Tag, Tooltip, Modal } from 'antd';
import { CarOutlined, UserOutlined, DollarCircleOutlined, InboxOutlined, CalendarOutlined, PrinterOutlined } from '@ant-design/icons';
import { formatUGX, generateId, formatDate, generateBarcodeSVG } from '../utils.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function BusHandler({ state, navigate, updateState }) {
  // Available resources
  const activeBuses = state.buses.filter(b => b.status === 'Active');
  const availableDrivers = state.staff.drivers.filter(d => d.status === 'Available');
  const availableConductors = state.staff.conductors.filter(c => c.status === 'Available');

  // Ongoing/scheduled voyages
  const ongoingJourneys = state.journeys.filter(j => j.status === 'Scheduled' || j.status === 'In Transit');

  const [selectedJourneyId, setSelectedJourneyId] = useState(ongoingJourneys[0]?.id || '');
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Roster & Cargo Form Refs
  const [rosterForm] = Form.useForm();
  const [cargoForm] = Form.useForm();
  const [checkoutForm] = Form.useForm();
  
  // Ticket Print Modal State
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printedTickets, setPrintedTickets] = useState([]);

  const selectedJourney = state.journeys.find(j => j.id === selectedJourneyId);
  const bus = selectedJourney ? state.buses.find(b => b.id === selectedJourney.busId) : null;
  const capacity = bus ? bus.capacity : 67;
  const tickets = selectedJourney ? selectedJourney.tickets : {};
  const routeFare = selectedJourney ? state.destinations.find(d => d.name === selectedJourney.routeTo)?.ticketPrice || 30000 : 30000;

  // Roster voyage scheduler
  const handleRosterSubmit = (values) => {
    const route = state.destinations.find(d => d.id === values.route);
    if (!route) return;

    const departureDate = new Date();
    const [hours, minutes] = values.time.split(':');
    departureDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const newJourneyId = generateId('JNY', 3).toLowerCase();

    updateState((currentState) => {
      // Set driver and conductor duty status
      const drv = currentState.staff.drivers.find(d => d.id === values.driver);
      if (drv) drv.status = 'On Duty';

      const cond = currentState.staff.conductors.find(c => c.id === values.conductor);
      if (cond) cond.status = 'On Duty';

      const newJourney = {
        id: newJourneyId,
        busId: values.bus,
        routeFrom: 'Kampala',
        routeTo: route.name,
        driverId: values.driver,
        conductorId: values.conductor,
        departureTime: departureDate.toISOString(),
        status: 'Scheduled',
        progress: 0,
        currentLocation: 'Kampala Terminal',
        routePath: ['Kampala', 'Jinja', 'Iganga', 'Mbale', 'Soroti', 'Lira', 'Gulu'].slice(0, 4),
        tickets: {},
        expenses: [],
        cargo: []
      };

      currentState.journeys.unshift(newJourney);
      return currentState;
    });

    alert(`Journey ${newJourneyId.toUpperCase()} successfully scheduled!`);
    setSelectedJourneyId(newJourneyId);
    rosterForm.resetFields();
  };

  // Ticket checkout purchase
  const handleTicketingSubmit = (values) => {
    if (selectedSeats.length === 0) return;

    const ticketsGenerated = [];
    
    updateState((currentState) => {
      const journey = currentState.journeys.find(j => j.id === selectedJourneyId);
      if (journey) {
        selectedSeats.forEach(seatNo => {
          const ticketId = `YY-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
          const tkt = {
            ticketId,
            seatNo,
            passengerName: values.passengerName,
            passengerPhone: values.passengerPhone,
            amountPaid: routeFare,
            purchaseDate: new Date().toISOString(),
            status: 'CheckedIn'
          };
          journey.tickets[seatNo] = tkt;
          ticketsGenerated.push(tkt);
        });
      }
      return currentState;
    });

    setPrintedTickets(ticketsGenerated);
    setPrintModalVisible(true);
    setSelectedSeats([]);
    checkoutForm.resetFields();
  };

  // Undercarriage cargo logger
  const handleCargoSubmit = (values) => {
    updateState((currentState) => {
      const journey = currentState.journeys.find(j => j.id === selectedJourneyId);
      if (journey) {
        journey.cargo.push({
          id: `crg-pkg-${Math.floor(1000 + Math.random() * 9000)}`,
          description: values.description,
          weightKg: values.weight,
          chargeUGX: values.charge,
          status: 'Loaded'
        });
      }
      return currentState;
    });

    alert("Undercarriage commercial cargo registered!");
    cargoForm.resetFields();
  };

  const handlePrintBoardingPasses = () => {
    const content = document.getElementById('printable-boarding-passes').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Passenger Passes</title>
          <style>
            body { font-family: monospace; padding: 20px; text-align: center; }
            .pass-border { border: 2px dashed #000; padding: 16px; margin-bottom: 20px; background: #fff; max-width: 360px; margin: 0 auto; text-align: left; }
            .receipt-row { display: flex; justify-content: space-between; margin: 4px 0; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
          </style>
        </head>
        <body>
          ${content}
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setPrintModalVisible(false);
  };

  // Toggle seat clicks
  const handleSeatClick = (seatNo) => {
    if (tickets[seatNo]) return; // Occupied seat

    setSelectedSeats(prev => {
      if (prev.includes(seatNo)) {
        return prev.filter(s => s !== seatNo);
      } else {
        return [...prev, seatNo];
      }
    });
  };

  // Render Seating Layout
  const renderCabinSeatsGrid = () => {
    const numRows = Math.ceil(capacity / 5);
    const rows = [];
    let seatCounter = 1;

    for (let r = 0; r < numRows; r++) {
      const rowSeats = [];
      
      // Left 3
      for (let sLeft = 0; sLeft < 3; sLeft++) {
        if (seatCounter <= capacity) {
          rowSeats.push({ num: seatCounter, type: 'seat' });
          seatCounter++;
        }
      }
      // Aisle
      rowSeats.push({ type: 'aisle' });
      // Right 2
      for (let sRight = 0; sRight < 2; sRight++) {
        if (seatCounter <= capacity) {
          rowSeats.push({ num: seatCounter, type: 'seat' });
          seatCounter++;
        }
      }

      rows.push(
        <div key={r} className="seat-row">
          {rowSeats.map((item, idx) => {
            if (item.type === 'aisle') {
              return <div key={idx} className="seat-aisle"></div>;
            }
            
            const isOccupied = tickets[item.num] !== undefined;
            const isSel = selectedSeats.includes(item.num);
            
            if (isOccupied) {
              const tkt = tickets[item.num];
              const tooltipContent = (
                <div>
                  <strong>{tkt.passengerName}</strong><br />
                  Phone: {tkt.passengerPhone}<br />
                  Ref: {tkt.ticketId}<br />
                  Fare: {formatUGX(tkt.amountPaid)}
                </div>
              );
              
              return (
                <Tooltip key={idx} title={tooltipContent}>
                  <div className="seat occupied">
                    {item.num}
                  </div>
                </Tooltip>
              );
            }
            
            return (
              <div 
                key={idx} 
                className={`seat ${isSel ? 'selected' : ''}`}
                onClick={() => handleSeatClick(item.num)}
              >
                {item.num}
              </div>
            );
          })}
        </div>
      );
    }

    return rows;
  };

  return (
    <div style={{ maxWidth: 1250, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ color: '#1a365d', margin: 0 }}>🚌 Passenger Ticket Desk Office</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Dispatch bus voyages, issue boarding tickets on interactive seating layouts, and register commercial baggage</Paragraph>
        </div>
        <Button onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left: Scheduling & Selector */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size={24}>
            {/* Select Voyage */}
            <Card title={<Text strong style={{ color: '#1a365d' }}>1. Select Departure Voyage</Text>} bordered>
              <Form.Item label="Active Dispatch Roster" style={{ marginBottom: 12 }}>
                <Select value={selectedJourneyId} onChange={(val) => {
                  setSelectedJourneyId(val);
                  setSelectedSeats([]);
                }}>
                  {ongoingJourneys.map(j => (
                    <Option key={j.id} value={j.id}>
                      [{j.id.toUpperCase()}] Kampala ➔ {j.routeTo} ({j.status})
                    </Option>
                  ))}
                  {ongoingJourneys.length === 0 && <Option value="">No Active Journeys Scheduled</Option>}
                </Select>
              </Form.Item>
              
              {selectedJourney && (
                <Card size="small" style={{ backgroundColor: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size={4}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Bus fleet:</Text><Text strong>{bus ? bus.regNo : 'N/A'}</Text></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Driver Assigned:</Text><Text>{state.staff.drivers.find(d => d.id === selectedJourney.driverId)?.name || 'N/A'}</Text></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Conductor Assigned:</Text><Text>{state.staff.conductors.find(c => c.id === selectedJourney.conductorId)?.name || 'N/A'}</Text></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Ticket Tariff:</Text><Text style={{ color: '#1a365d', fontWeight: 700 }}>{formatUGX(routeFare)}</Text></div>
                  </Space>
                </Card>
              )}
            </Card>

            {/* Schedule Voyage Roster Form */}
            <Card title={<Text strong style={{ color: '#7a0016' }}>Schedule Daily Departures Roster</Text>} bordered style={{ borderTop: '4px solid #7a0016' }}>
              <Form form={rosterForm} layout="vertical" onFinish={handleRosterSubmit}>
                <Form.Item name="route" label="Destination Stop" rules={[{ required: true }]}>
                  <Select placeholder="Select station">
                    {state.destinations.map(d => (
                      <Option key={d.id} value={d.id}>{d.name}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="bus" label="Fleet Assigned" rules={[{ required: true }]}>
                  <Select placeholder="Select bus">
                    {activeBuses.map(b => (
                      <Option key={b.id} value={b.id}>{b.regNo} ({b.model})</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="driver" label="Driver Assigned" rules={[{ required: true }]}>
                      <Select placeholder="Driver">
                        {availableDrivers.map(d => (
                          <Option key={d.id} value={d.id}>{d.name.split(' ')[0]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="conductor" label="Conductor Assigned" rules={[{ required: true }]}>
                      <Select placeholder="Conductor">
                        {availableConductors.map(c => (
                          <Option key={c.id} value={c.id}>{c.name.split(' ')[0]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="time" label="Departure Time" rules={[{ required: true }]}>
                  <Input type="time" />
                </Form.Item>

                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} block disabled={activeBuses.length === 0 || availableDrivers.length === 0 || availableConductors.length === 0}>
                  Open Ticketing Board
                </Button>
              </Form>
            </Card>
          </Space>
        </Col>

        {/* Right: Seat map grid + Ticketing Checkout */}
        <Col xs={24} lg={16}>
          {!selectedJourney ? (
            <Card style={{ textAlign: 'center', padding: 50 }}>
              <InboxOutlined style={{ fontSize: '4.5rem', color: '#bfbfbf', marginBottom: 16 }} />
              <Title level={3} style={{ color: '#8c8c8c' }}>No Voyage Roster Selected</Title>
              <Paragraph type="secondary">Create a dispatch roster voyage or select an active scheduled departure on the left panel to load the interactive ticketing cabin.</Paragraph>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {/* Seat Cabin Layout */}
              <Col xs={24} md={14}>
                <div className="bus-seating-container">
                  <div className="bus-layout-header">
                    <Text strong style={{ color: '#1a365d' }}>67-SEATER BUS SEATING COMPARTMENT</Text>
                    <Tag color="blue">{Object.keys(tickets).length} / {capacity} Sold</Tag>
                  </div>
                  
                  <div className="bus-cabin">
                    <div className="cabin-front">
                      <div className="driver-seat">🎛️</div>
                      <div className="door-way">🚪 Entrance</div>
                    </div>

                    <div className="cabin-seats">
                      {renderCabinSeatsGrid()}
                    </div>
                  </div>

                  <div className="seat-legend">
                    <div className="legend-item"><div className="legend-box available"></div><Text size="small">Vacant</Text></div>
                    <div className="legend-item"><div className="legend-box selected"></div><Text size="small">Selected</Text></div>
                    <div className="legend-item"><div className="legend-box occupied"></div><Text size="small">Occupied</Text></div>
                  </div>
                </div>
              </Col>

              {/* Checkout & Cargo */}
              <Col xs={24} md={10}>
                <Space direction="vertical" style={{ width: '100%' }} size={24}>
                  {/* Ticket Purchase */}
                  <Card title={<Text strong style={{ color: '#1a365d' }}><CarOutlined /> Ticketing Desk Checkout</Text>} bordered>
                    {selectedSeats.length > 0 ? (
                      <Form form={checkoutForm} layout="vertical" onFinish={handleTicketingSubmit}>
                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                          <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Selected Seats:</Text>
                          <Text strong style={{ fontSize: '1.25rem', color: '#7a0016' }}>{selectedSeats.join(', ')}</Text>
                        </div>

                        <Form.Item name="passengerName" label="Passenger Full Name" rules={[{ required: true }]}>
                          <Input placeholder="e.g. Kato Ivan" />
                        </Form.Item>

                        <Form.Item name="passengerPhone" label="Passenger Contact Phone" rules={[{ required: true }]}>
                          <Input placeholder="e.g. +256 782 112233" />
                        </Form.Item>

                        <div style={{ borderTop: '1px dashed #d9d9d9', padding: '10px 0', margin: '12px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><Text type="secondary">Fare Per Seat:</Text><Text>{formatUGX(routeFare)}</Text></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text type="secondary">Total Bill:</Text><Text style={{ fontSize: '1.25rem', color: '#1a365d', fontWeight: 800 }}>{formatUGX(routeFare * selectedSeats.length)}</Text></div>
                        </div>

                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }} block>
                          Purchase & Print Boarding Pass
                        </Button>
                      </Form>
                    ) : (
                      <Paragraph type="secondary" style={{ textAlign: 'center', margin: '20px 0' }}>
                        Click vacant seat numbers on the cabin map layout to activate passenger ticket purchase checkout.
                      </Paragraph>
                    )}
                  </Card>

                  {/* Undercarriage cargo */}
                  <Card title={<Text strong style={{ color: '#7a0016' }}><InboxOutlined /> Luggage & Undercarriage Cargo</Text>} bordered style={{ borderTop: '4px solid #7a0016' }}>
                    <Form form={cargoForm} layout="vertical" onFinish={handleCargoSubmit} initialValues={{ weight: 20, charge: 15000 }}>
                      <Form.Item name="description" label="Cargo Details / Tag Description" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Commercial sack of coffee, boxes of fish" />
                      </Form.Item>

                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="charge" label="Loading Fee (UGX)" rules={[{ required: true }]}>
                            <InputNumber min={500} step={500} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Button type="primary" htmlType="submit" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} block>
                        Register Cargo Load
                      </Button>
                    </Form>
                  </Card>
                </Space>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {/* Printable Passes Modal Representation */}
      <Modal
        title="Ticketing Desk Boarding Passes Office"
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPrintModalVisible(false)}>Close</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }} onClick={handlePrintBoardingPasses}>
            Send to Thermal Printer
          </Button>
        ]}
      >
        <div id="printable-boarding-passes" style={{ maxHeight: 400, overflowY: 'auto' }}>
          {printedTickets.map((t, idx) => (
            <div key={idx} className="pass-border">
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: '1.1rem', color: '#7a0016' }}>YY BUSES BOARDING PASS</strong>
                <div style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>Quality Services, Safe Journeys</div>
              </div>
              <div className="receipt-row"><span>Ticket ID:</span><strong style={{ fontFamily: 'monospace' }}>{t.ticketId}</strong></div>
              <div className="receipt-row"><span>Voyage:</span><strong>Kampala ➔ {selectedJourney?.routeTo}</strong></div>
              <div className="receipt-row"><span>Departs:</span><span>{selectedJourney ? formatDate(selectedJourney.departureTime) : ''}</span></div>
              <div className="receipt-row"><span>Bus Reg:</span><strong>{bus ? bus.regNo : 'N/A'}</strong></div>
              <div className="divider"></div>
              
              <div className="receipt-row"><span>Passenger:</span><strong>{t.passengerName}</strong></div>
              <div className="receipt-row"><span>Phone:</span><span>{t.passengerPhone}</span></div>
              <div style={{ border: '2px solid #000', padding: 4, textAlign: 'center', margin: '8px 0', fontSize: '1.25rem', fontWeight: 900 }}>
                SEAT NUMBER: ${t.seatNo}
              </div>
              
              <div className="divider"></div>
              <div className="receipt-row"><span>Fare Paid:</span><strong>{formatUGX(t.amountPaid)}</strong></div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <div dangerouslySetInnerHTML={{ __html: generateBarcodeSVG(t.ticketId) }} />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
