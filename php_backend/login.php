<?php
/**
 * login.php
 * Handles student or admin login
 */

require_once 'db.php';

$response = [
    "status" => "error",
    "message" => "An unknown login error occurred"
];

$raw_input = file_get_contents('php://input');
$input = json_decode($raw_input, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($input['username']) ? $conn->real_escape_string(trim($input['username'])) : '';
    $password = isset($input['password']) ? $conn->real_escape_string(trim($input['password'])) : '';
    $class = isset($input['class']) ? $conn->real_escape_string(trim($input['class'])) : '';
    $roll = isset($input['roll']) ? $conn->real_escape_string(trim($input['roll'])) : '';
    $phone = isset($input['phone']) ? $conn->real_escape_string(trim($input['phone'])) : '';

    if (!empty($username)) {
        // Admin or staff check
        if ($username === 'admin' && ($password === 'admin123' || $password === 'admin')) {
            $response = [
                "status" => "success",
                "role" => "admin",
                "message" => "Admin successfully authenticated!",
                "user" => [
                    "name" => "Administrator",
                    "username" => "admin",
                    "role" => "admin"
                ]
            ];
        } else {
            $response['message'] = "Authentication failed: Invalid admin credentials.";
        }
    } else if (!empty($class) && !empty($roll) && !empty($phone)) {
        // Student login
        $student_check = $conn->query("SELECT * FROM `students` WHERE `class` = '$class' AND `roll` = '$roll' AND `phone` = '$phone' LIMIT 1");
        if ($student_check && $student_check->num_rows > 0) {
            $student = $student_check->fetch_assoc();
            $response = [
                "status" => "success",
                "role" => "student",
                "message" => "Student successfully authenticated!",
                "student" => [
                    "sl" => intval($student['sl']),
                    "roll" => $student['roll'],
                    "name" => $student['name'],
                    "class" => $student['class'],
                    "section" => $student['section'],
                    "photo" => $student['photo']
                ]
            ];
        } else {
            $response['message'] = "Authentication failed: Invalid Class, Roll, or Phone Number combinations.";
        }
    } else {
        $response['message'] = "Bad Request: Missing required parameters.";
    }
} else {
    $response['message'] = "Invalid Request Method. POST required.";
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response, JSON_UNESCAPED_UNICODE);
$conn->close();
