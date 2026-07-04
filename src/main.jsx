import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Layout, Menu, Button, Switch, theme, ConfigProvider, Tag, Avatar } from 'antd';
import { 
  HomeOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  DashboardOutlined,
  CompassOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { getState, saveState } from './mockData.js';

// Components imports
import Portal from './components/Portal.jsx';
import Destinations from './components/Destinations.jsx';
import CourierClient from './components/CourierClient.jsx';
import CourierHandler from './components/CourierHandler.jsx';
import CourierAdmin from './components/CourierAdmin.jsx';
import BusHandler from './components/BusHandler.jsx';
import BusConductor from './components/BusConductor.jsx';
import BusManager from './components/BusManager.jsx';

const { Header, Content, Sider } = Layout;

function App() {
  // State
  const [state, setState] = useState(() => getState());
  const [currentView, setCurrentView] = useState('portal');
  const [navParams, setNavParams] = useState({});
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('yy_theme_dark') === 'true');
  const [collapsed, setCollapsed] = useState(false);

  // Sync dark theme class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('yy_theme_dark', 'true');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('yy_theme_dark', 'false');
    }
  }, [darkMode]);

  // Unified State Modifier Hook
  const updateState = (updaterFn) => {
    setState((prev) => {
      const next = updaterFn({ ...prev });
      saveState(next);
      return next;
    });
  };

  // Navigator helper
  const navigate = (viewName, params = {}) => {
    setCurrentView(viewName);
    setNavParams(params);
  };

  // Sidebar link maps
  const sidebarConfigs = {
    'bus-handler': {
      title: 'Bus Desk (Handler)',
      activeKey: 'bus-handler',
      items: [
        { key: 'bus-handler', icon: <CarOutlined />, label: '🎟️ Booking & Roster' },
        { key: 'bus-manager', icon: <DashboardOutlined />, label: '📊 Fleet Analytics' },
        { key: 'destinations', icon: <EnvironmentOutlined />, label: '🗺️ Public Rates' }
      ]
    },
    'bus-conductor': {
      title: 'Voyage Log (Conductor)',
      activeKey: 'bus-conductor',
      items: [
        { key: 'bus-conductor', icon: <ProfileOutlined />, label: '📱 Mobile Desk' },
        { key: 'destinations', icon: <EnvironmentOutlined />, label: '🗺️ Public Rates' }
      ]
    },
    'bus-manager': {
      title: 'Operations (Manager)',
      activeKey: 'bus-manager',
      items: [
        { key: 'bus-manager', icon: <DashboardOutlined />, label: '📊 Fleet Analytics' },
        { key: 'bus-handler', icon: <CarOutlined />, label: '🎟️ Dispatch Board' },
        { key: 'destinations', icon: <EnvironmentOutlined />, label: '🗺️ Public Rates' }
      ]
    },
    'courier-client': {
      title: 'YY Courier Client',
      activeKey: 'courier-client',
      items: [
        { key: 'courier-client', icon: <ShoppingOutlined />, label: '🔍 Track & Pre-Book' },
        { key: 'destinations', icon: <EnvironmentOutlined />, label: '🗺️ Pricing Directory' }
      ]
    },
    'courier-handler': {
      title: 'Parcel desk (Handler)',
      activeKey: 'courier-handler',
      items: [
        { key: 'courier-handler', icon: <ShoppingOutlined />, label: '📥 Intake & Dispatch' },
        { key: 'courier-admin', icon: <DashboardOutlined />, label: '📊 Audit Records' },
        { key: 'destinations', icon: <EnvironmentOutlined />, label: '🗺️ Price Sheet' }
      ]
    },
    'courier-admin': {
      title: 'Logistics (Admin)',
      activeKey: 'courier-admin',
      items: [
        { key: 'courier-admin', icon: <DashboardOutlined />, label: '📊 Rates & Auditing' },
        { key: 'courier-handler', icon: <ShoppingOutlined />, label: '📥 Counter Intake' },
        { key: 'destinations', icon: <EnvironmentOutlined />, label: '🗺️ Price Sheet' }
      ]
    }
  };

  const sidebarConf = sidebarConfigs[currentView];
  const hasSidebar = sidebarConf !== undefined;

  // Custom Theme Config Settings
  const themeAlgorithm = darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#7a0016',     // Corporate Maroon
          colorInfo: '#1a365d',        // Navy Blue
          colorLink: '#1a365d',
          borderRadius: 8,
          fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
        },
        algorithm: themeAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {/* Main Top Header */}
        <Header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: darkMode ? '#1f1f1f' : '#1a365d', 
          borderBottom: `1px solid ${darkMode ? '#303030' : '#234b82'}`,
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('portal')}>
            <Avatar style={{ backgroundColor: '#7a0016', color: '#fff', border: '1px solid #fff', fontWeight: 800 }}>YY</Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit' }}>YY BUSES</span>
              <span style={{ color: '#8c8c8c', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>UGANDA LOGISTICS</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {currentView !== 'portal' && (
              <>
                <Tag color="#7a0016" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  ⚡ {currentView.replace('-', ' ')}
                </Tag>
                <Button 
                  type="text" 
                  icon={<HomeOutlined />} 
                  style={{ color: '#fff' }} 
                  onClick={() => navigate('portal')}
                >
                  Exit Desk
                </Button>
              </>
            )}
            <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>☀️</span>
              <Switch checked={darkMode} onChange={(checked) => setDarkMode(checked)} size="small" />
              <span>🌙</span>
            </div>
          </div>
        </Header>

        <Layout>
          {/* Dynamic Sider */}
          {hasSidebar && (
            <Sider 
              collapsible 
              collapsed={collapsed} 
              onCollapse={(value) => setCollapsed(value)}
              theme={darkMode ? 'dark' : 'light'}
              style={{
                borderRight: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`
              }}
            >
              <div style={{ padding: 16, textAlign: 'center', borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}` }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: darkMode ? '#d9d9d9' : '#595959', display: 'block' }}>
                  {collapsed ? '📋' : sidebarConf.title}
                </span>
              </div>
              <Menu
                mode="inline"
                selectedKeys={[sidebarConf.activeKey]}
                style={{ height: '100%', borderRight: 0 }}
                items={sidebarConf.items}
                onClick={({ key }) => navigate(key)}
              />
            </Sider>
          )}

          {/* Workspace View Content */}
          <Content style={{ padding: 24, margin: 0, overflowY: 'auto' }}>
            {currentView === 'portal' && <Portal state={state} navigate={navigate} />}
            {currentView === 'destinations' && <Destinations state={state} navigate={navigate} />}
            {currentView === 'courier-client' && <CourierClient state={state} navigate={navigate} updateState={updateState} params={navParams} />}
            {currentView === 'courier-handler' && <CourierHandler state={state} navigate={navigate} updateState={updateState} />}
            {currentView === 'courier-admin' && <CourierAdmin state={state} navigate={navigate} updateState={updateState} />}
            {currentView === 'bus-handler' && <BusHandler state={state} navigate={navigate} updateState={updateState} />}
            {currentView === 'bus-conductor' && <BusConductor state={state} navigate={navigate} updateState={updateState} />}
            {currentView === 'bus-manager' && <BusManager state={state} navigate={navigate} updateState={updateState} />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
