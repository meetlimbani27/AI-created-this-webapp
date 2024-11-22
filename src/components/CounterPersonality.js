import React, { useState, useEffect } from 'react';
import { Card, Typography, Badge } from 'antd';
import { getPersonality, getMilestoneMessage } from '../utils/counterPersonality';
import { useTheme } from '../context/ThemeContext';

const { Text } = Typography;

const CounterPersonality = ({ count }) => {
  const [personality, setPersonality] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const newPersonality = getPersonality(count);
    setPersonality(newPersonality);
    
    const milestoneMsg = getMilestoneMessage(count);
    setMilestone(milestoneMsg);
  }, [count]);

  if (!personality) return null;

  return (
    <Card
      style={{
        background: theme.card,
        borderColor: theme.border,
        marginBottom: '24px',
        textAlign: 'center'
      }}
      bodyStyle={{ padding: '12px' }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
        {personality.emoji}
      </div>
      <Text style={{ color: theme.foreground, fontSize: '16px' }}>
        {personality.message}
      </Text>
      {milestone && (
        <div style={{ marginTop: '8px' }}>
          <Badge
            count={milestone}
            style={{
              backgroundColor: theme.primary,
              color: theme.background,
              padding: '0 8px'
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default CounterPersonality;
