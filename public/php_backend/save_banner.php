<?php
/**
 * Secure School Banner & Settings Save Handler (save_banner.php)
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
    // 1. Extract values
    $siteNameBn     = isset($_POST['siteNameBn']) ? trim($_POST['siteNameBn']) : '';
    $siteNameEn     = isset($_POST['siteNameEn']) ? trim($_POST['siteNameEn']) : '';
    $addressBn      = isset($_POST['addressBn']) ? trim($_POST['addressBn']) : '';
    $addressEn      = isset($_POST['addressEn']) ? trim($_POST['addressEn']) : '';
    $eiin           = isset($_POST['eiin']) ? trim($_POST['eiin']) : '';
    $foundedYear    = isset($_POST['foundedYear']) ? trim($_POST['foundedYear']) : '';
    $helpline       = isset($_POST['helpline']) ? trim($_POST['helpline']) : '';
    $email          = isset($_POST['email']) ? trim($_POST['email']) : '';
    $website        = isset($_POST['website']) ? trim($_POST['website']) : '';
    $bannerColor    = isset($_POST['bannerColor']) ? trim($_POST['bannerColor']) : '';
    $bannerFontSize = isset($_POST['bannerFontSize']) ? intval($_POST['bannerFontSize']) : 32;
    $bannerGradient = isset($_POST['bannerGradient']) ? intval($_POST['bannerGradient']) : 0;
    $logoUrl        = isset($_POST['logoUrl']) ? trim($_POST['logoUrl']) : '';

    // 2. Handle Logo Upload
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath   = $_FILES['logo']['tmp_name'];
        $fileName      = $_FILES['logo']['name'];
        $fileSize      = $_FILES['logo']['size'];
        
        $fileNameParts = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameParts));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (in_array($fileExtension, $allowedExtensions)) {
            $uploadDir = './uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $secureFileName = 'logo_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
            $destinationPath = $uploadDir . $secureFileName;
            
            if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                $logoUrl = 'php_backend/uploads/' . $secureFileName;
            }
        }
    }

    // 3. Try to dynamically check schema or insert/update table `school_settings`
    try {
        $pdo->query("SELECT 1 FROM school_settings LIMIT 1");
    } catch (PDOException $e) {
        // Table doesn't exist, let's create it dynamically to be super safe and reliable!
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
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        $pdo->exec($createTableSql);
    }

    // Check if there is any row in school_settings
    $stmt = $pdo->query("SELECT id FROM school_settings LIMIT 1");
    $row = $stmt->fetch();

    if ($row) {
        // Update existing row
        $sql = "UPDATE school_settings SET 
                siteNameBn = :siteNameBn,
                siteNameEn = :siteNameEn,
                addressBn = :addressBn,
                addressEn = :addressEn,
                eiin = :eiin,
                foundedYear = :foundedYear,
                helpline = :helpline,
                email = :email,
                website = :website,
                bannerColor = :bannerColor,
                bannerFontSize = :bannerFontSize,
                bannerGradient = :bannerGradient,
                logoUrl = :logoUrl
                WHERE id = :id";
        $stmtUpdate = $pdo->prepare($sql);
        $stmtUpdate->execute([
            ':siteNameBn'     => $siteNameBn,
            ':siteNameEn'     => $siteNameEn,
            ':addressBn'      => $addressBn,
            ':addressEn'      => $addressEn,
            ':eiin'           => $eiin,
            ':foundedYear'    => $foundedYear,
            ':helpline'       => $helpline,
            ':email'          => $email,
            ':website'        => $website,
            ':bannerColor'    => $bannerColor,
            ':bannerFontSize' => $bannerFontSize,
            ':bannerGradient' => $bannerGradient,
            ':logoUrl'        => $logoUrl,
            ':id'             => $row['id']
        ]);
    } else {
        // Insert new row
        $sql = "INSERT INTO school_settings (siteNameBn, siteNameEn, addressBn, addressEn, eiin, foundedYear, helpline, email, website, bannerColor, bannerFontSize, bannerGradient, logoUrl) 
                VALUES (:siteNameBn, :siteNameEn, :addressBn, :addressEn, :eiin, :foundedYear, :helpline, :email, :website, :bannerColor, :bannerFontSize, :bannerGradient, :logoUrl)";
        $stmtInsert = $pdo->prepare($sql);
        $stmtInsert->execute([
            ':siteNameBn'     => $siteNameBn,
            ':siteNameEn'     => $siteNameEn,
            ':addressBn'      => $addressBn,
            ':addressEn'      => $addressEn,
            ':eiin'           => $eiin,
            ':foundedYear'    => $foundedYear,
            ':helpline'       => $helpline,
            ':email'          => $email,
            ':website'        => $website,
            ':bannerColor'    => $bannerColor,
            ':bannerFontSize' => $bannerFontSize,
            ':bannerGradient' => $bannerGradient,
            ':logoUrl'        => $logoUrl
        ]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Settings and banner parameters saved successfully to school_settings database table!',
        'settings' => [
            'siteNameBn' => $siteNameBn,
            'siteNameEn' => $siteNameEn,
            'logoUrl' => $logoUrl
        ]
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
