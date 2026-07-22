import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ 
    role: 'Admin', // ডিফল্ট রোল Admin
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // আপনার লাইভ সাইটের process_login.php ফাইলের পাথ
      const response = await fetch('/process_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // ডাটাবেস ভ্যালিডেশন সফল হলে স্টোরেজে সেভ হবে
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', data.role);
        
        // ড্যাশবোর্ডে রিডাইরেক্ট করবে
        navigate('/dashboard'); 
      } else {
        // ডাটাবেসে তথ্য না মিললে এরর মেসেজ দেখাবে (ঢুকতে দেবে না)
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ textAlign: 'center', color: '#1b5e20', marginBottom: '20px' }}>Sign In</h2>

        {/* Role เลือก করার বাটনসমূহ */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', justifyContent: 'center' }}>
          {['Admin', 'Teacher', 'Guardian', 'Accountant'].map((roleName) => (
            <button
              key={roleName}
              type="button"
              onClick={() => setFormData({ ...formData, role: roleName })}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '4px',
                border: '1px solid #1b5e20',
                backgroundColor: formData.role === roleName ? '#1b5e20' : '#fff',
                color: formData.role === roleName ? '#fff' : '#1b5e20',
                cursor: 'pointer'
              }}
            >
              {roleName}
            </button>
          ))}
        </div>

        {/* Username input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>USERNAME</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            placeholder="Username" 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Password input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>PASSWORD</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            placeholder="Password" 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Submit button */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1b5e20', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Sign in'}
        </button>

        {/* Error message */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
