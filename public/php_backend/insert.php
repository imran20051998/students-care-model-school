<?php
// ডাটাবেজ কানেকশন যুক্ত করা
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ফর্ম থেকে ডাটা নেওয়া
    $student_name    = $_POST['student_name'];
    $roll_number     = $_POST['roll_number'];
    $class_name      = $_POST['class_name'];
    $phone_number    = $_POST['phone_number'];
    $father_name     = $_POST['father_name'];
    $mother_name     = $_POST['mother_name'];
    $student_address = $_POST['student_address'];

    // ছবির ইনফরমেশন
    $image_name = $_FILES['student_image']['name'];
    $image_tmp  = $_FILES['student_image']['tmp_name'];
    $image_error = $_FILES['student_image']['error'];
    
    // লাইভ সার্ভারের সঠিক পাথ নির্ধারণ
    $upload_dir = __DIR__ . '/uploads/';

    // যদি কোনো কারণে সার্ভারে ফোল্ডার না থাকে বা পারমিশন না থাকে, তবে তৈরি ও পারমিশন সেট করবে
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // ছবির একটি ইউনিক নাম তৈরি করা
    $unique_image_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $image_name);
    $target_file = $upload_dir . $unique_image_name;

    // ফর্ম আপলোডে কোনো ইন্টারনাল এরর আছে কিনা চেক করা
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

            // সফল হলে অ্যালার্ট দিয়ে রিডাইরেক্ট
            echo "<script>alert('স্টুডেন্ট ডাটা সফলভাবে যোগ করা হয়েছে!'); window.location.href='students.php';</script>";
            
        } catch (PDOException $e) {
            die("ডাটাবেজ এরর: " . $e->getMessage());
        }
    } else {
        // এবার যদি আপলোড না হয়, তবে সার্ভারের আসল সমস্যাটি এখানে প্রিন্ট হবে
        $last_error = error_get_last();
        echo "<h3>ছবি আপলোড করতে সমস্যা হয়েছে!</h3>";
        echo "লোকাল পাথ ট্রাই করা হয়েছিল: " . $target_file . "<br>";
        echo "সার্ভার মেসেজ: " . ($last_error ? $last_error['message'] : 'ফোল্ডার পারমিশন (Permission 755) ইস্যু হতে পারে।');
    }
}
?>
