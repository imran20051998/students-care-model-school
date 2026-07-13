<?php
/**
 * Secure Student Data Retrieval Handler (get_students.php)
 * Retrieves student records with optional filters for class, section, and search queries.
 */

// Set appropriate response headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Handle CORS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Accept only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. This endpoint only accepts secure GET requests.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Include secure database connection helper
require_once 'db.php';

try {
    // Extract filters
    $class   = isset($_GET['class']) ? trim(filter_var($_GET['class'], FILTER_DEFAULT)) : '';
    $section = isset($_GET['section']) ? trim(filter_var($_GET['section'], FILTER_DEFAULT)) : '';
    $search  = isset($_GET['search']) ? trim(filter_var($_GET['search'], FILTER_DEFAULT)) : '';

    // Base query
    $sql = "SELECT sl, photo, roll, name, class, section, guardian, phone, created_at FROM students WHERE 1=1";
    $params = [];

    if (!empty($class)) {
        $sql .= " AND class = :class";
        $params[':class'] = $class;
    }

    if (!empty($section)) {
        $sql .= " AND section = :section";
        $params[':section'] = $section;
    }

    if (!empty($search)) {
        $sql .= " AND (name LIKE :search_name OR roll LIKE :search_roll OR phone LIKE :search_phone)";
        $params[':search_name'] = "%$search%";
        $params[':search_roll'] = "%$search%";
        $params[':search_phone'] = "%$search%";
    }

    // Sort by class, section, roll
    $sql .= " ORDER BY class ASC, section ASC, CAST(roll AS UNSIGNED) ASC, sl ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll();

    // Sanitize output to prevent XSS
    $sanitizedStudents = [];
    foreach ($students as $row) {
        $sanitizedStudents[] = [
            'sl'         => (int)$row['sl'],
            'photo'      => htmlspecialchars($row['photo'] ?? '', ENT_QUOTES, 'UTF-8'),
            'roll'       => htmlspecialchars($row['roll'] ?? '', ENT_QUOTES, 'UTF-8'),
            'name'       => htmlspecialchars($row['name'] ?? '', ENT_QUOTES, 'UTF-8'),
            'class'      => htmlspecialchars($row['class'] ?? '', ENT_QUOTES, 'UTF-8'),
            'section'    => htmlspecialchars($row['section'] ?? '', ENT_QUOTES, 'UTF-8'),
            'guardian'   => htmlspecialchars($row['guardian'] ?? '', ENT_QUOTES, 'UTF-8'),
            'phone'      => htmlspecialchars($row['phone'] ?? '', ENT_QUOTES, 'UTF-8'),
            'created_at' => $row['created_at']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'count' => count($sanitizedStudents),
        'students' => $sanitizedStudents
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database query failed: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An unexpected internal error occurred: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
