<?php
// ১. ডাটাবেজ কানেকশন ফাইল যুক্ত করা
require 'db.php'; 

try {
    // ২. স্টুডেন্ট ডাটা তুলে আনার SQL Query (ধরে নিচ্ছি টেবিলের নাম 'students')
    $sql = "SELECT * FROM students";
    $stmt = $pdo->query($sql);
    $students = $stmt->fetchAll();
} catch (PDOException $e) {
    die("Error fetching data: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>সকল ছাত্র-ছাত্রীদের তালিকা</title>
    <style>
        table { width: 95%; margin: 20px auto; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        h2 { text-align: center; color: #333; margin-top: 20px; }
        .student-img { width: 50px; height: 50px; object-fit: cover; border-radius: 50%; border: 1px solid #ccc; }
    </style>
</head>
<body>

    <h2>সকল ছাত্র-ছাত্রীদের তালিকা</h2>

    <table>
        <thead>
            <tr>
                <th>ছবি</th>
                <th>আইডি (ID)</th>
                <th>নাম (Name)</th>
                <th>রোল (Roll)</th>
                <th>ক্লাস (Class)</th>
                <th>ফোন নম্বর</th>
                <th>পিতার নাম</th>
                <th>মাতার নাম</th>
                <th>ঠিকানা</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($students) > 0): ?>
                <?php foreach ($students as $student): ?>
                    <tr>
                        <!-- ছবি দেখানোর জন্য (ধরে নিচ্ছি ডাটাবেজে ছবির পাথ বা নাম সেভ আছে) -->
                        <td>
                            <?php if (!empty($student['student_image'])): ?>
                                <img src="uploads/<?= htmlspecialchars($student['student_image']) ?>" class="student-img" alt="Student">
                            <?php else: ?>
                                <img src="uploads/default.png" class="student-img" alt="Default">
                            <?php endif; ?>
                        </td>
                        <td><?= htmlspecialchars($student['id']) ?></td>
                        <td><?= htmlspecialchars($student['student_name']) ?></td>
                        <td><?= htmlspecialchars($student['roll_number']) ?></td>
                        <td><?= htmlspecialchars($student['class_name']) ?></td>
                        <td><?= htmlspecialchars($student['phone_number']) ?></td>
                        <td><?= htmlspecialchars($student['father_name']) ?></td>
                        <td><?= htmlspecialchars($student['mother_name']) ?></td>
                        <td><?= htmlspecialchars($student['student_address']) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="9" style="text-align:center; padding: 20px;">ডাটাবেজে কোনো স্টুডেন্টের তথ্য পাওয়া যায়নি।</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

</body>
</html>
