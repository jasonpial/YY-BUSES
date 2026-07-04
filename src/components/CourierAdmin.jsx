import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Input, Select, Progress, Typography, Space, Tag } from 'antd';
import { DollarCircleOutlined, ShoppingOutlined, FieldTimeOutlined, CarryOutOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { formatUGX, formatDate } from '../utils.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function CourierAdmin({ state, navigate, updateState }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRoute, setFilterRoute] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  // Tariff local edits
  const [tariffs, setTariffs] = useState(() => {
    const map = {};
    state.destinations.forEach(d => {
      map[d.id] = { base: d.courierBase, perKg: d.courierPerKg };
    });
    return map;
  });

  const handleTariffChange = (id, field, val) => {
    setTariffs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: parseInt(val) || 0
      }
    }));
  };

  const handleSaveTariff = (id) => {
    updateState((currentState) => {
      const dest = currentState.destinations.find(d => d.id === id);
      if (dest) {
        dest.courierBase = tariffs[id].base;
        dest.courierPerKg = tariffs[id].perKg;
      }
      return currentState;
    });
    alert("Courier pricing parameters updated successfully!");
  };

  // Calculations for analytics
  const totalParcels = state.parcels.length;
  const activeLogistics = state.parcels.filter(p => p.status === 'Intake' || p.status === 'Dispatched' || p.status === 'Arrived').length;
  const completedLogistics = state.parcels.filter(p => p.status === 'Collected').length;
  
  const courierRevenue = state.parcels
    .filter(p => p.status !== 'Draft')
    .reduce((sum, p) => sum + p.priceUGX, 0);

  // Group metrics by route
  const routeStats = {};
  state.destinations.forEach(d => {
    routeStats[d.name] = { count: 0, revenue: 0 };
  });

  state.parcels.forEach(p => {
    if (p.status !== 'Draft' && routeStats[p.routeTo]) {
      routeStats[p.routeTo].count++;
      routeStats[p.routeTo].revenue += p.priceUGX;
    }
  });

  // Filtered parcels ledger source
  const ledgerSource = state.parcels.filter(p => {
    const statusMatch = filterStatus === 'ALL' || p.status === filterStatus;
    const routeMatch = filterRoute === 'ALL' || p.routeTo === filterRoute;
    const searchMatch = !searchText || 
      p.id.toLowerCase().includes(searchText.toLowerCase()) ||
      p.senderName.toLowerCase().includes(searchText.toLowerCase()) ||
      p.receiverName.toLowerCase().includes(searchText.toLowerCase());

    return statusMatch && routeMatch && searchMatch;
  });

  const ledgerColumns = [
    { title: 'Tracking ID', dataIndex: 'id', key: 'id', render: (t) => <Text style={{ fontFamily: 'monospace', fontWeight: 700 }}>{t}</Text> },
    { title: 'Route Station', key: 'route', render: (_, r) => <Text>Kampala ➔ {r.routeTo}</Text> },
    { title: 'Sender', dataIndex: 'senderName', key: 'senderName' },
    { title: 'Receiver', dataIndex: 'receiverName', key: 'receiverName' },
    { title: 'Description', key: 'desc', render: (_, r) => <Text type="secondary" style={{ fontSize: '0.8rem' }}>{r.description} ({r.weightKg} kg)</Text> },
    { title: 'Fare Cost', dataIndex: 'priceUGX', key: 'priceUGX', render: (price) => <Text style={{ color: '#7a0016', fontWeight: 700 }}>{formatUGX(price)}</Text> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => {
        let color = 'gold';
        if (status === 'Collected') color = 'green';
        else if (status === 'Arrived') color = 'cyan';
        else if (status === 'Dispatched') color = 'magenta';
        else if (status === 'Draft') color = 'gray';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Date Logged', dataIndex: 'createdDate', key: 'createdDate', render: (t) => formatDate(t) }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ color: '#7a0016', margin: 0 }}>📊 Courier Operations Admin</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Financial growth performance logs, route tariffs config, and package tracking ledger audit</Paragraph>
        </div>
        <Button onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      {/* Financial Widgets */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #7a0016' }}>
            <Statistic 
              title="Gross Parcel Revenue" 
              value={courierRevenue} 
              prefix={<DollarCircleOutlined style={{ color: '#7a0016' }} />}
              formatter={(value) => formatUGX(value)}
              valueStyle={{ color: '#7a0016', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #1a365d' }}>
            <Statistic 
              title="Total Shipments Logged" 
              value={totalParcels} 
              prefix={<ShoppingOutlined style={{ color: '#1a365d' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #13c2c2' }}>
            <Statistic 
              title="Active Cargo Transit" 
              value={activeLogistics} 
              prefix={<FieldTimeOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #52c41a' }}>
            <Statistic 
              title="Delivered Handouts" 
              value={completedLogistics} 
              prefix={<CarryOutOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Left: Tariff Rules Modifier */}
        <Col xs={24} lg={12}>
          <Card title={<Title level={4} style={{ margin: 0, color: '#1a365d' }}><EditOutlined /> Route Tariffs Configuration</Title>} bordered>
            <Table 
              dataSource={state.destinations}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
              columns={[
                { title: 'Route Hub', dataIndex: 'name', key: 'name', render: (t) => <Text strong>Kampala to {t}</Text> },
                { 
                  title: 'Base Charge (UGX)', 
                  key: 'base', 
                  render: (_, r) => (
                    <Input 
                      type="number" 
                      value={tariffs[r.id]?.base} 
                      onChange={(e) => handleTariffChange(r.id, 'base', e.target.value)} 
                      style={{ width: 100 }} 
                    />
                  )
                },
                { 
                  title: 'Per Kg Fee (UGX)', 
                  key: 'perKg', 
                  render: (_, r) => (
                    <Input 
                      type="number" 
                      value={tariffs[r.id]?.perKg} 
                      onChange={(e) => handleTariffChange(r.id, 'perKg', e.target.value)} 
                      style={{ width: 80 }} 
                    />
                  )
                },
                { 
                  title: 'Save', 
                  key: 'action', 
                  render: (_, r) => (
                    <Button type="primary" size="small" style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }} onClick={() => handleSaveTariff(r.id)}>
                      Save
                    </Button>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* Right: Performance Chart */}
        <Col xs={24} lg={12}>
          <Card title="Regional Hub Volume Distribution" bordered>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(routeStats).map(([routeName, metrics]) => {
                const percentage = courierRevenue > 0 ? (metrics.revenue / courierRevenue) * 100 : 0;
                return (
                  <div key={routeName}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                      <Text strong>Kampala ➔ {routeName}</Text>
                      <Text type="secondary">{metrics.count} packages ({formatUGX(metrics.revenue)})</Text>
                    </div>
                    <Progress 
                      percent={parseFloat(percentage.toFixed(1))} 
                      strokeColor={{
                        '0%': '#1a365d',
                        '100%': '#7a0016',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Complete Auditing Ledger */}
      <Card title={<Title level={4} style={{ margin: 0, color: '#7a0016' }}><SearchOutlined /> Complete Cargo Ledgers Audit</Title>} bordered>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <Input 
            placeholder="Search Parcel ID, Sender, Receiver..." 
            style={{ width: 280 }} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Select value={filterStatus} onChange={(val) => setFilterStatus(val)} style={{ width: 160 }}>
            <Option value="ALL">All Statuses</Option>
            <Option value="Intake">Intake</Option>
            <Option value="Dispatched">Dispatched</Option>
            <Option value="Arrived">Arrived</Option>
            <Option value="Collected">Collected</Option>
            <Option value="Draft">Draft Prebookings</Option>
          </Select>
          <Select value={filterRoute} onChange={(val) => setFilterRoute(val)} style={{ width: 180 }}>
            <Option value="ALL">All Destinations</Option>
            {state.destinations.map(d => (
              <Option key={d.name} value={d.name}>{d.name}</Option>
            ))}
          </Select>
          <Button onClick={() => {
            setFilterStatus('ALL');
            setFilterRoute('ALL');
            setSearchText('');
          }}>
            Reset Filters
          </Button>
        </div>

        <Table 
          dataSource={ledgerSource}
          columns={ledgerColumns}
          rowKey="id"
          size="middle"
          locale={{ emptyText: 'No transactions found matching the filter criteria.' }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
