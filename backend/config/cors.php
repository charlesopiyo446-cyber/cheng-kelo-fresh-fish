<?php

function setCorsHeaders(): void {
    static $called = false;
    if ($called) return;
    $called = true;

    // Allow any localhost port (covers 5173, 5174, etc.)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (preg_match('#^http://localhost(:\d+)?$#', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header('Access-Control-Allow-Origin: http://localhost:5173');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
