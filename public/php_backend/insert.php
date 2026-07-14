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

    // ছবি আপলোড হ্যান্ডলিং
    $image_name = $_FILES['student_image']['name'];
    $image_tmp  = $_FILES['student_image']['tmp_name'];
    
    // ছবির ইউনিক নাম তৈরি করা (যাতে একই নামের ছবি ওভাররাইট না হয়)
    $unique_image_name = time() . '_' . $image_name;
    $upload_dir = 'uploads/' . $unique_image_name;

    // ছবি নির্দিষ্ট ফোল্ডারে মুভ করা
    if (move_uploaded_file($image_tmp, $upload_dir)) {
        try {
            // SQL Query প্রস্তুত করা
            $sql = "INSERT INTO students (student_name, roll_number, class_name, phone_number, father_name, mother_name, student_address, student_image) 
                    VALUES (:student_name, :roll_number, :class_name, :phone_number, :father_name, :mother_name, :student_address, :student_image)";
            
            $stmt = $pdo->prepare($sql);
            
            // ডাটা বাইন্ড করে এক্সিকিউট করা (SQL Injection থেকে বাঁচার জন্য)
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

            // সফল হলে মেসেজ দেখানো এবং তালিকা পেজে রিডাইরেক্ট করা
            echo "<script>alert('স্টুডেন্ট ডাটা সফলভাবে যোগ করা হয়েছে!'); window.location.href='students.php';</script>";
            
        } catch (PDOException $e) {
            echo "ডাটাবেজ এরর: " . $e->getMessage();
        }
    } else {
        echo "ছবি আপলোড করতে সমস্যা হয়েছে!";
    }
}
?>
