import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Counter from './components/Counter';
import { Layout } from 'antd';
import { ThemeProvider } from './context/ThemeContext';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout className="min-h-screen">
            <Content>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/counter" 
                  element={
                    <PrivateRoute>
                      <Counter />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/counters" 
                  element={<Navigate to="/counter" replace />} 
                />
                <Route path="/" element={<Navigate to="/counter" replace />} />
              </Routes>
            </Content>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
