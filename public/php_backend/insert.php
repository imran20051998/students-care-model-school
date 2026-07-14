<?php
// ডাটাবেজ কানেকশন যুক্ত করা
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ফর্ম থেকে ডাটা নেওয়া
    $student_name    = $_POST['student_name'];
    $class_name      = $_POST['class_name'];
    $phone_number    = $_POST['phone_number'];
    $father_name     = $_POST['father_name'];
    $mother_name     = $_POST['mother_name'];
    $student_address = $_POST['student_address'];

    try {
        // সর্বশেষ স্টুডেন্টের আইডি বের করে নতুন আইডি জেনারেট করা (যেমন: STD-1024)
        $id_query = $pdo->query("SELECT roll_number FROM students WHERE roll_number LIKE 'STD-%' ORDER BY id DESC LIMIT 1");
        $last_student = $id_query->fetch();

        if ($last_student) {
            $last_number = (int)str_replace('STD-', '', $last_student['roll_number']);
            $next_number = $last_number + 1;
        } else {
            $next_number = 1001; 
        }
        
        $roll_number = 'STD-' . $next_number; 

    } catch (PDOException $e) {
        die("আইডি জেনারেশন এরর: " . $e->getMessage());
    }

    // ছবির ইনফরমেশন
    $image_name = $_FILES['student_image']['name'];
    $image_tmp  = $_FILES['student_image']['tmp_name'];
    $image_error = $_FILES['student_image']['error'];
    
    // লাইভ সার্ভারের সঠিক পাথ নির্ধারণ
    $upload_dir = __DIR__ . '/uploads/';

    // গিটহাব থেকে আসা ফোল্ডারের পারমিশন কোড থেকে ফোর্সমডিফাই করা (0777)
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    } else {
        chmod($upload_dir, 0777); // ফোল্ডার অলরেডি থাকলে তার পারমিশন 777 করে দেবে
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
            // SQL Query প্রস্তুত করা
            $sql = "INSERT INTO students (student_name, roll_number, class_name, phone_number, father_name, mother_name, student_address, student_image) 
                    VALUES (:student_name, :roll_number, :class_name, :phone_number, :father_name, :mother_name, :student_address, :student_image)";
            
            $stmt = $pdo->prepare($sql);
            
            // ডাটা বাইন্ড করে এক্সিকিউট করা
            $stmt->execute([
                ':student_name'    => $student_name,
                ':roll_number'     => $roll_number,
                ':class_name'      => $class_name,
                ':phone_number'    => $phone_number,
                ':father_name'     => $father_name,
                ':mother_name'     => $mother_name,
                ':student_address' => $student_address,
                ':student_image'   => $unique_image_name
            ]);

            echo "<script>alert('স্টুডেন্ট ডাটা সফলভাবে যোগ করা হয়েছে! আইডি: $roll_number'); window.location.href='students.php';</script>";
            
        } catch (PDOException $e) {
            die("ডাটাবেজ এরর: " . $e->getMessage());
        }
    } else {
        $last_error = error_get_last();
        echo "<h3>ছবি আপলোড করতে সমস্যা হয়েছে!</h3>";
        echo "সার্ভার মেসেজ: " . ($last_error ? $last_error['message'] : 'পারমিশন ইস্যু।');
    }
}
?>
