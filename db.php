<?php
/**
 * Database Connection Config File
 * Dhaka Academy / Students Care Model School
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "u451653929_admin";
$password = "Cisfa1998$#@";
$dbname = "u451653929_StudentsCare";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}

// Set charset
$conn->set_charset("utf8mb4");

// Auto-create necessary tables
$conn->query("CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `siteNameBn` VARCHAR(255) DEFAULT 'স্টুডেন্টস কেয়ার মডেল স্কুল',
    `siteNameEn` VARCHAR(255) DEFAULT 'Students Care Model School',
    `addressBn` VARCHAR(255) DEFAULT 'কর্ণফুলী, চট্টগ্রাম',
    `addressEn` VARCHAR(255) DEFAULT 'Karnafuli, Chattogram',
    `eiin` VARCHAR(50) DEFAULT '134256',
    `foundedYear` VARCHAR(50) DEFAULT '২০১৫',
    `helpline` VARCHAR(50) DEFAULT '01812-345678',
    `email` VARCHAR(255) DEFAULT 'info@studentscaremodel.edu.bd',
    `website` VARCHAR(255) DEFAULT 'www.studentscaremodel.edu.bd',
    `bannerColor` VARCHAR(50) DEFAULT '#025644',
    `bannerFontSize` INT DEFAULT 32,
    `bannerGradient` TINYINT(1) DEFAULT 1,
    `logoUrl` VARCHAR(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// Seed default settings row if empty
$res = $conn->query("SELECT COUNT(*) as count FROM `settings`");
$row = $res->fetch_assoc();
if ($row['count'] == 0) {
    $conn->query("INSERT INTO `settings` (`siteNameBn`, `siteNameEn`, `addressBn`, `addressEn`, `eiin`, `foundedYear`, `helpline`, `email`, `website`, `bannerColor`, `bannerFontSize`, `bannerGradient`, `logoUrl`) VALUES ('স্টুডেন্টস কেয়ার মডেল স্কুল', 'Students Care Model School', 'কর্ণফুলী, চট্টগ্রাম', 'Karnafuli, Chattogram', '134256', '২০১৫', '01812-345678', 'info@studentscaremodel.edu.bd', 'www.studentscaremodel.edu.bd', '#025644', 32, 1, '')");
}

$conn->query("CREATE TABLE IF NOT EXISTS `slider` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `image` VARCHAR(255) NOT NULL,
    `titleBn` VARCHAR(255) DEFAULT '',
    `titleEn` VARCHAR(255) DEFAULT '',
    `subtitleBn` VARCHAR(255) DEFAULT '',
    `subtitleEn` VARCHAR(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

$conn->query("CREATE TABLE IF NOT EXISTS `students` (
    `sl` INT AUTO_INCREMENT PRIMARY KEY,
    `photo` VARCHAR(255) DEFAULT '',
    `roll` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `class` VARCHAR(100) NOT NULL,
    `section` VARCHAR(50) DEFAULT 'A',
    `guardian` VARCHAR(255) DEFAULT 'N/A',
    `phone` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_roll_class` (`class`, `roll`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1024;");

$conn->query("CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'teacher', 'guardian', 'accountant') NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// Seed initial users if table is empty
$res = $conn->query("SELECT COUNT(*) as count FROM `users`");
$row = $res->fetch_assoc();
if ($row['count'] == 0) {
    $defaultPass = password_hash('password123', PASSWORD_DEFAULT);
    $conn->query("INSERT INTO `users` (`username`, `password`, `role`, `name`) VALUES 
        ('admin', '$defaultPass', 'admin', 'Administrator'),
        ('teacher', '$defaultPass', 'teacher', 'Teacher'),
        ('guardian', '$defaultPass', 'guardian', 'Guardian'),
        ('accountant', '$defaultPass', 'accountant', 'Accountant')
    ");
}
