<?php
/**
 * Secure Student Data Insertion Handler (insert.php)
 * Handles input sanitization, secure file uploads, and parameterized SQL queries to prevent SQL injection.
 */

// Set appropriate response headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle CORS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Accept only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. This endpoint only accepts secure POST requests.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Include secure database connection helper
require_once 'db.php';

try {
    // 1. Inputs Extraction & Sanitization
    $roll     = isset($_POST['roll']) ? trim(filter_var($_POST['roll'], FILTER_DEFAULT)) : '';
    $name     = isset($_POST['name']) ? trim(filter_var($_POST['name'], FILTER_DEFAULT)) : '';
    $class    = isset($_POST['class']) ? trim(filter_var($_POST['class'], FILTER_DEFAULT)) : '';
    $section  = isset($_POST['section']) ? trim(filter_var($_POST['section'], FILTER_DEFAULT)) : '';
    $guardian = isset($_POST['guardian']) ? trim(filter_var($_POST['guardian'], FILTER_DEFAULT)) : '';
    $phone    = isset($_POST['phone']) ? trim(filter_var($_POST['phone'], FILTER_DEFAULT)) : '';

    // Validate Required Fields
    if (empty($roll) || empty($name) || empty($class) || empty($section) || empty($phone)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Validation Failed: Roll, Name, Class, Section, and Phone Number are mandatory fields.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. Secure File Upload Logic for 'photo'
    $photoPath = ''; // Default empty if no photo is uploaded
    
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] !== UPLOAD_ERR_NO_FILE) {
        $fileError = $_FILES['photo']['error'];
        
        // Handle upload errors
        if ($fileError !== UPLOAD_ERR_OK) {
            http_response_code(400);
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds the upload_max_filesize directive in php.ini.',
                UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds the MAX_FILE_SIZE directive specified in the HTML form.',
                UPLOAD_ERR_PARTIAL    => 'The uploaded file was only partially uploaded.',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder for uploading files.',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
                UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload.'
            ];
            echo json_encode([
                'status' => 'error',
                'message' => isset($errorMessages[$fileError]) ? $errorMessages[$fileError] : 'An error occurred during file upload.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $fileTmpPath   = $_FILES['photo']['tmp_name'];
        $fileName      = $_FILES['photo']['name'];
        $fileSize      = $_FILES['photo']['size'];
        
        // Verify File Extension
        $fileNameParts = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameParts));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (!in_array($fileExtension, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid file extension. Only JPG, JPEG, PNG, and WEBP images are permitted.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Verify File Mime Type using server-side analysis (anti-spoofing)
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $detectedMimeType = finfo_file($finfo, $fileTmpPath);
            finfo_close($finfo);
            
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($detectedMimeType, $allowedMimeTypes)) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Suspicious file detected. File type does not match allowed image formats.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        // Enforce 2MB Maximum File Size Limits
        $maxFileSize = 2 * 1024 * 1024; // 2 MB
        if ($fileSize > $maxFileSize) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'File size is too large. Maximum allowed size is 2MB.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Ensure upload directory exists securely
        $uploadDir = './uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Prevent security issues (like file inclusion or path traversal) by generating a random cryptographically safe filename
        $secureFileName = bin2hex(random_bytes(16)) . '.' . $fileExtension;
        $destinationPath = $uploadDir . $secureFileName;

        if (move_uploaded_file($fileTmpPath, $destinationPath)) {
            $photoPath = 'uploads/' . $secureFileName;
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Internal server error: Failed to save the uploaded profile image.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 3. Database Insertion via Secure PDO Prepared Statements
    // Columns map exactly to: sl (auto increment), photo, roll, name, class, section, guardian, phone
    $sql = "INSERT INTO students (photo, roll, name, class, section, guardian, phone) 
            VALUES (:photo, :roll, :name, :class, :section, :guardian, :phone)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':photo'    => $photoPath,
        ':roll'     => $roll,
        ':name'     => $name,
        ':class'    => $class,
        ':section'  => $section,
        ':guardian' => $guardian,
        ':phone'    => $phone
    ]);

    // Return custom success JSON payload
    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Student record has been successfully inserted into the database table!',
        'student' => [
            'name'     => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'roll'     => htmlspecialchars($roll, ENT_QUOTES, 'UTF-8'),
            'class'    => htmlspecialchars($class, ENT_QUOTES, 'UTF-8'),
            'section'  => htmlspecialchars($section, ENT_QUOTES, 'UTF-8'),
            'photo'    => $photoPath ? htmlspecialchars($photoPath, ENT_QUOTES, 'UTF-8') : 'No Photo Uploaded'
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    // Return graceful validation or database constraint messaging
    if ($e->getCode() == '23000') {
        echo json_encode([
            'status' => 'error',
            'message' => 'Integrity constraint violation: This roll number or key might already be taken in this class/section.'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database operation failed: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An unexpected internal error occurred: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
