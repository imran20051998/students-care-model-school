<?php
// হেডার যুক্ত করা যাতে ফ্রন্টএন্ড থেকে রিকোয়েস্ট গ্রহণ করতে পারে (CORS সমস্যা এড়াতে)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db.php'; // আপনার ডাটাবেজ সংযোগ ফাইল

// فرন্টএন্ড থেকে আসা JSON ডেটা পড়া
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->roll) && !empty($data->class)) {
    $name = $data->name;
    $roll = $data->roll;
    $class = $data->class;
    $phone = $data->phone ?? '';

    try {
        $sql = "INSERT INTO students (name, roll, class, phone) VALUES (:name, :roll, :class, :phone)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'name' => $name,
            'roll' => $roll,
            'class' => $class,
            'phone' => $phone
        ]);

        echo json_encode(["status" => "success", "message" => "ডেটা সফলভাবে সংরক্ষিত হয়েছে!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "ত্রুটি: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "সব তথ্য পূরণ করা হয়নি!"]);
}
?>
