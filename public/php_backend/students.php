<?php
// ১. ডাটাবেজ কানেকশন ফাইলটি যুক্ত করা
require 'db.php';
try {
    // ২. স্টুডেন্ট ডাটা তুলে আনার জন্য SQL Query (ধরে নিচ্ছি আপনার টেবিলের নাম 'students')
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
    <title>স্টুডেন্ট ডাটা তালিকা</title>
    <style>
        table { width: 80%; margin: 20px auto; border-collapse: collapse; font-family: Arial, sans-serif; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        h2 { text-align: center; color: #333; }
    </style>
</head>
<body>

    <h2>সকল ছাত্র-ছাত্রীদের তালিকা</h2>

    <table>
        <thead>
            <tr>
                <th>আইডি (ID)</th>
                <th>নাম (Name)</th>
                <th>রোল (Roll)</th>
                <th>ইমেইল (Email)</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($students) > 0): ?>
                <?php foreach ($students as $student): ?>
                    <tr>
                        <!-- আপনার ডাটাবেজের কলামের নাম অনুযায়ী নিচের ['id'], ['name'] এগুলো পরিবর্তন করতে পারেন -->
                        <td><?= htmlspecialchars($student['id']) ?></td>
                        <td><?= htmlspecialchars($student['name']) ?></td>
                        <td><?= htmlspecialchars($student['roll']) ?></td>
                        <td><?= htmlspecialchars($student['email']) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="4" style="text-align:center;">ডাটাবেজে কোনো স্টুডেন্টের তথ্য পাওয়া যায়নি।</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

</body>
</html>
