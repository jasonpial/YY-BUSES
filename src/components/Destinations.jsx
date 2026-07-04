import React, { useState } from 'react';
import { Card, Table, Row, Col, Typography, Form, Select, InputNumber, Checkbox, Tag, Button } from 'antd';
import { CompassOutlined, DollarCircleOutlined, CalculatorOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { formatUGX, calculateCourierPrice } from '../utils.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Destinations({ state, navigate }) {
  const [form] = Form.useForm();
  const [estimatedPrice, setEstimatedPrice] = useState(15600);

  // Table Columns for Stations
  const stationColumns = [
    {
      title: 'Destination Route',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>Kampala to {text}</Text>,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Passenger Ticket Fare',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      render: (price) => <Text style={{ color: '#1a365d', fontWeight: 700 }}>{formatUGX(price)}</Text>,
    },
    {
      title: 'Courier Base Charge',
      dataIndex: 'courierBase',
      key: 'courierBase',
      render: (price) => formatUGX(price),
    },
    {
      title: 'Courier Per Kg Charge',
      dataIndex: 'courierPerKg',
      key: 'courierPerKg',
      render: (rate) => <Text type="secondary">+{formatUGX(rate)} / kg</Text>,
    },
  ];

  // Table Columns for Departures
  const departureColumns = [
    {
      title: 'Voyage ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text style={{ fontFamily: 'monospace', fontWeight: 700 }}>{id.toUpperCase()}</Text>,
    },
    {
      title: 'Route',
      key: 'route',
      render: (_, record) => <Text>{record.routeFrom} ➔ {record.routeTo}</Text>,
    },
    {
      title: 'Bus Reg No',
      key: 'busRegNo',
      render: (_, record) => {
        const bus = state.buses.find(b => b.id === record.busId);
        return <Tag color="geekblue">{bus ? bus.regNo : 'N/A'}</Tag>;
      },
    },
    {
      title: 'Departure Time',
      dataIndex: 'departureTime',
      key: 'departureTime',
      render: (time) => new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gold';
        if (status === 'Completed') color = 'green';
        else if (status === 'In Transit') color = 'magenta';
        else if (status === 'Cancelled') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ticketing Availability',
      key: 'seats',
      render: (_, record) => {
        const bus = state.buses.find(b => b.id === record.busId);
        const soldSeats = Object.keys(record.tickets).length;
        const remaining = bus ? bus.capacity - soldSeats : 0;
        
        return record.status === 'Scheduled' ? (
          <Text type="success" style={{ fontWeight: 600 }}>{remaining} Seats Available</Text>
        ) : (
          <Text type="secondary">Booking Closed</Text>
        );
      },
    },
  ];

  // Pricing calculator update
  const onValuesChange = (_, allValues) => {
    const route = state.destinations.find(d => d.id === allValues.route);
    if (!route) return;

    const price = calculateCourierPrice(
      allValues.weight || 2.0,
      route.courierBase,
      route.courierPerKg,
      allValues.fragile || false,
      allValues.size || 'medium'
    );
    setEstimatedPrice(price);
  };

  const handlePrebookRedirect = () => {
    const vals = form.getFieldsValue();
    navigate('courier-client', {
      prefill: {
        routeId: vals.route || 'kla',
        weight: vals.weight || 2.0,
        size: vals.size || 'medium',
        isFragile: vals.fragile || false,
      }
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1a365d' }}>🗺️ Public Rates & Departures Directory</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Official rates, package calculator, and daily schedule rosters for YY Buses Uganda</Paragraph>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left: Hub Rates */}
        <Col xs={24} lg={14}>
          <Card 
            title={<Title level={4} style={{ margin: 0, color: '#1a365d' }}><CompassOutlined /> Destination Rates Directory</Title>}
            bordered
          >
            <Table 
              dataSource={state.destinations} 
              columns={stationColumns} 
              rowKey="id" 
              pagination={false} 
              size="middle"
            />
          </Card>
        </Col>

        {/* Right: Calculator */}
        <Col xs={24} lg={10}>
          <Card 
            title={<Title level={4} style={{ margin: 0, color: '#7a0016' }}><CalculatorOutlined /> Parcel Cost Estimator</Title>}
            bordered
            style={{ borderTop: '4px solid #7a0016' }}
          >
            <Form 
              form={form} 
              layout="vertical"
              initialValues={{ route: 'mbl', weight: 2.0, size: 'medium', fragile: false }}
              onValuesChange={onValuesChange}
            >
              <Form.Item name="route" label="Destination (From Kampala)">
                <Select size="large">
                  {state.destinations.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="weight" label="Weight (kg)">
                    <InputNumber size="large" min={0.1} step={0.1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="size" label="Box Volume Size">
                    <Select size="large">
                      <Option value="small">Small (Envelope)</Option>
                      <Option value="medium">Medium (Box/Bag)</Option>
                      <Option value="large">Large (Suitcase)</Option>
                      <Option value="extra-large">Extra Large (Sack)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="fragile" valuePropName="checked" style={{ marginBottom: 12 }}>
                <Checkbox>Package contains electronics or fragile items (+UGX 5,000)</Checkbox>
              </Form.Item>

              <Card 
                style={{ 
                  backgroundColor: 'rgba(122, 0, 22, 0.04)', 
                  border: '1px solid rgba(122, 0, 22, 0.1)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 16px'
                }}
                bodyStyle={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 0 }}
              >
                <div>
                  <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Estimated Tariff</Text>
                  <Title level={2} style={{ margin: 0, color: '#7a0016', fontFamily: 'Outfit' }}>{formatUGX(estimatedPrice)}</Title>
                </div>
                <Button type="primary" size="large" style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }} onClick={handlePrebookRedirect}>
                  Pre-Book Parcel
                </Button>
              </Card>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Active Schedules */}
      <Card 
        title={<Title level={4} style={{ margin: 0, color: '#1a365d' }}><CalendarOutlined /> Daily Roster Schedules (Today)</Title>}
        bordered
        style={{ marginTop: 24 }}
      >
        <Table 
          dataSource={state.journeys} 
          columns={departureColumns} 
          rowKey="id" 
          pagination={false} 
          size="middle"
        />
      </Card>
    </div>
  );
}
