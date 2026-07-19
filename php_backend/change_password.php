<?php
require_once 'db.php'; // ডাটাবেস কানেকশন

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ফর্ম থেকে আসা ডেটা
    $email = $conn->real_escape_string($input['email']);
    $old_password = $input['old_password'];
    $new_password = $input['new_password'];

    // ১. পুরনো পাসওয়ার্ড ও ইমেইল দিয়ে ইউজারকে ভেরিফাই করা
    $check_sql = "SELECT * FROM users WHERE email = '$email' AND password = '$old_password'";
    $result = $conn->query($check_sql);

    if ($result->num_rows > 0) {
        // ২. যদি সঠিক হয়, তবে নতুন পাসওয়ার্ড আপডেট করা
        $update_sql = "UPDATE users SET password = '$new_password' WHERE email = '$email'";
        
        if ($conn->query($update_sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid current password"]);
    }
}
$conn->close();
?>
