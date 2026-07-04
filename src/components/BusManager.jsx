import React from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Tag, Typography, Space, Button } from 'antd';
import { DollarCircleOutlined, CarOutlined, AlertOutlined, SafetyCertificateOutlined, RiseOutlined } from '@ant-design/icons';
import { formatUGX, formatDate } from '../utils.js';

const { Title, Text, Paragraph } = Typography;

export default function BusManager({ state, navigate, updateState }) {
  // Compute analytics
  let totalTicketRevenue = 0;
  let totalCargoRevenue = 0;
  let totalExpenses = 0;
  let completedTripsCount = 0;
  let totalSeatsSoldOnCompleted = 0;
  let totalCapacityOnCompleted = 0;

  state.journeys.forEach(j => {
    // Ticket revenue
    const tktSum = Object.values(j.tickets).reduce((sum, t) => sum + t.amountPaid, 0);
    totalTicketRevenue += tktSum;

    // Cargo revenue
    const cargoSum = j.cargo.reduce((sum, c) => sum + c.chargeUGX, 0);
    totalCargoRevenue += cargoSum;

    // Expenses
    const expSum = j.expenses.reduce((sum, e) => sum + e.amount, 0);
    totalExpenses += expSum;

    // Completed efficiency indicators
    if (j.status === 'Completed') {
      completedTripsCount++;
      const bus = state.buses.find(b => b.id === j.busId);
      totalSeatsSoldOnCompleted += Object.keys(j.tickets).length;
      totalCapacityOnCompleted += bus ? bus.capacity : 67;
    }
  });

  const totalGrossRevenue = totalTicketRevenue + totalCargoRevenue;
  const netProfit = totalGrossRevenue - totalExpenses;
  const seatingEfficiency = totalCapacityOnCompleted > 0 
    ? (totalSeatsSoldOnCompleted / totalCapacityOnCompleted) * 100 
    : 84.8; // default fallback

  // Find active journey to draw on the visual timeline map
  const activeJourney = state.journeys.find(j => j.status === 'In Transit');

  // Table Columns for Dispatch list
  const dispatchColumns = [
    { title: 'Voyage ID', dataIndex: 'id', key: 'id', render: (text) => <Text style={{ fontFamily: 'monospace', fontWeight: 700 }}>{text.toUpperCase()}</Text> },
    { title: 'Route Corridor', key: 'route', render: (_, r) => <Text>{r.routeFrom} ➔ {r.routeTo}</Text> },
    { 
      title: 'Fleet Bus Info', 
      key: 'bus', 
      render: (_, r) => {
        const bus = state.buses.find(b => b.id === r.busId);
        return (
          <div>
            <strong>{bus ? bus.regNo : 'N/A'}</strong>
            <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>{bus ? bus.model : 'N/A'}</div>
          </div>
        );
      } 
    },
    { 
      title: 'Voyage Crew', 
      key: 'crew', 
      render: (_, r) => {
        const drv = state.staff.drivers.find(d => d.id === r.driverId);
        const cond = state.staff.conductors.find(c => c.id === r.conductorId);
        return (
          <div style={{ fontSize: '0.8rem' }}>
            <div>👨‍✈️ Driver: {drv ? drv.name.split(' ')[0] : 'N/A'}</div>
            <div>📋 Conductor: {cond ? cond.name.split(' ')[0] : 'N/A'}</div>
          </div>
        );
      } 
    },
    { title: 'Departure Date', dataIndex: 'departureTime', key: 'departureTime', render: (t) => formatDate(t) },
    { 
      title: 'Undercarriage Cargo', 
      key: 'cargo', 
      render: (_, r) => <Text>{r.cargo.length} items (${r.cargo.reduce((sum,c)=>sum+c.weightKg, 0)} kg)</Text> 
    },
    { 
      title: 'Finances Summary', 
      key: 'finances', 
      render: (_, r) => {
        const tRev = Object.values(r.tickets).reduce((sum,t)=>sum+t.amountPaid, 0) + r.cargo.reduce((sum,c)=>sum+c.chargeUGX, 0);
        const tExp = r.expenses.reduce((sum,e)=>sum+e.amount, 0);
        return (
          <div style={{ fontSize: '0.8rem' }}>
            <div style={{ color: '#52c41a' }}>Rev: {formatUGX(tRev)}</div>
            <div style={{ color: '#ff4d4f' }}>Exp: -{formatUGX(tExp)}</div>
            <strong style={{ display: 'block', marginTop: 2 }}>Profit: {formatUGX(tRev - tExp)}</strong>
          </div>
        );
      } 
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
      }
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ color: '#1a365d', margin: 0 }}>📊 Operations Manager Panel</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>Unified metrics monitoring, active GPS highway corridors tracking, and roster charts</Paragraph>
        </div>
        <Button onClick={() => navigate('portal')}>Home Portal</Button>
      </div>

      {/* Financial Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #1a365d' }}>
            <Statistic 
              title="Total Roster Revenues" 
              value={totalGrossRevenue} 
              prefix={<DollarCircleOutlined style={{ color: '#1a365d' }} />}
              formatter={(v) => formatUGX(v)}
              valueStyle={{ color: '#1a365d', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #ff4d4f' }}>
            <Statistic 
              title="Operational Expenditures" 
              value={totalExpenses} 
              prefix={<Text style={{ color: '#ff4d4f', fontSize: '1.25rem' }}>⛽</Text>}
              formatter={(v) => `-${formatUGX(v)}`}
              valueStyle={{ color: '#ff4d4f', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #52c41a' }}>
            <Statistic 
              title="Net Operating Margin" 
              value={netProfit} 
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              formatter={(v) => formatUGX(v)}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderTop: '4px solid #13c2c2' }}>
            <Statistic 
              title="Seating Load Efficiency" 
              value={seatingEfficiency} 
              prefix={<SafetyCertificateOutlined style={{ color: '#13c2c2' }} />}
              suffix="%"
              valueStyle={{ color: '#13c2c2', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Apportionment Progress Cards */}
      <Card title="Revenue vs Expense Apportionment Ledger" bordered style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <Text strong>Ticket Sales Contribution: </Text>
          <Text>{formatUGX(totalTicketRevenue)} ({((totalTicketRevenue / (totalGrossRevenue || 1)) * 100).toFixed(1)}%)</Text>
        </div>
        <Progress 
          percent={100}
          success={{
            percent: parseFloat(((totalTicketRevenue / (totalGrossRevenue || 1)) * 100).toFixed(1)),
            strokeColor: '#1a365d' // Tickets portion
          }}
          strokeColor="#7a0016" // Cargo portion
          showInfo={false}
          style={{ height: 20 }}
        />
        <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem', marginTop: 12 }}>
          <div><span style={{ display:'inline-block', width:12, height:12, background:'#1a365d', marginRight:6, borderRadius:3, verticalAlign:'middle' }} />Passenger ticket fares</div>
          <div><span style={{ display:'inline-block', width:12, height:12, background:'#7a0016', marginRight:6, borderRadius:3, verticalAlign:'middle' }} />Luggage Undercarriage cargo</div>
          <div><span style={{ display:'inline-block', width:12, height:12, background:'#ff4d4f', marginRight:6, borderRadius:3, verticalAlign:'middle' }} />Disbursed conductor expenses ({((totalExpenses / (totalGrossRevenue || 1)) * 100).toFixed(1)}% of gross)</div>
        </div>
      </Card>

      {/* GPS Corridor tracking monitor */}
      <Card title={<Title level={4} style={{ margin: 0, color: '#1a365d' }}><CarOutlined /> Live GPS highway tracking corridor</Title>} bordered style={{ marginBottom: 24 }}>
        <Paragraph type="secondary">Real-time highway stop timeline position simulation sync with conductors updates:</Paragraph>
        
        <div className="timeline-map-container">
          {activeJourney ? (
            <div className="uganda-map-grid">
              <div style={{ fontWeight: 700, color: '#1a365d', marginBottom: 12, textAlign: 'center' }}>
                Active Voyage: Voyage #{activeJourney.id.toUpperCase()} (Kampala to {activeJourney.routeTo})
              </div>
              
              <div className="map-corridor-row">
                <div className="map-corridor-line"></div>
                <div className="map-corridor-line-progress" style={{ width: `${activeJourney.progress}%` }}></div>
                
                <div className="map-station-node active-passed">
                  KLA
                  <span className="station-label">Kampala</span>
                </div>
                <div className="map-station-node active-passed">
                  JJA
                  <span className="station-label">Jinja</span>
                </div>
                <div className="map-station-node active-passed">
                  IGA
                  <span className="station-label">Iganga</span>
                </div>
                <div className="map-station-node active-current">
                  MBL
                  <span className="station-label">Mbale final</span>
                </div>

                <div className="bus-pulsing-avatar" style={{ left: `calc(${activeJourney.progress}% - 35px)` }}>
                  🚌 {state.buses.find(b => b.id === activeJourney.busId)?.regNo || 'BUS'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:10, color:'#bfbfbf' }}>
              <AlertOutlined style={{ fontSize: '3.5rem' }} />
              <strong>No dispatched bus fleet is currently in transit on Uganda highway corridors.</strong>
              <Text type="secondary" style={{ fontSize: '0.8rem' }}>Monitor GPS coordinates after dispatching schedules in handlers ticket deck.</Text>
            </div>
          )}
        </div>
      </Card>

      {/* Active Voyage Dispatches */}
      <Card title="Roster Dispatch Logs Ledger" bordered style={{ marginBottom: 24 }}>
        <Table 
          dataSource={state.journeys}
          columns={dispatchColumns}
          rowKey="id"
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Row gutter={[24, 24]}>
        {/* Fleet status */}
        <Col xs={24} md={12}>
          <Card title="Fleet Vehicle Status Registry" bordered>
            <Table 
              dataSource={state.buses}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
              columns={[
                { title: 'Fleet Reg No', dataIndex: 'regNo', key: 'regNo', render: (t) => <Text strong>{t}</Text> },
                { title: 'Fleet Model', dataIndex: 'model', key: 'model' },
                { 
                  title: 'Fleet Status', 
                  dataIndex: 'status', 
                  key: 'status', 
                  render: (status) => <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag> 
                }
              ]}
            />
          </Card>
        </Col>

        {/* Crew Status */}
        <Col xs={24} md={12}>
          <Card title="Driver & Conductor availability status" bordered>
            <Table 
              dataSource={[
                ...state.staff.drivers.map(d => ({ ...d, role: 'Driver' })),
                ...state.staff.conductors.map(c => ({ ...c, role: 'Conductor' }))
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              scroll={{ x: 'max-content' }}
              columns={[
                { title: 'Crew Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                { title: 'Roster Role', dataIndex: 'role', key: 'role', render: (role) => <Tag color={role === 'Driver' ? 'blue' : 'purple'}>{role}</Tag> },
                { 
                  title: 'Duty Status', 
                  dataIndex: 'status', 
                  key: 'status', 
                  render: (status) => <Tag color={status === 'Available' ? 'green' : 'red'}>{status}</Tag> 
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
