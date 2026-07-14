<?php
// ডাটাবেজ কানেকশন যুক্ত করা
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ফর্ম থেকে ডাটা নেওয়া
    $student_name    = $_POST['student_name'] ?? '';
    $class_name      = $_POST['class_name'] ?? '';
    $section         = $_POST['section'] ?? ''; 
    $roll            = $_POST['roll'] ?? '';    
    $phone_number    = $_POST['phone_number'] ?? '';
    $father_name     = $_POST['father_name'] ?? '';
    $mother_name     = $_POST['mother_name'] ?? '';
    $student_address = $_POST['student_address'] ?? '';

    try {
        // সর্বশেষ স্টুডেন্টের কাস্টম আইডি (STD-) বের করার জন্য roll_number (PRIMARY KEY) দিয়ে অর্ডার করা হয়েছে
        $id_query = $pdo->query("SELECT id FROM students WHERE id LIKE 'STD-%' ORDER BY roll_number DESC LIMIT 1");
        $last_student = $id_query->fetch();

        if ($last_student) {
            $last_number = (int)str_replace('STD-', '', $last_student['id']);
            $next_number = $last_number + 1;
        } else {
            $next_number = 1001; 
        }
        
        // এটি আপনার কাস্টম আইডি (যেমন: STD-1001) যা ডাটাবেজের 'id' ঘরে বসবে
        $generated_id = 'STD-' . $next_number; 

    } catch (PDOException $e) {
        die("আইডি জেনারেশন এরর: " . $e->getMessage());
    }

    // ছবির ইনফরমেশন
    $image_name = $_FILES['student_image']['name'] ?? '';
    $image_tmp  = $_FILES['student_image']['tmp_name'] ?? '';
    $image_error = $_FILES['student_image']['error'] ?? UPLOAD_ERR_NO_FILE;
    
    // লাইভ সার্ভারের সঠিক পাথ নির্ধারণ
    $upload_dir = __DIR__ . '/uploads/';

    // ফোল্ডার না থাকলে তৈরি করা এবং পারমিশন 0777 সেট করা
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    } else {
        chmod($upload_dir, 0777); 
    }

    // ছবির একটি ইউনিক নাম তৈরি করা
    $unique_image_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $image_name);
    $target_file = $upload_dir . $unique_image_name;

    if ($image_error !== UPLOAD_ERR_OK) {
        die("PHP Image Upload Error Code: " . $image_error);
    }

    // ছবি নির্দিষ্ট ফোল্ডারে মুভ করা
    if (move_uploaded_file($image_tmp, $target_file)) {
        try {
            // SQL Query (roll_number কলামটি অটো-ইনক্রিমেন্ট হওয়ায় কুয়েরি থেকে বাদ দেওয়া হয়েছে)
            $sql = "INSERT INTO students (id, student_name, class_name, section, roll, phone_number, father_name, mother_name, student_address, student_image) 
                    VALUES (:id, :student_name, :class_name, :section, :roll, :phone_number, :father_name, :mother_name, :student_address, :student_image)";
            
            $stmt = $pdo->prepare($sql);
            
            // ডাটা বাইন্ড করে এক্সিকিউট করা
            $stmt->execute([
                ':id'              => $generated_id,    // 'id' ঘরে STD-1001 সেভ হবে
                ':student_name'    => $student_name,
                ':class_name'      => $class_name,
                ':section'         => $section,
                ':roll'            => $roll,            // ফর্ম থেকে আসা ক্লাসের রোল
                ':phone_number'    => $phone_number,
                ':father_name'     => $father_name,
                ':mother_name'     => $mother_name,
                ':student_address' => $student_address,
                ':student_image'   => $unique_image_name
            ]);

            echo "<script>alert('স্টুডেন্ট ডাটা সফলভাবে যোগ করা হয়েছে! আইডি: $generated_id'); window.location.href='students.php';</script>";
            
        } catch (PDOException $e) {
            die("ডাটাবেজ এরর: " . $e->getMessage());
        }
    } else {
        $last_error = error_get_last();
        echo "<h3>ছবি আপলোড করতে সমস্যা হয়েছে!</h3>";
        echo "সার্ভার মেসেজ: " . ($last_error ? $last_error['message'] : 'পারমিশন ইস্যু।');
    }
}
?>
