import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Modal, message, Badge, Tooltip, Card, Layout, Typography, Space, Row, Col, Divider, Empty } from 'antd';
import { 
  PlusOutlined, 
  MinusOutlined, 
  UndoOutlined, 
  RedoOutlined, 
  DeleteOutlined, 
  LogoutOutlined,
  HistoryOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ActiveUsersSidebar from './ActiveUsersSidebar';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import CounterPersonality from './CounterPersonality';
import { getClickReaction } from '../utils/counterPersonality';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Counter = () => {
  const [count, setCount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [customButtons, setCustomButtons] = useState([]);
  const [counterId, setCounterId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Fetch counter data on component mount
  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/counters', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch counter data');
        }
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const counter = data.data[0]; // Get the first counter
          setCounterId(counter._id);
          setCount(counter.currentCount || 0);
          setHistory(counter.history || []);
          setCurrentStep(counter.history ? counter.history.length - 1 : -1);
          setCustomButtons(counter.customButtons || []);
        } else {
          // Create a new counter if none exists
          const createResponse = await fetch('http://localhost:5000/api/counters', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              name: 'My Counter'
            })
          });
          
          if (!createResponse.ok) {
            throw new Error('Failed to create counter');
          }
          
          const newCounter = await createResponse.json();
          setCounterId(newCounter.data._id);
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('Failed to load counter');
      }
    };

    if (user?.token) {
      fetchCounter();
    }
  }, [user?.token]);

  const updateCounterValue = async (amount, operationType) => {
    if (!counterId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/counters/${counterId}/value`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          amount,
          operationType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update counter');
      }

      const data = await response.json();
      setCount(data.data.currentCount);
      setHistory(data.data.history);
      setCurrentStep(data.data.history.length - 1);
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update counter');
    }
  };

  const handleIncrement = useCallback(async (amount = 1) => {
    await updateCounterValue(amount, 'increment');
    message.success(getClickReaction(amount));
  }, [counterId, user?.token]);

  const handleDecrement = useCallback(async (amount = 1) => {
    await updateCounterValue(-amount, 'decrement');
    message.success(getClickReaction(-amount));
  }, [counterId, user?.token]);

  const handleCustomAmount = useCallback(async () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount)) {
      message.error('Please enter a valid number');
      return;
    }
    await updateCounterValue(amount, 'custom');
    setCustomAmount('');
  }, [customAmount, counterId, user?.token]);

  const handleUndo = useCallback(async () => {
    if (currentStep > 0) {
      const prevStep = history[currentStep - 1];
      setCount(prevStep.newValue);
      setCurrentStep(currentStep - 1);
      // We could also implement this on the backend if needed
    }
  }, [currentStep, history]);

  const handleRedo = useCallback(async () => {
    if (currentStep < history.length - 1) {
      const nextStep = history[currentStep + 1];
      setCount(nextStep.newValue);
      setCurrentStep(currentStep + 1);
      // We could also implement this on the backend if needed
    }
  }, [currentStep, history]);

  const handleAddCustomButton = useCallback(async () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount === 0) {
      message.error('Please enter a valid non-zero number');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/counters/${counterId}/buttons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          amount,
          name: `${amount >= 0 ? '+' : ''}${amount}`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add custom button');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setCustomButtons(prevButtons => [...prevButtons, data.data.customButtons[data.data.customButtons.length - 1]]);
        setCustomAmount('');
        message.success('Custom button added successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Add button error:', error);
      message.error(error.message || 'Failed to add custom button');
    }
  }, [counterId, customAmount, user.token]);

  const handleDeleteCustomButton = useCallback(async (buttonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/counters/${counterId}/buttons/${buttonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove button');
      }

      // Update the custom buttons state
      setCustomButtons(prevButtons => prevButtons.filter(btn => btn._id !== buttonId));
      message.success('Button removed successfully');
    } catch (error) {
      console.error('Delete button error:', error);
      message.error(error.message || 'Failed to remove button');
    }
  }, [counterId, user.token]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/counters/${counterId}/reset`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset history');
      }

      setCount(0);
      setHistory([]);
      setCurrentStep(-1);
      setShowHistory(false);
      message.success('History has been reset successfully');
    } catch (error) {
      console.error('Reset error:', error);
      message.error(error.message || 'Failed to reset history');
    }
  };

  const confirmReset = () => {
    Modal.confirm({
      title: 'Reset History',
      content: 'Are you sure you want to reset all history? This will set the counter to 0 and cannot be undone.',
      okText: 'Yes, Reset',
      cancelText: 'No, Keep',
      okButtonProps: {
        danger: true
      },
      onOk: handleResetHistory
    });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: theme.background }}>
      <ActiveUsersSidebar />
      <Layout style={{ background: theme.background }}>
        <Header 
          style={{ 
            background: theme.headerBg,
            borderBottom: `1px solid ${theme.border}`,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Space>
            <Title level={3} style={{ margin: 0, color: theme.primary }}>
              🚀 CountMaster
            </Title>
            <Divider type="vertical" style={{ height: '30px', margin: '0 16px' }} />
            <Text style={{ fontSize: '16px', color: theme.foreground }}>
              Welcome, <Text strong style={{ color: theme.primary }}>{user?.username || 'User'}</Text>!
            </Text>
          </Space>

          <Space size="middle">
            <ThemeSwitcher />
            <Badge 
              dot={history.length > 0}
              offset={[-2, 2]}
              status="processing"
            >
              <Button 
                type="default"
                icon={<HistoryOutlined />}
                onClick={() => setShowHistory(true)}
                size="large"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  borderRadius: '6px',
                  background: theme.background,
                  borderColor: theme.primary,
                  color: theme.primary
                }}
              >
                History {history.length > 0 && `(${history.length})`}
              </Button>
            </Badge>
            <Button 
              type="primary" 
              danger
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              size="large"
            >
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: '24px', background: theme.background }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3} style={{ margin: 0, color: theme.primary }}>
                🚀 CountMaster
              </Title>
              <Divider type="vertical" style={{ height: '30px', margin: '0 16px' }} />
              <Text style={{ fontSize: '16px', color: theme.foreground }}>
                Welcome, <Text strong style={{ color: theme.primary }}>{user?.username || 'User'}</Text>!
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card style={{ background: theme.card, borderColor: theme.border }}>
                  <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} md={16} lg={12}>
                      <Card 
                        className="text-center" 
                        bordered={false}
                        style={{ 
                          background: theme.card,
                          borderRadius: '8px',
                          marginBottom: '24px'
                        }}
                      >
                        <Title style={{ fontSize: '64px', margin: 0, color: theme.primary }}>{count}</Title>
                        <Text type="secondary" style={{ color: theme.foreground }}>Current Count</Text>
                      </Card>

                      <Space size="middle" style={{ marginBottom: '24px', width: '100%', justifyContent: 'center' }}>
                        <Button 
                          type="primary" 
                          icon={<MinusOutlined />} 
                          onClick={() => handleDecrement()} 
                          size="large"
                        >
                          Decrease
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={() => handleIncrement()} 
                          size="large"
                        >
                          Increase
                        </Button>
                      </Space>

                      <Divider>Custom Amount</Divider>

                      <Space.Compact style={{ width: '100%', marginBottom: '24px' }}>
                        <Input
                          size="large"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount..."
                          onPressEnter={handleCustomAmount}
                        />
                        <Button 
                          type="primary" 
                          size="large"
                          icon={<SaveOutlined />}
                          onClick={handleCustomAmount}
                        >
                          Apply
                        </Button>
                        <Button 
                          type="default"
                          size="large"
                          icon={<PlusOutlined />}
                          onClick={handleAddCustomButton}
                        >
                          Save Button
                        </Button>
                      </Space.Compact>

                      {customButtons.length > 0 && (
                        <>
                          <Divider>Custom Buttons</Divider>
                          <Space wrap style={{ width: '100%', justifyContent: 'center', gap: '16px' }}>
                            {customButtons.map((button) => (
                              <Badge 
                                key={button._id} 
                                count={
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteCustomButton(button._id)}
                                    style={{ 
                                      color: '#ff4d4f',
                                      background: 'white',
                                      border: 'none',
                                      boxShadow: 'none',
                                      padding: '0 4px'
                                    }}
                                  />
                                }
                              >
                                <Button
                                  type={button.amount >= 0 ? 'primary' : 'default'}
                                  onClick={() => button.amount >= 0 ? 
                                    handleIncrement(button.amount) : 
                                    handleDecrement(Math.abs(button.amount))
                                  }
                                  size="large"
                                  style={{ 
                                    minWidth: '120px',
                                    height: '40px',
                                    borderRadius: '6px',
                                    ...(button.amount >= 0 
                                      ? { background: theme.primary, borderColor: theme.primary }
                                      : { background: theme.background, borderColor: theme.border, color: theme.foreground }
                                    )
                                  }}
                                >
                                  {button.amount >= 0 ? `+${button.amount}` : button.amount}
                                </Button>
                              </Badge>
                            ))}
                          </Space>
                        </>
                      )}

                      <Divider>History Controls</Divider>

                      <Space style={{ width: '100%', justifyContent: 'center' }}>
                        <Tooltip title="Undo">
                          <Button 
                            icon={<UndoOutlined />} 
                            onClick={handleUndo}
                            disabled={currentStep <= 0}
                            size="large"
                          />
                        </Tooltip>
                        <Tooltip title="Redo">
                          <Button 
                            icon={<RedoOutlined />} 
                            onClick={handleRedo}
                            disabled={currentStep >= history.length - 1}
                            size="large"
                          />
                        </Tooltip>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <div style={{ position: 'sticky', top: '24px' }}>
                  <CounterPersonality count={count} />
                </div>
              </Col>
            </Row>

            <Modal
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <HistoryOutlined />
                    <span>Counter History</span>
                  </Space>
                  {history.length > 0 && (
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={confirmReset}
                      size="small"
                    >
                      Reset All
                    </Button>
                  )}
                </div>
              }
              open={showHistory}
              onCancel={() => setShowHistory(false)}
              footer={null}
              width={600}
            >
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <Card 
                    key={index} 
                    size="small" 
                    style={{ 
                      marginBottom: '8px',
                      backgroundColor: index === currentStep ? theme.card : 'white'
                    }}
                  >
                    <Space>
                      <Badge 
                        status={entry.operationType === 'increment' ? 'success' : 'error'} 
                        text={`${entry.operationType === 'increment' ? '+' : '-'}${entry.amount}`}
                      />
                      <Divider type="vertical" />
                      <Text type="secondary" style={{ color: theme.foreground }}>Previous: {entry.previousValue}</Text>
                      <Text type="secondary" style={{ color: theme.foreground }}>→</Text>
                      <Text style={{ color: theme.foreground }}>New: {entry.newValue}</Text>
                      <Divider type="vertical" />
                      <Text type="secondary" style={{ fontSize: '12px', color: theme.foreground }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </Text>
                    </Space>
                  </Card>
                ))
              ) : (
                <Empty 
                  description="No history yet" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Counter;
