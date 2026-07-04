import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Select, InputNumber, Row, Col, Typography, Space, Tag, Statistic } from 'antd';
import { CompassOutlined, DollarCircleOutlined, CarOutlined, PlusCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { formatUGX, formatDate } from '../utils.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function BusConductor({ state, navigate, updateState }) {
  const ongoingJourneys = state.journeys.filter(j => j.status === 'Scheduled' || j.status === 'In Transit');
  const [selectedJourneyId, setSelectedJourneyId] = useState(ongoingJourneys[0]?.id || '');
  
  const [expenseForm] = Form.useForm();
  const [waysideForm] = Form.useForm();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const journey = state.journeys.find(j => j.id === selectedJourneyId);
  const bus = journey ? state.buses.find(b => b.id === journey.busId) : null;
  const capacity = bus ? bus.capacity : 67;
  const tickets = journey ? journey.tickets : {};
  const totalFareCollected = Object.values(tickets).reduce((sum, t) => sum + t.amountPaid, 0);
  const totalExpenses = journey ? journey.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;

  // Start voyage
  const handleStartVoyage = () => {
    updateState((currentState) => {
      const j = currentState.journeys.find(x => x.id === selectedJourneyId);
      if (j) {
        j.status = 'In Transit';
        j.currentLocation = 'Kampala (Departed)';
        j.progress = 10;
      }
      return currentState;
    });
    alert("Voyage started! Bus has departed Kampala Terminal.");
  };

  // Advance checkpoint stop
  const handleAdvanceStop = () => {
    const nextStop = prompt("Enter checkpoint stop reached (e.g. Jinja, Iganga, Mbale, Soroti):");
    if (!nextStop) return;

    updateState((currentState) => {
      const j = currentState.journeys.find(x => x.id === selectedJourneyId);
      if (j) {
        j.currentLocation = nextStop;
        j.progress = Math.min(j.progress + 25, 90);
      }
      return currentState;
    });
  };

  // Complete Voyage
  const handleCompleteVoyage = () => {
    updateState((currentState) => {
      const j = currentState.journeys.find(x => x.id === selectedJourneyId);
      if (j) {
        j.status = 'Completed';
        j.currentLocation = j.routeTo;
        j.progress = 100;

        // Roster drivers/conductors as available
        const driver = currentState.staff.drivers.find(d => d.id === j.driverId);
        if (driver) driver.status = 'Available';

        const conductor = currentState.staff.conductors.find(c => c.id === j.conductorId);
        if (conductor) conductor.status = 'Available';
      }
      return currentState;
    });
    alert("Voyage complete! Resources set to roster available.");
  };

  // Log Route Expense
  const handleExpenseSubmit = (values) => {
    updateState((currentState) => {
      const j = currentState.journeys.find(x => x.id === selectedJourneyId);
      if (j) {
        j.expenses.push({
          id: `exp-${Math.floor(1000 + Math.random() * 9000)}`,
          category: values.category,
          description: values.description,
          amount: values.amount,
          time: new Date().toISOString()
        });
      }
      return currentState;
    });

    alert("Operational expense registered!");
    expenseForm.resetFields();
  };

  // Log wayside ticket sale
  const handleWaysideSubmit = (values) => {
    const ticketId = `YY-TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    updateState((currentState) => {
      const j = currentState.journeys.find(x => x.id === selectedJourneyId);
      if (j) {
        j.tickets[values.seat] = {
          ticketId,
          seatNo: values.seat,
          passengerName: values.name,
          passengerPhone: values.phone,
          amountPaid: values.fare,
          purchaseDate: new Date().toISOString(),
          status: 'Boarded'
        };
      }
      return currentState;
    });

    alert(`Cash ticket seat ${values.seat} booked wayside!`);
    waysideForm.resetFields();
  };

  // Check in manifest passenger
  const handleBoardPassenger = (seatNo) => {
    updateState((currentState) => {
      const j = currentState.journeys.find(x => x.id === selectedJourneyId);
      if (j && j.tickets[seatNo]) {
        j.tickets[seatNo].status = 'Boarded';
      }
      return currentState;
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ color: '#7a0016', margin: 0 }}>📱 Bus Conductor log terminal</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Mobile optimized panel for checkpoint log progression, roadside expenditures, and manifests checker</Paragraph>
        </div>
        <Button onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      {/* Select Voyage */}
      <Card size="small" style={{ marginBottom: 20 }}>
        <Form.Item label={<Text strong>Select active voyage duty</Text>} style={{ marginBottom: 0 }}>
          <Select value={selectedJourneyId} onChange={(val) => setSelectedJourneyId(val)}>
            {ongoingJourneys.map(j => (
              <Option key={j.id} value={j.id}>
                [{j.id.toUpperCase()}] Kampala ➔ {j.routeTo} ({j.status})
              </Option>
            ))}
            {ongoingJourneys.length === 0 && <Option value="">No Assigned Journeys Active</Option>}
          </Select>
        </Form.Item>
      </Card>

      {!journey ? (
        <Card style={{ textAlign: 'center', padding: 50 }}>
          <ProfileOutlined style={{ fontSize: '4rem', color: '#bfbfbf', marginBottom: 12 }} />
          <Title level={3} style={{ color: '#8c8c8c' }}>Manifest logs empty</Title>
          <Paragraph type="secondary">Verify that active dispatched bus journeys exist in the roster database to load the mobile conductor log panel.</Paragraph>
        </Card>
      ) : (
        <>
          {/* Quick Status Cards */}
          <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ borderLeft: '3px solid #52c41a' }}>
                <Statistic title="Total Ticket Cash" value={totalFareCollected} formatter={v => formatUGX(v)} valueStyle={{ fontSize: '1.1rem', color: '#52c41a', fontWeight: 700 }} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ borderLeft: '3px solid #ff4d4f' }}>
                <Statistic title="Logged Expenses" value={totalExpenses} formatter={v => formatUGX(v)} valueStyle={{ fontSize: '1.1rem', color: '#ff4d4f', fontWeight: 700 }} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ borderLeft: '3px solid #1a365d' }}>
                <Statistic title="Manifest Count" value={`${Object.keys(tickets).length} / ${capacity}`} valueStyle={{ fontSize: '1.1rem', fontWeight: 700 }} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ borderLeft: '3px solid #faad14' }}>
                <Statistic title="Checkpoint Stop" value={journey.currentLocation} valueStyle={{ fontSize: '1rem', fontWeight: 700 }} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            {/* Column 1 Stop Checkpoints & Expenses */}
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }} size={20}>
                {/* Checkpoints log */}
                <Card title={<Text strong style={{ color: '#7a0016' }}><CompassOutlined /> Route Progression Stops</Text>} extra={<Tag color="volcano">{journey.progress}% Done</Tag>}>
                  <div style={{ marginBottom: 20 }}>
                    <Text type="secondary" style={{ fontSize: '0.8rem' }}>Current location registered stop:</Text>
                    <Title level={4} style={{ color: '#1a365d', margin: '4px 0 0' }}>🏢 {journey.currentLocation}</Title>
                  </div>
                  
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {journey.status === 'Scheduled' ? (
                      <Button type="primary" block size="large" onClick={handleStartVoyage} style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }}>
                        🏁 Depart Kampala Terminal (Start Voyage)
                      </Button>
                    ) : journey.status === 'In Transit' ? (
                      <Row gutter={12}>
                        <Col span={12}>
                          <Button block onClick={handleAdvanceStop}>
                            📍 Arrived Stop
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} block onClick={handleCompleteVoyage}>
                            🏁 Arrived Final Hub
                          </Button>
                        </Col>
                      </Row>
                    ) : (
                      <Alert type="success" message="✓ Voyage Complete. Fleet resource returned to dispatch roster." showIcon />
                    )}
                  </Space>
                </Card>

                {/* Expenses logger */}
                <Card title={<Text strong style={{ color: '#7a0016' }}><DollarCircleOutlined /> Log Operational Expenses</Text>} bordered>
                  <Form form={expenseForm} layout="vertical" onFinish={handleExpenseSubmit} initialValues={{ category: 'Fuel', amount: 20000 }}>
                    <Row gutter={12}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="category" label="Expense Category" rules={[{ required: true }]}>
                          <Select>
                            <Option value="Fuel">Fuel / Diesel</Option>
                            <Option value="Police/Tolls">Highway police / Tolls</Option>
                            <Option value="Meals">Crew allowances</Option>
                            <Option value="Maintenance">Emergency repairs</Option>
                            <Option value="Others">Others</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} style={{ marginTop: isMobile ? 12 : 0 }}>
                        <Form.Item name="amount" label="Amount paid (UGX)" rules={[{ required: true }]}>
                          <InputNumber min={500} step={500} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="description" label="Detailed Description" rules={[{ required: true }]}>
                      <Input placeholder="e.g. 50L diesel shell Jinja, Highway toll fee" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} block>
                      Log Expense Ticket
                    </Button>
                  </Form>
                  
                  {journey.expenses.length > 0 && (
                    <div style={{ marginTop: 12, maxHeight: 110, overflowY: 'auto' }}>
                      <Table 
                        dataSource={journey.expenses}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        columns={[
                          { title: 'Category', dataIndex: 'category', key: 'category', render: (t) => <Text strong>{t}</Text> },
                          { title: 'Desc', dataIndex: 'description', key: 'description' },
                          { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v) => <Text style={{ color: '#ff4d4f', fontWeight: 600 }}>-{formatUGX(v)}</Text> },
                        ]}
                      />
                    </div>
                  )}
                </Card>
              </Space>
            </Col>

            {/* Column 2 Waysiders & manifest board */}
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }} size={20}>
                {/* Waysider Cash tickets */}
                <Card title={<Text strong style={{ color: '#1a365d' }}><PlusCircleOutlined /> Waysider Cash Ticketing</Text>} bordered>
                  <Form form={waysideForm} layout="vertical" onFinish={handleWaysideSubmit} initialValues={{ fare: 25000 }}>
                    <Row gutter={12}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="seat" label="Choose Vacant Seat" rules={[{ required: true }]}>
                          <Select placeholder="Choose seat">
                            {Array.from({ length: capacity }).map((_, i) => {
                              const num = i + 1;
                              if (!tickets[num]) {
                                return <Option key={num} value={num}>Seat #{num}</Option>;
                              }
                              return null;
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} style={{ marginTop: isMobile ? 12 : 0 }}>
                        <Form.Item name="fare" label="Midway fare charge" rules={[{ required: true }]}>
                          <InputNumber min={5000} step={1000} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={12}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Passenger Name" rules={[{ required: true }]}>
                          <Input placeholder="Waysider Name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} style={{ marginTop: isMobile ? 12 : 0 }}>
                        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                          <Input placeholder="+256 " />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }} block>
                      Log Midway Cash Sale
                    </Button>
                  </Form>
                </Card>

                {/* Manifest checkers */}
                <Card title="Seat Manifest Passenger Boarding check" bordered>
                  <Table 
                    dataSource={Object.values(tickets).sort((a,b) => a.seatNo - b.seatNo)}
                    rowKey="seatNo"
                    size="small"
                    pagination={false}
                    scroll={{ x: 'max-content', y: 220 }}
                    columns={[
                      { title: 'Seat', dataIndex: 'seatNo', key: 'seatNo', render: (num) => <Text strong>Seat {num}</Text>, width: 80 },
                      { 
                        title: 'Passenger Details', 
                        key: 'pax', 
                        render: (_, record) => (
                          <div>
                            <Text strong>{record.passengerName}</Text>
                            <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>{record.passengerPhone}</div>
                          </div>
                        ) 
                      },
                      { 
                        title: 'Status', 
                        dataIndex: 'status', 
                        key: 'status', 
                        render: (status) => <Tag color={status === 'Boarded' ? 'green' : 'orange'}>{status || 'CheckedIn'}</Tag> 
                      },
                      { 
                        title: 'Board Action', 
                        key: 'action', 
                        render: (_, record) => record.status !== 'Boarded' ? (
                          <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleBoardPassenger(record.seatNo)}>
                            Board
                          </Button>
                        ) : (
                          <Text type="secondary" style={{ fontSize: '0.75rem' }}>On Board</Text>
                        )
                      }
                    ]}
                  />
                </Card>
              </Space>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
