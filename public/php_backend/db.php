<?php
// CORS Headers (Vite ফ্রন্টএন্ডের সাথে কানেকশনের জন্য)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ডাটাবেজ ক্রেডেনশিয়ালস
$host     = '127.0.0.1'; // 'localhost' এর বদলে '127.0.0.1' লাইভ হোস্টিংয়ে বেশি স্ট্যাবল
$dbname   = 'u398502275_StudentData';
$username = 'u398502275_studentdata';
$password = 'Cisfa1998$#@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed.',
        'error_details' => $e->getMessage() // লাইভ এরর দেখার জন্য এটি যুক্ত করা হলো
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
