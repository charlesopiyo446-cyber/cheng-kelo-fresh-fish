<?php

function respond(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function respondError(string $message, int $status = 400): void {
    respond(['error' => $message], $status);
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function getMethod(): string {
    return $_SERVER['REQUEST_METHOD'];
}

function getSegment(int $index): ?string {
    $path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
    $parts = explode('/', $path);
    // find 'api' segment and return relative to it
    $apiPos = array_search('api', $parts);
    if ($apiPos === false) return null;
    // index 0 = resource, index 1 = id (relative to 'api')
    return $parts[$apiPos + $index] ?? null;
}
