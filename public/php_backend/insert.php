<?php
// CORS Policy এবং JSON Headers (Vite ফ্রন্টএন্ড থেকে রিকোয়েস্ট আসার জন্য এটি বাধ্যতামূলক)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// OPTIONS রিকোয়েস্ট হ্যান্ডেল করা (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ডাটাবেজ কানেকশন যুক্ত করা
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ফ্রন্টএন্ড (React/Vite) থেকে আসা FormData রিসিভ করা
    $student_name    = $_POST['student_name'] ?? '';
    $class_name      = $_POST['class_name'] ?? '';
    $section         = $_POST['section'] ?? ''; 
    $roll            = $_POST['roll'] ?? '';    
    $phone_number    = $_POST['phone_number'] ?? '';
    $father_name     = $_POST['father_name'] ?? '';
    $mother_name     = $_POST['mother_name'] ?? '';
    $student_address = $_POST['student_address'] ?? 'Bangladesh';

    try {
        // ১. সর্বশেষ কাস্টম আইডি (STD-) বের করা (roll_number এর ভিত্তিতে শর্ট করে)
        $id_query = $pdo->query("SELECT id FROM students WHERE id LIKE 'STD-%' ORDER BY roll_number DESC LIMIT 1");
        $last_student = $id_query->fetch();

        if ($last_student) {
            $last_number = (int)str_replace('STD-', '', $last_student['id']);
            $next_number = $last_number + 1;
        } else {
            $next_number = 1001; 
        }
        
        // কাস্টম আইডি জেনারেট (যেমন: STD-1001)
        $generated_id = 'STD-' . $next_number; 

    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "আইডি জেনারেশন এরর: " . $e->getMessage()]);
        exit();
    }

    // ২. ছবি আপলোড হ্যান্ডেল করা
    $unique_image_name = null;
    if (isset($_FILES['student_image']) && $_FILES['student_image']['error'] === UPLOAD_ERR_OK) {
        $image_name = $_FILES['student_image']['name'];
        $image_tmp  = $_FILES['student_image']['tmp_name'];
        $upload_dir = __DIR__ . '/uploads/';

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        } else {
            chmod($upload_dir, 0777); 
        }

        $unique_image_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $image_name);
        move_uploaded_file($image_tmp, $upload_dir . $unique_image_name);
    }

    // ৩. ডাটাবেজে ডাটা ইনসার্ট করা
    try {
        $sql = "INSERT INTO students (id, student_name, class_name, section, roll, phone_number, father_name, mother_name, student_address, student_image) 
                VALUES (:id, :student_name, :class_name, :section, :roll, :phone_number, :father_name, :mother_name, :student_address, :student_image)";
        
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':id'              => $generated_id,
            ':student_name'    => $student_name,
            ':class_name'      => $class_name,
            ':section'         => $section,
            ':roll'            => $roll,
            ':phone_number'    => $phone_number,
            ':father_name'     => $father_name,
            ':mother_name'     => $mother_name,
            ':student_address' => $student_address,
            ':student_image'   => $unique_image_name
        ]);

        // সফল হলে JSON রেসপন্স পাঠানো (যাতে Vite ফ্রন্টএন্ড বুঝতে পারে)
        echo json_encode([
            "status" => "success", 
            "message" => "স্টুডেন্ট ডাটা সফলভাবে যোগ করা হয়েছে!", 
            "id" => $generated_id
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "ডাটাবেজ এরর: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Request Method"]);
}
?>
