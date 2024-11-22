import React, { useState, useEffect } from 'react';
import { Layout, List, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;
const { Text } = Typography;

const ActiveUsersSidebar = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/active', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch active users');
        }

        const data = await response.json();
        setActiveUsers(data.data);
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    // Fetch initially
    fetchActiveUsers();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchActiveUsers, 30000);

    // Update current user's activity status every minute
    const activityInterval = setInterval(async () => {
      try {
        await fetch('http://localhost:5000/api/users/activity', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    }, 60000);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearInterval(activityInterval);
      // Set user as inactive when component unmounts
      fetch('http://localhost:5000/api/users/inactive', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }).catch(error => console.error('Error setting user inactive:', error));
    };
  }, [user.token]);

  return (
    <Sider
      width={200}
      style={{
        background: '#fff',
        padding: '20px',
        borderRight: '1px solid #f0f0f0'
      }}
    >
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Active Users
      </Typography.Title>
      {activeUsers.length === 0 ? (
        <Text type="secondary">No other users active</Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={activeUsers}
          renderItem={user => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={user.username}
              />
            </List.Item>
          )}
        />
      )}
    </Sider>
  );
};

export default ActiveUsersSidebar;
