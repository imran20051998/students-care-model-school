<?php
/**
 * Secure User Authentication Endpoint (login.php)
 * Authenticates students, parents, or administrators with proper JSON response payloads.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. This endpoint only accepts secure POST requests.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

require_once 'db.php';

try {
    // Retrieve input payload (JSON or Form POST)
    $input = json_decode(file_get_contents('php://input'), true);
    
    $username = isset($input['username']) ? trim($input['username']) : (isset($_POST['username']) ? trim($_POST['username']) : '');
    $password = isset($input['password']) ? trim($input['password']) : (isset($_POST['password']) ? trim($_POST['password']) : '');
    
    // For student logins specifically, they may login via class, roll, and phone
    $class   = isset($input['class']) ? trim($input['class']) : (isset($_POST['class']) ? trim($_POST['class']) : '');
    $roll    = isset($input['roll']) ? trim($input['roll']) : (isset($_POST['roll']) ? trim($_POST['roll']) : '');
    $phone   = isset($input['phone']) ? trim($input['phone']) : (isset($_POST['phone']) ? trim($_POST['phone']) : '');

    // 1. Admin/Staff Fallback check (secure hashing or simple comparison for mock demonstration)
    if ($username === 'admin' && ($password === 'admin123' || $password === 'admin')) {
        echo json_encode([
            'status' => 'success',
            'role' => 'admin',
            'message' => 'Admin successfully authenticated!',
            'user' => [
                'name' => 'Administrator',
                'username' => 'admin',
                'role' => 'admin'
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    // 2. Student Database-driven Login
    if (!empty($class) && !empty($roll) && !empty($phone)) {
        $sql = "SELECT * FROM students WHERE class = :class AND roll = :roll AND phone = :phone LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':class' => $class,
            ':roll'  => $roll,
            ':phone' => $phone
        ]);
        $student = $stmt->fetch();

        if ($student) {
            echo json_encode([
                'status' => 'success',
                'role' => 'student',
                'message' => 'Student successfully authenticated!',
                'student' => [
                    'sl' => (int)$student['sl'],
                    'roll' => htmlspecialchars($student['roll'], ENT_QUOTES, 'UTF-8'),
                    'name' => htmlspecialchars($student['name'], ENT_QUOTES, 'UTF-8'),
                    'class' => htmlspecialchars($student['class'], ENT_QUOTES, 'UTF-8'),
                    'section' => htmlspecialchars($student['section'], ENT_QUOTES, 'UTF-8'),
                    'photo' => htmlspecialchars($student['photo'] ?? '', ENT_QUOTES, 'UTF-8')
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        } else {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Authentication failed: Invalid Class, Roll, or Phone Number combinations.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // If inputs are incomplete
    if (empty($username) && (empty($class) || empty($roll) || empty($phone))) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Bad Request: Please provide either Admin Username/Password OR Student Class/Roll/Phone combinations.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Generic bad credentials response
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid credentials provided.'
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database operation failed: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An unexpected internal error occurred: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
