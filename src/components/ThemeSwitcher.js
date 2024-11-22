import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import { useTheme, themes } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const items = Object.keys(themes).map(themeName => ({
    key: themeName,
    label: themeName.charAt(0).toUpperCase() + themeName.slice(1),
    onClick: () => toggleTheme(themeName),
  }));

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button 
        type="text"
        icon={<BgColorsOutlined />}
        style={{ 
          color: theme.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ marginLeft: 8 }}>Theme</span>
      </Button>
    </Dropdown>
  );
};

export default ThemeSwitcher;
