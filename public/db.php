<?php
$host = '127.0.0.1';
$port = '3306';
$dbname = 'u451653929_login_control';
$username = 'u451653929_logincontrol';
$password = 'Cisfa1998$#@';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // সংযোগ সফল হলে এটি দেখাবে
    echo "ডাটাবেজ সফলভাবে সংযুক্ত হয়েছে!";

} catch (PDOException $e) {
    die("সংযোগ ব্যর্থ হয়েছে: " . $e->getMessage());
}
?>