import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // username এর জায়গায় email
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState('1'); // অ্যাডমিনের জন্য ডিফল্ট ১
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // আপনার সঠিক পাথ: /php_backend/login.php
      const response = await fetch('/php_backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role_id }), 
      });

      const data = await response.json();

      if (data.status === 'success') {
        // লগইন সফল হলে ডাটা সেভ করুন এবং ড্যাশবোর্ডে পাঠান
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    // ... আগের মতো ডিজাইন রাখুন, শুধু নিচে রোল সিলেক্ট অপশনটি যোগ করুন
    <div style={{ marginBottom: '16px' }}>
      <label>Select Role</label>
      <select onChange={(e) => setRoleId(e.target.value)} style={{ width: '100%', padding: '10px' }}>
        <option value="1">Admin</option>
        <option value="2">Teacher</option>
        <option value="3">Guardian</option>
        <option value="4">Accountant</option>
      </select>
    </div>
    // ... বাকি ফর্মের বাটনটি আগের মতোই থাকবে
  );
};

export default Login;
