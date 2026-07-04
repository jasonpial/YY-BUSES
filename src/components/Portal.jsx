import React from 'react';
import { Card, Row, Col, Statistic, Button, Divider, Typography } from 'antd';
import { 
  CarOutlined, 
  ShoppingOutlined, 
  SendOutlined, 
  DashboardOutlined, 
  FileSearchOutlined, 
  InfoCircleOutlined,
  ArrowRightOutlined,
  ProfileOutlined,
  CompassOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function Portal({ state, navigate }) {
  // Stats calculations
  const activeJourneys = state.journeys.filter(j => j.status === 'In Transit').length;
  const packagesIntake = state.parcels.filter(p => p.status === 'Intake').length;
  const packagesInTransit = state.parcels.filter(p => p.status === 'Dispatched').length;
  const scheduledToday = state.journeys.filter(j => j.status === 'Scheduled').length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 0' }}>
      {/* Welcome Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={1} style={{ margin: 0, color: '#7a0016', fontSize: '3rem', fontFamily: 'Outfit', fontWeight: 800 }}>
          YY BUSES UGANDA
        </Title>
        <Paragraph style={{ fontSize: '1.2rem', color: '#595959', maxWidth: 650, margin: '8px auto 0' }}>
          Integrated Fleet Management & Parcel Courier Logistics. Choose your operations desk below to begin.
        </Paragraph>
      </div>

      {/* Quick Metrics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable bordered style={{ borderLeft: '4px solid #1a365d' }}>
            <Statistic 
              title="Active Journeys" 
              value={activeJourneys} 
              prefix={<CarOutlined style={{ color: '#1a365d' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
            <Text type="secondary" size="small">🟢 Live highway runs</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable bordered style={{ borderLeft: '4px solid #7a0016' }}>
            <Statistic 
              title="Awaiting Dispatch" 
              value={packagesIntake} 
              prefix={<ShoppingOutlined style={{ color: '#7a0016' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
            <Text type="secondary" size="small">📦 Warehouse inventory</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable bordered style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic 
              title="Parcels En Route" 
              value={packagesInTransit} 
              prefix={<SendOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
            <Text type="secondary" size="small">🚚 Highway transit</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable bordered style={{ borderLeft: '4px solid #13c2c2' }}>
            <Statistic 
              title="Scheduled Today" 
              value={scheduledToday} 
              prefix={<DashboardOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
            <Text type="secondary" size="small">📅 Roster departures</Text>
          </Card>
        </Col>
      </Row>

      {/* Primary System Modules */}
      <Row gutter={[24, 24]}>
        {/* Passenger Transportation Operations */}
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={3} style={{ margin: 0, color: '#1a365d', display: 'flex', alignItems: 'center', gap: 10 }}>🚌 Bus Transport Section</Title>}
            hoverable
            style={{ height: '100%', borderTop: '5px solid #1a365d' }}
          >
            <Paragraph style={{ minHeight: 48, color: '#595959' }}>
              Roster daily bus departures, sell tickets on interactive seating layouts, register undercarriage baggage, and record mid-journey expenditures.
            </Paragraph>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button 
                type="primary" 
                icon={<CarOutlined />} 
                block 
                size="large"
                style={{ backgroundColor: '#1a365d', borderColor: '#1a365d' }}
                onClick={() => navigate('bus-handler')}
              >
                Ticketing & Dispatch (Handler)
              </Button>
              <Button 
                block 
                size="large"
                icon={<ProfileOutlined />}
                onClick={() => navigate('bus-conductor')}
              >
                Journey Logs & Expenses (Conductor)
              </Button>
              <Button 
                block 
                size="large"
                icon={<DashboardOutlined />}
                onClick={() => navigate('bus-manager')}
              >
                Fleet Analytics & Live Map (Manager)
              </Button>
            </div>
          </Card>
        </Col>

        {/* Courier & Parcel Services */}
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={3} style={{ margin: 0, color: '#7a0016', display: 'flex', alignItems: 'center', gap: 10 }}>📦 Courier & Parcel Section</Title>}
            hoverable
            style={{ height: '100%', borderTop: '5px solid #7a0016' }}
          >
            <Paragraph style={{ minHeight: 48, color: '#595959' }}>
              Estimate shipping costs, intake new items with barcode tracking tags, dispatch packages on departing buses, and coordinate regional collections.
            </Paragraph>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button 
                type="primary" 
                icon={<FileSearchOutlined />} 
                block 
                size="large"
                style={{ backgroundColor: '#7a0016', borderColor: '#7a0016' }}
                onClick={() => navigate('courier-client')}
              >
                Track & Pre-Book Parcel (Client)
              </Button>
              <Button 
                block 
                size="large"
                icon={<ShoppingOutlined />}
                onClick={() => navigate('courier-handler')}
              >
                Parcel Intake & Dispatch (Handler)
              </Button>
              <Button 
                block 
                size="large"
                icon={<DashboardOutlined />}
                onClick={() => navigate('courier-admin')}
              >
                Pricing & Ledger Auditing (Admin)
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Public Schedule Directory Link */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Button 
          type="dashed" 
          size="large" 
          icon={<CompassOutlined />}
          onClick={() => navigate('destinations')}
        >
          View Public Destinations, Fares & Price Calculators <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );
}
