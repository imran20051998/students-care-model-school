<?php
// ডাটাবেজ সংযোগ ফাইলটি যুক্ত করুন (আপনার ফাইলের নাম অনুযায়ী পরিবর্তন করে নিতে পারেন)
include 'db.php';

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $roll = $_POST['roll'];
    $class = $_POST['class'];
    $section = $_POST['section'];
    $address = $_POST['address'];
    $mobile = $_POST['mobile'];
    
    $image_name = "";

    // ছবি আপলোড হ্যান্ডলিং
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $image_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $image_name = time() . '_' . uniqid() . '.' . $image_ext;
        $upload_dir = 'uploads/';
        
        // আপলোড ফোল্ডার না থাকলে তৈরি করে নেওয়া
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $image_name);
    }

    // ডাটাবেজে ডেটা ইনসার্ট করার কোড (PDO ব্যবহার করে)
    try {
        $sql = "INSERT INTO students (name, roll, class, section, address, mobile, image) VALUES (:name, :roll, :class, :section, :address, :mobile, :image)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':roll' => $roll,
            ':class' => $class,
            ':section' => $section,
            ':address' => $address,
            ':mobile' => $mobile,
            ':image' => $image_name
        ]);
        $message = "ছাত্রের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!";
    } catch (PDOException $e) {
        $message = "ত্রুটি: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ছাত্রের তথ্য ফর্ম</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: #fff; padding: 30px; margin: auto; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
        input[type="text"], input[type="file"], textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        textarea { resize: vertical; height: 80px; }
        button { background-color: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-size: 16px; }
        button:hover { background-color: #45a049; }
        .message { text-align: center; margin-bottom: 15px; font-weight: bold; color: green; }
    </style>
</head>
<body>

<div class="container">
    <h2>নতুন ছাত্রের তথ্য ফর্ম</h2>
    
    <?php if (!empty($message)): ?>
        <div class="message"><?php echo $message; ?></div>
    <?php endif; ?>

    <form action="" method="POST" enctype="multipart/form-data">
        <div class="form-group">
            <label for="name">ছাত্রের নাম (Name):</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="roll">রোল (Roll):</label>
            <input type="text" id="roll" name="roll" required>
        </div>

        <div class="form-group">
            <label for="class">শ্রেণি (Class):</label>
            <input type="text" id="class" name="class" required>
        </div>

        <div class="form-group">
            <label for="section">সেকশন (Section):</label>
            <input type="text" id="section" name="section">
        </div>

        <div class="form-group">
            <label for="address">ঠিকানা (Address):</label>
            <textarea id="address" name="address"></textarea>
        </div>

        <div class="form-group">
            <label for="mobile">মোবাইল নম্বর (Mobile):</label>
            <input type="text" id="mobile" name="mobile">
        </div>

        <div class="form-group">
            <label for="image">ছবি (Image):</label>
            <input type="file" id="image" name="image" accept="image/*">
        </div>

        <button type="submit">সংরক্ষণ করুন</button>
    </form>
</div>

</body>
</html>