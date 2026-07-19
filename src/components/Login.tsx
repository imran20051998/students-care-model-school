import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState('1'); // ১ হলো অ্যাডমিন
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      // আমরা সরাসরি /php_backend/login.php এ রিকোয়েস্ট পাঠাচ্ছি
      const response = await fetch('/php_backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role_id }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage('Login Successful! Redirecting...');
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/dashboard';
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('Server error. Please check your backend connection.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>School Portal Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        
        <select onChange={(e) => setRoleId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
          <option value="1">Admin</option>
          <option value="2">Teacher</option>
          <option value="3">Guardian</option>
          <option value="4">Accountant</option>
        </select>

        <button type="submit" style={{ width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none' }}>
          Sign In
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', textAlign: 'center' }}>{message}</p>}
    </div>
  );
};

export default Login;
