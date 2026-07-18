import React, { useState } from 'react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Replace with your exact auth endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      // Redirect or store token logic here
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1b5e20' }}>School Portal Login</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Username / Email</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Enter your username" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Enter your password" />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#1b5e20', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
