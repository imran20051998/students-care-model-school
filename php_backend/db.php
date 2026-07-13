<?php
/**
 * Database Connection Helper (PDO-based)
 * Designed for high security and prevention of credential leakage.
 */

// Database credentials
$host     = 'localhost';
$dbname   = 'u398502275_StudentData';
$username = 'u398502275_studentdata';
$password = '';

try {
    // Create PDO connection with secure attributes
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        // Throw exceptions on SQL errors for secure debugging
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // Set default fetch mode to associative array
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        // Disable emulation of prepared statements to prevent SQL injection vulnerabilities
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Output a clean secure JSON response instead of exposing system details or stack traces
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please verify your credentials in db.php.',
        'debug' => (PHP_OS === 'WINNT' || ini_get('display_errors')) ? $e->getMessage() : 'Production mode active'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
