import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ডাটাবেজ কানেকশন পুল (Pool) তৈরি
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// কানেকশন টেস্ট করার ছোট ফাংশন
async function testDatabase() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Hostinger MySQL Database Connected Successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
}

testDatabase();

export default db;
