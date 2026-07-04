import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Form, Input, Button, Table, Select, Checkbox, Tag, Space, Typography, QRCode, InputNumber, Alert } from 'antd';
import { SearchOutlined, ShoppingOutlined, PrinterOutlined, CarOutlined, InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatUGX, generateId, calculateCourierPrice, formatDate } from '../utils.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function CourierHandler({ state, navigate, updateState }) {
  const [activeTab, setActiveTab] = useState('intake');
  const [draftCode, setDraftCode] = useState('');
  const [intakeLabel, setIntakeLabel] = useState(null);
  
  const [intakeForm] = Form.useForm();
  
  // Selection keys for package dispatch
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedJourneyId, setSelectedJourneyId] = useState('');

  // Categorized packages
  const packagesAwaitingDispatch = state.parcels.filter(p => p.status === 'Intake');
  const packagesInTransit = state.parcels.filter(p => p.status === 'Dispatched');
  const packagesAwaitingPickup = state.parcels.filter(p => p.status === 'Arrived');
  const draftBookings = state.parcels.filter(p => p.status === 'Draft');

  const activeDepartures = state.journeys.filter(j => j.status === 'Scheduled' || j.status === 'In Transit');

  // Draft Lookup Handler
  const handleDraftLookup = () => {
    if (!draftCode) return;
    const cleanCode = draftCode.trim().toUpperCase();
    const draft = state.parcels.find(p => p.id === cleanCode && p.status === 'Draft');
    
    if (draft) {
      const matchedRoute = state.destinations.find(d => d.name === draft.routeTo);
      
      intakeForm.setFieldsValue({
        senderName: draft.senderName,
        senderPhone: draft.senderPhone,
        receiverName: draft.receiverName,
        receiverPhone: draft.receiverPhone,
        route: matchedRoute ? matchedRoute.id : 'mbl',
        size: 'medium',
        weight: draft.weightKg,
        description: draft.description,
        fragile: draft.history[0]?.description.includes('Fragile') || false,
        draftId: draft.id
      });
      alert(`Draft pre-booking found for ${draft.senderName}! Prefilled form.`);
    } else {
      alert("Draft booking code not found or already verified.");
    }
  };

  // Intake Submission
  const handleIntakeSubmit = (values) => {
    const route = state.destinations.find(d => d.id === values.route);
    if (!route) return;

    const price = calculateCourierPrice(
      values.weight || 2.0,
      route.courierBase,
      route.courierPerKg,
      values.fragile || false,
      values.size || 'medium'
    );

    const newCode = generateId('YY-PRC', 6);

    updateState((currentState) => {
      // Delete draft prebooking if loaded from one
      if (values.draftId) {
        currentState.parcels = currentState.parcels.filter(p => p.id !== values.draftId);
      }

      const activeParcel = {
        id: newCode,
        senderName: values.senderName,
        senderPhone: values.senderPhone,
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        routeFrom: 'Kampala',
        routeTo: route.name,
        weightKg: values.weight || 2.0,
        dimensions: `${values.size.toUpperCase()} package`,
        description: values.description,
        priceUGX: price,
        status: 'Intake',
        journeyId: null,
        history: [
          { status: 'Intake', time: new Date().toISOString(), description: `Verified & checked-in at Kampala terminal.` }
        ],
        createdDate: new Date().toISOString()
      };

      currentState.parcels.unshift(activeParcel);
      return currentState;
    });

    setIntakeLabel({
      id: newCode,
      senderName: values.senderName,
      senderPhone: values.senderPhone,
      receiverName: values.receiverName,
      receiverPhone: values.receiverPhone,
      routeTo: route.name,
      weightKg: values.weight || 2.0,
      dimensions: `${values.size.toUpperCase()} package`,
      description: values.description,
      priceUGX: price,
      fragile: values.fragile
    });

    intakeForm.reset();
  };

  const handlePrintLabel = () => {
    const content = document.getElementById('printable-package-label').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label</title>
          <style>
            body { font-family: sans-serif; padding: 20px; text-align: center; }
            .label-border { border: 3px solid #1a365d; padding: 16px; border-radius: 8px; max-width: 380px; margin: 0 auto; text-align: left; }
            .receipt-row { display: flex; justify-content: space-between; margin: 6px 0; }
            .divider { border-top: 1px dashed #d9d9d9; margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="label-border">${content}</div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Dispatch selected parcels to bus
  const handleDispatchExecute = () => {
    if (selectedRowKeys.length === 0 || !selectedJourneyId) return;

    const journey = state.journeys.find(j => j.id === selectedJourneyId);
    const bus = state.buses.find(b => b.id === (journey ? journey.busId : ''));
    if (!journey) return;

    updateState((currentState) => {
      selectedRowKeys.forEach(pid => {
        const parcel = currentState.parcels.find(p => p.id === pid);
        if (parcel) {
          parcel.status = 'Dispatched';
          parcel.journeyId = selectedJourneyId;
          parcel.history.push({
            status: 'Dispatched',
            time: new Date().toISOString(),
            description: `Dispatched on Bus ${bus ? bus.regNo : 'N/A'} (Voyage ${selectedJourneyId.toUpperCase()}) departing for ${journey.routeTo}`
          });

          // Register in undercarriage cargo
          const routeJourney = currentState.journeys.find(j => j.id === selectedJourneyId);
          if (routeJourney) {
            routeJourney.cargo.push({
              id: `crg-pkg-${pid}`,
              description: `Courier Parcel: ${parcel.description} (Ref: ${pid})`,
              weightKg: parcel.weightKg,
              chargeUGX: 0,
              status: 'Loaded'
            });
          }
        }
      });
      return currentState;
    });

    alert(`Successfully loaded ${selectedRowKeys.length} parcels onto Bus voyage ${selectedJourneyId.toUpperCase()}!`);
    setSelectedRowKeys([]);
    setSelectedJourneyId('');
  };

  // Mark parcel as Arrived at destination hub
  const handleArriveParcel = (pid) => {
    updateState((currentState) => {
      const parcel = currentState.parcels.find(p => p.id === pid);
      if (parcel) {
        parcel.status = 'Arrived';
        parcel.history.push({
          status: 'Arrived',
          time: new Date().toISOString(),
          description: `Arrived at regional office in ${parcel.routeTo}. Receiver notified.`
        });
      }
      return currentState;
    });
    alert(`Parcel ${pid} checked in. Client notified.`);
  };

  // Mark parcel as Collected by recipient
  const handleCollectParcel = (pid) => {
    const docName = prompt("Enter Receiver's Verification ID Number / Document details:");
    if (docName === null) return;

    updateState((currentState) => {
      const parcel = currentState.parcels.find(p => p.id === pid);
      if (parcel) {
        parcel.status = 'Collected';
        parcel.history.push({
          status: 'Collected',
          time: new Date().toISOString(),
          description: `Collected by receiver. ID details verified: [${docName || 'Mobile Code Verified'}].`
        });
      }
      return currentState;
    });
    alert(`Parcel ${pid} handed out successfully.`);
  };

  // Table Columns for Dispatch list
  const dispatchColumns = [
    { title: 'Parcel ID', dataIndex: 'id', key: 'id', render: (text) => <Text strong>{text}</Text> },
    { title: 'Destination', dataIndex: 'routeTo', key: 'routeTo', render: (t) => <Tag color="volcano">{t}</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Receiver Details', key: 'receiver', render: (_, r) => <Text>{r.receiverName} ({r.receiverPhone})</Text> },
    { title: 'Details', key: 'details', render: (_, r) => <Text>{r.weightKg} kg / {r.dimensions}</Text> },
    { title: 'Intake Date', dataIndex: 'createdDate', key: 'createdDate', render: (t) => formatDate(t) },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ color: '#7a0016', margin: 0 }}>📦 Courier Handler Desk</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Terminal counters logistics workspace. Intake parcels, load onto buses, and checkout arrivals</Paragraph>
        </div>
        <Button onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      {/* Quick Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderLeft: '3px solid #7a0016' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Warehouse stock</Text>
            <Title level={3} style={{ margin: 0 }}>{packagesAwaitingDispatch.length}</Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderLeft: '3px solid #1a365d' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Parcels En Route</Text>
            <Title level={3} style={{ margin: 0 }}>{packagesInTransit.length}</Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderLeft: '3px solid #13c2c2' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Ready for Pickup</Text>
            <Title level={3} style={{ margin: 0 }}>{packagesAwaitingPickup.length}</Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderLeft: '3px solid #faad14' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Draft Prebookings</Text>
            <Title level={3} style={{ margin: 0 }}>{draftBookings.length}</Title>
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} type="card">
        {/* Tab 1: Intake */}
        <Tabs.TabPane tab="📥 Package Counter Intake" key="intake">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={14}>
              <Card title="Intake Drop-off Registration" bordered>
                {/* Prebooking search lookup bar */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: 12, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
                  <Input 
                    placeholder="Search Pre-booking Code (e.g. YY-DFT-...)" 
                    value={draftCode} 
                    onChange={(e) => setDraftCode(e.target.value)} 
                  />
                  <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} onClick={handleDraftLookup}>
                    Lookup Draft
                  </Button>
                </div>

                <Form form={intakeForm} layout="vertical" onFinish={handleIntakeSubmit}>
                  <Form.Item name="draftId" style={{ display: 'none' }}><Input type="hidden" /></Form.Item>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="senderName" label="Sender Name" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="senderPhone" label="Sender Phone" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="receiverName" label="Receiver Name" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="receiverPhone" label="Receiver Phone" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="route" label="Destination Hub" rules={[{ required: true }]}>
                        <Select>
                          {state.destinations.map(d => (
                            <Option key={d.id} value={d.id}>{d.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="size" label="Box Volume Size">
                        <Select>
                          <Option value="small">Small (Envelope)</Option>
                          <Option value="medium">Medium (Box/Bag)</Option>
                          <Option value="large">Large (Suitcase)</Option>
                          <Option value="extra-large">Extra Large (Sack)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}>
                        <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="description" label="Cargo Description" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Land documents, shoes, clothes" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="fragile" valuePropName="checked">
                    <Checkbox>Requires fragile or special electronic handling</Checkbox>
                  </Form.Item>

                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => intakeForm.reset()}>Clear Form</Button>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }}>
                      Register Intake & Generate Sticker
                    </Button>
                  </Space>
                </Form>
              </Card>
            </Col>

            {/* Label preview side */}
            <Col xs={24} lg={10}>
              <Card title="Sticky Package Tag Preview" bordered style={{ textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {intakeLabel ? (
                  <div style={{ textAlign: 'left' }}>
                    <div id="printable-package-label">
                      <div style={{ border: '2px solid #1a365d', padding: 12, borderRadius: 8, background: '#fff', color: '#000' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1a365d', paddingBottom: 6 }}>
                          <div>
                            <strong style={{ fontSize: '1rem', color: '#7a0016' }}>YY COURIER SERVICE</strong>
                            <div style={{ fontSize: '0.55rem', letterSpacing: 0.5 }}>UGANDA EXPRESS CARGO</div>
                          </div>
                          <strong style={{ fontSize: '1.2rem', fontFamily: 'monospace' }}>{intakeLabel.id}</strong>
                        </div>
                        
                        <div style={{ margin: '8px 0', fontSize: '0.75rem' }}>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: '0.6rem', display: 'block' }}>SENDER</Text>
                              <strong>{intakeLabel.senderName}</strong>
                              <div>{intakeLabel.senderPhone}</div>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: '0.6rem', display: 'block' }}>RECEIVER (Notify on arrival)</Text>
                              <strong style={{ color: '#7a0016' }}>{intakeLabel.receiverName}</strong>
                              <div>{intakeLabel.receiverPhone}</div>
                            </Col>
                          </Row>
                        </div>
                        
                        <div style={{ borderTop: '1px dashed #bfbfbf', borderBottom: '1px dashed #bfbfbf', padding: '6px 0', margin: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: '0.6rem', display: 'block' }}>DESTINATION OFFICE</Text>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a365d' }}>{intakeLabel.routeTo.toUpperCase()}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Text type="secondary" style={{ fontSize: '0.6rem', display: 'block' }}>WEIGHT & CHARGE</Text>
                            <strong>{intakeLabel.weightKg} kg</strong>
                            <div style={{ color: '#7a0016', fontWeight: 700 }}>{formatUGX(intakeLabel.priceUGX)}</div>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '0.7rem', padding: 4, backgroundColor: '#f5f5f5', borderRadius: 4, marginBottom: 8 }}>
                          <strong>Contents:</strong> {intakeLabel.description} {intakeLabel.fragile ? '⚠️ FRAGILE' : ''}
                        </div>
                        
                        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center' }}>
                          <QRCode value={intakeLabel.id} size={90} color="#1a365d" />
                        </div>
                      </div>
                    </div>
                    
                    <Space style={{ width: '100%', marginTop: 16 }}>
                      <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrintLabel} block>Print Sticker Label</Button>
                      <Button onClick={() => setIntakeLabel(null)} block>Intake Another</Button>
                    </Space>
                  </div>
                ) : (
                  <div style={{ color: '#bfbfbf', padding: 20 }}>
                    <InboxOutlined style={{ fontSize: '4.5rem', color: '#bfbfbf', marginBottom: 12 }} />
                    <Title level={4} style={{ color: '#8c8c8c', margin: 0 }}>Sticker Tag Preview</Title>
                    <Paragraph type="secondary" style={{ fontSize: '0.85rem', maxWidth: 300, margin: '8px auto 0' }}>
                      Register the parcel using the form. A barcode sticker tag will be rendered here for print paste.
                    </Paragraph>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        {/* Tab 2: Dispatch to Bus */}
        <Tabs.TabPane tab="🚌 Route Load Dispatch" key="dispatch">
          <Card bordered>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', padding: 16, backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: 8 }}>
              <div>
                <Text strong>1. Assign Select Voyage Route:</Text>
                <Select 
                  placeholder="Select active bus journey" 
                  style={{ width: 320, marginLeft: 8 }}
                  value={selectedJourneyId}
                  onChange={(val) => setSelectedJourneyId(val)}
                >
                  {activeDepartures.map(j => {
                    const bus = state.buses.find(b => b.id === j.busId);
                    return (
                      <Option key={j.id} value={j.id}>
                        [{j.id.toUpperCase()}] Kampala ➔ {j.routeTo} ({bus ? bus.regNo : 'No Fleet'})
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <Button 
                type="primary" 
                icon={<CarOutlined />} 
                style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }}
                disabled={selectedRowKeys.length === 0 || !selectedJourneyId}
                onClick={handleDispatchExecute}
              >
                Dispatch Selected Cargo ({selectedRowKeys.length} items)
              </Button>
            </div>

            <Table 
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys)
              }}
              dataSource={packagesAwaitingDispatch}
              columns={dispatchColumns}
              rowKey="id"
              locale={{ emptyText: 'No packages currently in warehouse awaiting dispatch.' }}
            />
          </Card>
        </Tabs.TabPane>

        {/* Tab 3: Arrivals & Collection */}
        <Tabs.TabPane tab="🎁 Arrivals & Receivers collections" key="pickup">
          <Row gutter={[24, 24]}>
            {/* Transit Arrivals check-in */}
            <Col xs={24} lg={12}>
              <Card title="Coordinate Voyage Hub Arrivals" bordered>
                <Table 
                  dataSource={packagesInTransit}
                  rowKey="id"
                  size="small"
                  locale={{ emptyText: 'No packages currently en route.' }}
                  columns={[
                    { title: 'Parcel ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>{t}</Text> },
                    { title: 'Bus Voyage', dataIndex: 'journeyId', key: 'journeyId', render: (t) => <Tag color="blue">{t.toUpperCase()}</Tag> },
                    { title: 'Receiver', dataIndex: 'receiverName', key: 'receiverName' },
                    { 
                      title: 'Hub Check-in', 
                      key: 'action', 
                      render: (_, r) => (
                        <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleArriveParcel(r.id)}>
                          Check-in Arrived
                        </Button>
                      )
                    }
                  ]}
                />
              </Card>
            </Col>

            {/* Receiver handout collections */}
            <Col xs={24} lg={12}>
              <Card title="Handout Collections Checkout" bordered>
                <Table 
                  dataSource={packagesAwaitingPickup}
                  rowKey="id"
                  size="small"
                  locale={{ emptyText: 'No packages awaiting pickup at regional hub.' }}
                  columns={[
                    { title: 'Parcel ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>{t}</Text> },
                    { title: 'Receiver Details', key: 'rec', render: (_, r) => <Text strong>{r.receiverName} ({r.receiverPhone})</Text> },
                    { title: 'Hub Stop', dataIndex: 'routeTo', key: 'routeTo' },
                    { 
                      title: 'Handout Check', 
                      key: 'action', 
                      render: (_, r) => (
                        <Button type="primary" size="small" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} onClick={() => handleCollectParcel(r.id)}>
                          Verify & Handout
                        </Button>
                      )
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
