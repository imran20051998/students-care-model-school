<?php
/**
 * Secure Student Credential Reset/Update Endpoint (reset_password.php)
 * Allows resetting student information or validating details against the database.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
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
    $input = json_decode(file_get_contents('php://input'), true);
    
    $roll     = isset($input['roll']) ? trim($input['roll']) : (isset($_POST['roll']) ? trim($_POST['roll']) : '');
    $class    = isset($input['class']) ? trim($input['class']) : (isset($_POST['class']) ? trim($_POST['class']) : '');
    $phone    = isset($input['phone']) ? trim($input['phone']) : (isset($_POST['phone']) ? trim($_POST['phone']) : '');
    $newPhone = isset($input['new_phone']) ? trim($input['new_phone']) : (isset($_POST['new_phone']) ? trim($_POST['new_phone']) : '');

    if (empty($roll) || empty($class) || empty($phone)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Validation Failed: Roll, Class, and Current Phone number are required to verify student identity.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Verify student exists first
    $verifySql = "SELECT sl, name FROM students WHERE class = :class AND roll = :roll AND phone = :phone LIMIT 1";
    $stmt = $pdo->prepare($verifySql);
    $stmt->execute([
        ':class' => $class,
        ':roll'  => $roll,
        ':phone' => $phone
    ]);
    $student = $stmt->fetch();

    if (!$student) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Verification failed: Student record matching these details was not found.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (empty($newPhone)) {
        // If no new phone is supplied, treat this as a verification check
        echo json_encode([
            'status' => 'success',
            'message' => 'Student identity verified successfully.',
            'student' => [
                'name' => htmlspecialchars($student['name'], ENT_QUOTES, 'UTF-8')
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    // Update phone number in the database
    $updateSql = "UPDATE students SET phone = :new_phone WHERE class = :class AND roll = :roll AND phone = :phone";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([
        ':new_phone' => $newPhone,
        ':class'     => $class,
        ':roll'      => $roll,
        ':phone'     => $phone
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Student phone contact details successfully updated in the database!'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

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
