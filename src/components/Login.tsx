import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // আমাদের তৈরি করা ব্যাকএন্ড লগইন এপিআই-তে ডাটা পাঠানো হচ্ছে
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                setMessage(`লগইন সফল! আপনার রোল: ${data.user.role}`);
                // এখানে আমরা পরবর্তীতে ইউজারকে তার নির্দিষ্ট ড্যাশবোর্ডে (Admin/Teacher) পাঠিয়ে দেব
            } else {
                setMessage(data.message || 'লগইন ব্যর্থ হয়েছে!');
            }
        } catch (error) {
            setMessage('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>স্কুল ওয়েবসাইট লগইন</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>ইমেইল:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>পাসওয়ার্ড:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.includes('সফল') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
}
