import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Steps, Timeline, Row, Col, Typography, QRCode, Space, Alert, Select, Checkbox, InputNumber } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, PrinterOutlined, HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatUGX, generateId, calculateCourierPrice, formatDate } from '../utils.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function CourierClient({ state, navigate, updateState, params }) {
  const [activeTab, setActiveTab] = useState('track');
  const [trackCode, setTrackCode] = useState(params.trackId || '');
  const [searchedParcel, setSearchedParcel] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [bookingVoucher, setBookingVoucher] = useState(null);
  
  const [prebookForm] = Form.useForm();
  
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If a trackId is passed through navigation, perform auto-track lookup
  useEffect(() => {
    if (params.trackId) {
      handleTrackLookup(params.trackId);
    }
    if (params.prefill) {
      setActiveTab('prebook');
      prebookForm.setFieldsValue({
        route: params.prefill.routeId,
        weight: params.prefill.weight,
        size: params.prefill.size,
        fragile: params.prefill.isFragile
      });
    }
  }, [params]);

  // Lookup tracker action
  const handleTrackLookup = (code) => {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    
    const parcel = state.parcels.find(p => p.id === cleanCode || p.id.replace(/-/g, '').includes(cleanCode.replace(/-/g, '')));
    
    if (parcel) {
      setSearchedParcel(parcel);
      setSearchError(false);
    } else {
      setSearchedParcel(null);
      setSearchError(cleanCode);
    }
  };

  // Prebooking submission
  const handlePrebookSubmit = (values) => {
    const route = state.destinations.find(d => d.id === values.route);
    if (!route) return;

    const finalPrice = calculateCourierPrice(
      values.weight || 2.0,
      route.courierBase,
      route.courierPerKg,
      values.fragile || false,
      values.size || 'medium'
    );

    const draftCode = generateId('YY-DFT', 6);

    const newParcelDraft = {
      id: draftCode,
      senderName: values.senderName,
      senderPhone: values.senderPhone,
      receiverName: values.receiverName,
      receiverPhone: values.receiverPhone,
      routeFrom: 'Kampala',
      routeTo: route.name,
      weightKg: values.weight || 2.0,
      dimensions: `${values.size.toUpperCase()} package`,
      description: values.description,
      priceUGX: finalPrice,
      status: 'Draft',
      journeyId: null,
      history: [
        { status: 'Draft', time: new Date().toISOString(), description: 'Pre-booked online by sender. Awaiting counter check-in.' }
      ],
      createdDate: new Date().toISOString()
    };

    updateState((currentState) => {
      currentState.parcels.unshift(newParcelDraft);
      return currentState;
    });

    setBookingVoucher({ ...newParcelDraft, routeName: route.name });
  };

  const handlePrintVoucher = () => {
    const content = document.getElementById('printable-voucher-tag').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Voucher Print</title>
          <style>
            body { font-family: monospace; padding: 20px; text-align: center; }
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
  };

  const trackingSteps = ['Intake', 'Dispatched', 'Arrived', 'Collected'];
  const getStepProgressIndex = (status) => trackingSteps.indexOf(status);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ color: '#7a0016', margin: 0 }}>📦 Courier Customer Workspace</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Track your logistics parcel progression or pre-book counter drop-offs</Paragraph>
        </div>
        <Button onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={(key) => {
          setActiveTab(key);
          setBookingVoucher(null);
        }}
        type="card"
      >
        {/* Tab 1: Track Package */}
        <Tabs.TabPane tab="🔍 Track Cargo Package" key="track">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card>
                <div style={{ display: 'flex', gap: 10, flexDirection: isMobile ? 'column' : 'row' }}>
                  <Input 
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Enter Tracking Reference Code (e.g. YY-PRC-881920)" 
                    value={trackCode}
                    onChange={(e) => setTrackCode(e.target.value)}
                    onPressEnter={() => handleTrackLookup(trackCode)}
                  />
                  <Button type="primary" size="large" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} onClick={() => handleTrackLookup(trackCode)}>
                    Track Package
                  </Button>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Text type="secondary">Quick demo search options: </Text>
                  {state.parcels.slice(0, 3).map(p => (
                    <Button 
                      key={p.id} 
                      type="link" 
                      onClick={() => {
                        setTrackCode(p.id);
                        handleTrackLookup(p.id);
                      }}
                      style={{ padding: '0 6px', fontFamily: 'monospace', fontWeight: 600 }}
                    >
                      {p.id}
                    </Button>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Search Error */}
            {searchError && (
              <Col span={24}>
                <Alert 
                  type="error" 
                  message="Tracking Code Not Found" 
                  description={`We couldn't locate a package matching "${searchError}". Please verify the code or contact support.`}
                  showIcon 
                />
              </Col>
            )}

            {/* Tracking Details */}
            {searchedParcel && (
              <Col span={24}>
                <Card 
                  title={<Title level={4} style={{ margin: 0, color: '#7a0016' }}>Ref: {searchedParcel.id}</Title>}
                  extra={<Tag color="red" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>{searchedParcel.status}</Tag>}
                >
                  {/* Visual Progress Steps */}
                  <div style={{ padding: '24px 0', background: 'rgba(0,0,0,0.01)', borderRadius: 12, marginBottom: 24 }}>
                    <Steps 
                      current={getStepProgressIndex(searchedParcel.status)}
                      status={searchedParcel.status === 'Collected' ? 'finish' : 'process'}
                      style={{ padding: isMobile ? '0 16px' : '0 40px' }}
                      direction={isMobile ? 'vertical' : 'horizontal'}
                      items={[
                        { title: 'Intake', description: searchedParcel.history.find(h => h.status === 'Intake') ? formatDate(searchedParcel.history.find(h => h.status === 'Intake').time) : 'Pending' },
                        { title: 'Dispatched', description: searchedParcel.history.find(h => h.status === 'Dispatched') ? formatDate(searchedParcel.history.find(h => h.status === 'Dispatched').time) : 'Pending' },
                        { title: 'Arrived', description: searchedParcel.history.find(h => h.status === 'Arrived') ? formatDate(searchedParcel.history.find(h => h.status === 'Arrived').time) : 'Pending' },
                        { title: 'Collected', description: searchedParcel.history.find(h => h.status === 'Collected') ? formatDate(searchedParcel.history.find(h => h.status === 'Collected').time) : 'Pending' },
                      ]}
                    />
                  </div>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Title level={5} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}><ShoppingCartOutlined /> Package Details</Title>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Route:</Text><Text strong>Kampala to {searchedParcel.routeTo}</Text></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Sender:</Text><Text>{searchedParcel.senderName} ({searchedParcel.senderPhone})</Text></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Receiver:</Text><Text strong>{searchedParcel.receiverName} ({searchedParcel.receiverPhone})</Text></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Description:</Text><Text>{searchedParcel.description}</Text></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Package Volume:</Text><Text>{searchedParcel.weightKg} kg ({searchedParcel.dimensions})</Text></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Price Charge:</Text><Text style={{ color: '#7a0016', fontWeight: 700 }}>{formatUGX(searchedParcel.priceUGX)}</Text></div>
                        {searchedParcel.journeyId && (
                          <Alert 
                            type="info" 
                            message={`Transit Bus Voyage: ${searchedParcel.journeyId.toUpperCase()}`}
                            showIcon
                            style={{ marginTop: 12 }}
                          />
                        )}
                      </Space>
                    </Col>
                    
                    <Col xs={24} md={12} style={{ marginTop: isMobile ? 24 : 0 }}>
                      <Title level={5} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}><HistoryOutlined /> History Logs</Title>
                      <Timeline 
                        items={searchedParcel.history.map(h => ({
                          color: h.status === searchedParcel.status ? '#7a0016' : 'green',
                          children: (
                            <div>
                              <Text strong>{h.description}</Text>
                              <div style={{ fontSize: '0.75rem', color: '#bfbfbf' }}>{formatDate(h.time)}</div>
                            </div>
                          )
                        }))}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
        </Tabs.TabPane>

        {/* Tab 2: Prebooking */}
        <Tabs.TabPane tab="📋 Counter Pre-Booking" key="prebook">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={14}>
              <Card title="Pre-Book Drop-Off Package" bordered>
                <Form 
                  form={prebookForm} 
                  layout="vertical"
                  onFinish={handlePrebookSubmit}
                  initialValues={{ size: 'medium', weight: 2.0, fragile: false }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="senderName" label="Sender Name" rules={[{ required: true, message: 'Please input sender name' }]}>
                        <Input placeholder="e.g. Opio Samuel" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="senderPhone" label="Sender Phone" rules={[{ required: true, message: 'Please input sender phone' }]}>
                        <Input placeholder="e.g. +256 772 123456" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="receiverName" label="Receiver Name" rules={[{ required: true, message: 'Please input receiver name' }]}>
                        <Input placeholder="e.g. Akello Sarah" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="receiverPhone" label="Receiver Phone (Notification)" rules={[{ required: true, message: 'Please input receiver phone' }]}>
                        <Input placeholder="e.g. +256 701 987654" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="route" label="Destination Hub" rules={[{ required: true, message: 'Please select destination' }]}>
                        <Select placeholder="Select station">
                          {state.destinations.map(d => (
                            <Option key={d.id} value={d.id}>{d.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="size" label="Envelope / Carton Size">
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
                    <Col xs={24} sm={12}>
                      <Form.Item name="weight" label="Measured Weight (kg)">
                        <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="description" label="Item Content Details" rules={[{ required: true, message: 'Provide content details' }]}>
                        <Input placeholder="e.g. Academic documents, electronics" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="fragile" valuePropName="checked">
                    <Checkbox>Contains fragile, glass, or electronic components</Checkbox>
                  </Form.Item>

                  <Button type="primary" htmlType="submit" size="large" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} block>
                    Generate Pre-Booking Voucher
                  </Button>
                </Form>
              </Card>
            </Col>

            {/* Voucher preview side */}
            <Col xs={24} lg={10}>
              <Card title="Booking Voucher Receipt" bordered style={{ textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {bookingVoucher ? (
                  <div style={{ textAlign: 'left' }}>
                    <div id="printable-voucher-tag">
                      <div style={{ border: '2px solid #7a0016', padding: 16, borderRadius: 8, background: '#fff' }}>
                        <div style={{ textAlign: 'center', marginBottom: 12 }}>
                          <Title level={4} style={{ color: '#7a0016', margin: 0 }}>YY COURIER SERVICE</Title>
                          <Text type="secondary" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Online Pre-Booking Ticket</Text>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text type="secondary">Voucher ID:</Text>
                          <Text strong style={{ fontFamily: 'monospace', fontSize: '1.05rem' }}>{bookingVoucher.id}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text type="secondary">Destination:</Text>
                          <Text strong>{bookingVoucher.routeTo} Office</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text type="secondary">Sender:</Text>
                          <Text>{bookingVoucher.senderName}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text type="secondary">Receiver:</Text>
                          <Text strong>{bookingVoucher.receiverName} ({bookingVoucher.receiverPhone})</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text type="secondary">Item:</Text>
                          <Text>{bookingVoucher.description} ({bookingVoucher.weightKg} kg)</Text>
                        </div>
                        
                        <div style={{ borderTop: '1px dashed #d9d9d9', margin: '8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text type="secondary">Estimated Tariff:</Text>
                          <Text style={{ fontSize: '1.25rem', color: '#7a0016', fontWeight: 800 }}>{formatUGX(bookingVoucher.priceUGX)}</Text>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                          <QRCode value={bookingVoucher.id} size={110} color="#7a0016" />
                        </div>
                      </div>
                    </div>
                    
                    <Space style={{ width: '100%', marginTop: 16 }}>
                      <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrintVoucher} block>Print Ticket</Button>
                      <Button onClick={() => setBookingVoucher(null)} block>Reset Prebook</Button>
                    </Space>
                  </div>
                ) : (
                  <div style={{ color: '#bfbfbf', padding: 20 }}>
                    <ShoppingCartOutlined style={{ fontSize: '4.5rem', color: '#bfbfbf', marginBottom: 12 }} />
                    <Title level={4} style={{ color: '#8c8c8c', margin: 0 }}>Voucher Preview</Title>
                    <Paragraph type="secondary" style={{ fontSize: '0.85rem', maxWidth: 300, margin: '8px auto 0' }}>
                      Complete the pre-booking form on the left. This generates your drop-off receipt to present at the terminal luggage counters.
                    </Paragraph>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
