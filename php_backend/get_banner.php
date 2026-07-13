<?php
/**
 * Secure School Banner & Settings Fetch Handler (get_banner.php)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    // Check if the table exists
    $tableExists = true;
    try {
        $pdo->query("SELECT 1 FROM school_settings LIMIT 1");
    } catch (PDOException $e) {
        $tableExists = false;
    }

    if ($tableExists) {
        // Automatically check/create sliderJson column if it doesn't exist
        try {
            $pdo->query("SELECT sliderJson FROM school_settings LIMIT 1");
        } catch (PDOException $e) {
            try {
                $pdo->exec("ALTER TABLE school_settings ADD COLUMN sliderJson LONGTEXT NULL");
            } catch (PDOException $ex) {}
        }

        $stmt = $pdo->query("SELECT * FROM school_settings LIMIT 1");
        $settings = $stmt->fetch();
        
        if ($settings) {
            // Found settings in database, format and return them
            $sliderData = null;
            if (!empty($settings['sliderJson'])) {
                $sliderData = json_decode($settings['sliderJson'], true);
            }
            
            echo json_encode([
                'status' => 'success',
                'settings' => [
                    'siteNameBn' => $settings['siteNameBn'],
                    'siteNameEn' => $settings['siteNameEn'],
                    'addressBn' => $settings['addressBn'],
                    'addressEn' => $settings['addressEn'],
                    'eiin' => $settings['eiin'],
                    'foundedYear' => $settings['foundedYear'],
                    'helpline' => $settings['helpline'],
                    'email' => $settings['email'],
                    'website' => $settings['website'],
                    'bannerColor' => $settings['bannerColor'],
                    'bannerFontSize' => intval($settings['bannerFontSize']),
                    'bannerGradient' => intval($settings['bannerGradient']) === 1,
                    'logoUrl' => $settings['logoUrl']
                ],
                'slider' => $sliderData
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }

    // Default fallback values if table or record does not exist yet
    echo json_encode([
        'status' => 'default',
        'settings' => [
            'siteNameBn' => "স্টুডেন্টস কেয়ার মডেল স্কুল",
            'siteNameEn' => "Students Care Model School",
            'addressBn' => "কর্ণফুলী, চট্টগ্রাম",
            'addressEn' => "Karnafuli, Chattogram",
            'eiin' => "134256",
            'foundedYear' => "২০১৫",
            'helpline' => "01812-345678",
            'email' => "info@studentscaremodel.edu.bd",
            'website' => "www.studentscaremodel.edu.bd",
            'bannerColor' => "#1E63D3",
            'bannerFontSize' => 32,
            'bannerGradient' => true,
            'logoUrl' => ""
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
