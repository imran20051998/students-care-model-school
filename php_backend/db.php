<?php
$host = 'localhost';
$dbname = 'u451653929_login_control';
$username = 'u451653929_logincontrol';
$password = 'Cisfa1998$#@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // এরর মোড সেট করা
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "ডাটাবেজ সংযোগ সফল হয়েছে!";
} catch (PDOException $e) {
    die("সংযোগ ব্যর্থ হয়েছে: " . $e->getMessage());
}
?>
