<?php
require_once 'db.php'; // ডেটাবেস কানেকশন ফাইল

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $conn->real_escape_string($input['email']);
    $password = $input['password']; // বাস্তবে পাসওয়ার্ড হ্যাশ করে চেক করা উচিত
    $role_id = intval($input['role_id']);

    // ইউজার চেক করার কুয়েরি
    $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password' AND role_id = $role_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(["status" => "success", "message" => "Login Successful", "role_id" => $user['role_id']]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials or role mismatch"]);
    }
}
$conn->close();
?>
