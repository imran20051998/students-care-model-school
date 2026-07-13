<?php
/**
 * Secure School Slider Save Handler (save_slider.php)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. This endpoint only accepts secure POST requests.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once 'db.php';

try {
    $sliderJson = isset($_POST['slider']) ? $_POST['slider'] : '';
    
    if (empty($sliderJson)) {
        // If not in $_POST, try raw post data
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw, true);
        if (isset($decoded['slider'])) {
            $sliderJson = json_encode($decoded['slider']);
        } else if (!empty($raw) && is_array($decoded)) {
            $sliderJson = $raw;
        }
    }

    // Check if table school_settings exists. If not, create it!
    try {
        $pdo->query("SELECT 1 FROM school_settings LIMIT 1");
    } catch (PDOException $e) {
        $createTableSql = "CREATE TABLE IF NOT EXISTS school_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            siteNameBn VARCHAR(255) NULL,
            siteNameEn VARCHAR(255) NULL,
            addressBn VARCHAR(255) NULL,
            addressEn VARCHAR(255) NULL,
            eiin VARCHAR(100) NULL,
            foundedYear VARCHAR(100) NULL,
            helpline VARCHAR(100) NULL,
            email VARCHAR(255) NULL,
            website VARCHAR(255) NULL,
            bannerColor VARCHAR(50) NULL,
            bannerFontSize INT DEFAULT 32,
            bannerGradient INT DEFAULT 0,
            logoUrl TEXT NULL,
            sliderJson LONGTEXT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        $pdo->exec($createTableSql);
    }

    // Make sure sliderJson column exists
    try {
        $pdo->query("SELECT sliderJson FROM school_settings LIMIT 1");
    } catch (PDOException $e) {
        $pdo->exec("ALTER TABLE school_settings ADD COLUMN sliderJson LONGTEXT NULL");
    }

    // Update the existing row or insert a default one
    $stmt = $pdo->query("SELECT id FROM school_settings LIMIT 1");
    $row = $stmt->fetch();

    if ($row) {
        $sql = "UPDATE school_settings SET sliderJson = :sliderJson WHERE id = :id";
        $stmtUpdate = $pdo->prepare($sql);
        $stmtUpdate->execute([
            ':sliderJson' => $sliderJson,
            ':id' => $row['id']
        ]);
    } else {
        $sql = "INSERT INTO school_settings (sliderJson) VALUES (:sliderJson)";
        $stmtInsert = $pdo->prepare($sql);
        $stmtInsert->execute([
            ':sliderJson' => $sliderJson
        ]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Slider parameters saved successfully to school_settings table!',
        'slider' => json_decode($sliderJson, true)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database operation failed: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An unexpected error occurred: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
