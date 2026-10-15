<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function field(string $key, int $max = 3000): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) return '';
    $value = trim(str_replace("\0", '', $value));
    return mb_substr($value, 0, $max, 'UTF-8');
}
function clean_header(string $value): string {
    return str_replace(["\r", "\n"], '', $value);
}
function rate_limit_passes(): bool {
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = hash('sha256', 'gyanart-form-v1|' . $ip);
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'gyanart-form-' . $key . '.json';
    $now = time();
    $window = 900; // 15 minutes
    $limit = 5;    // maximum submissions per IP per window
    $fp = @fopen($path, 'c+');
    if ($fp === false) return true; // Do not block all genuine leads if temporary storage is unavailable.
    try {
        if (!flock($fp, LOCK_EX)) return true;
        $raw = stream_get_contents($fp);
        $times = json_decode(is_string($raw) ? $raw : '', true);
        if (!is_array($times)) $times = [];
        $times = array_values(array_filter($times, static fn($t) => is_int($t) && $t > $now - $window));
        if (count($times) >= $limit) return false;
        $times[] = $now;
        rewind($fp);
        ftruncate($fp, 0);
        fwrite($fp, json_encode($times));
        fflush($fp);
        return true;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Please submit the form on the website.']);
}

// Honeypot: legitimate visitors should never see or complete this field.
if (field('website_confirm', 200) !== '') {
    respond(200, ['success' => true, 'message' => 'Thank you.']);
}

// Use form timing as a lightweight bot deterrent, not as a requirement for genuine leads.
// Older tabs can remain open for hours, and cached pages may omit this optional field.
$started = filter_var($_POST['form_started_at'] ?? null, FILTER_VALIDATE_INT);
if ($started !== false && $started !== null && $started !== '') {
    $elapsed = time() - (int)floor((int)$started / 1000);
    if ($elapsed < 3) {
        respond(422, ['success' => false, 'message' => 'Please wait a moment before submitting the form.']);
    }
}

$type = field('form_type', 20);
$name = field('name', 150);
$business = field('business', 200);
$email = field('email', 254);
$mobile = field('mobile', 40);
$website = field('website', 500);
$message = field('message', 5000);
$goal = field('goal', 3000);

if (!in_array($type, ['contact', 'audit'], true)) {
    respond(400, ['success' => false, 'message' => 'This form could not be identified. Please refresh the page and try again.']);
}
if ($name === '' || $email === '' || $mobile === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['success' => false, 'message' => 'Please complete the required fields with a valid email address.']);
}
if ($type === 'contact' && $message === '') {
    respond(422, ['success' => false, 'message' => 'Please tell us briefly how we can help.']);
}
if ($type === 'audit' && $business === '') {
    respond(422, ['success' => false, 'message' => 'Please enter your business name to request the audit.']);
}
if ($website !== '' && (!filter_var($website, FILTER_VALIDATE_URL) || !in_array(strtolower((string)parse_url($website, PHP_URL_SCHEME)), ['http', 'https'], true))) {
    respond(422, ['success' => false, 'message' => 'Please enter a valid website or Google Maps URL starting with https://.']);
}
if (!rate_limit_passes()) {
    respond(429, ['success' => false, 'message' => 'Too many submissions were received from this connection. Please wait 15 minutes before trying again, or email info@gyanart.com.']);
}

$recipient = 'info@gyanart.com';
$sender = 'info@gyanart.com';
$replyEmail = clean_header($email);
$subject = $type === 'audit'
    ? 'New free growth audit request — ' . clean_header($business)
    : 'New website enquiry — ' . clean_header($name);

$details = [
    'Form: ' . ($type === 'audit' ? 'Free Growth Audit' : 'Contact enquiry'),
    'Name: ' . $name,
    'Business: ' . ($business !== '' ? $business : 'Not provided'),
    'Email: ' . $email,
    'Mobile: ' . $mobile,
    'Website / Google Maps: ' . ($website !== '' ? $website : 'Not provided'),
    'Message: ' . ($message !== '' ? $message : 'Not provided'),
    'Audit goal: ' . ($goal !== '' ? $goal : 'Not provided'),
    '',
    'Received from gyanart.com'
];
$headers = [
    'From' => 'GyanArt <' . $sender . '>',
    'Reply-To' => $replyEmail,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'GyanArt website form'
];
$headerString = '';
foreach ($headers as $key => $value) $headerString .= $key . ': ' . $value . "\r\n";

if (!mail($recipient, $subject, implode("\n", $details), $headerString)) {
    error_log('GyanArt form: internal notification email failed for form type ' . $type);
    respond(500, ['success' => false, 'message' => 'Your request could not be sent right now. Please email info@gyanart.com and we’ll help you directly.']);
}

if ($type === 'audit') {
    $confirmationSubject = 'We’ve received your GyanArt Growth Audit request';
    $confirmationBody = "Hi " . $name . ",\n\nThank you for requesting a free GyanArt Growth Audit. I’ve received your details and will review your website and Google presence. I’ll get back to you within 24–48 hours with the next steps for your audit.\n\nThere’s no obligation to purchase a service.\n\nRegards,\nGyanArt\ninfo@gyanart.com";
    $successMessage = 'Successfully sent! Thank you for requesting your free growth audit. We’ll email you within 24–48 hours with the next steps.';
} else {
    $confirmationSubject = 'Thank you for contacting GyanArt';
    $confirmationBody = "Hi " . $name . ",\n\nThank you for contacting GyanArt. I’ve received your enquiry and will review the details. I’ll get back to you within 24–48 hours.\n\nIf there’s anything else you’d like to share, you can reply to this email.\n\nRegards,\nGyanArt\ninfo@gyanart.com";
    $successMessage = 'Successfully sent! Thank you for contacting GyanArt. We’ll get back to you within 24–48 hours.';
}
$confirmationHeaders = [
    'From' => 'GyanArt <' . $sender . '>',
    'Reply-To' => $sender,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'GyanArt website form'
];
$confirmationHeaderString = '';
foreach ($confirmationHeaders as $key => $value) $confirmationHeaderString .= $key . ': ' . $value . "\r\n";

if (!mail($email, $confirmationSubject, $confirmationBody, $confirmationHeaderString)) {
    error_log('GyanArt form: confirmation email failed for ' . $type . ' form');
    respond(500, ['success' => false, 'message' => 'Your request reached GyanArt, but the confirmation email could not be sent. We’ll follow up within 24–48 hours; you can also reach us at info@gyanart.com.']);
}

$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
if (stripos($accept, 'application/json') !== false || strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'xmlhttprequest') {
    respond(200, ['success' => true, 'message' => $successMessage]);
}
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
$pageTitle = $type === 'audit' ? 'Growth audit request submitted' : 'Contact form submitted';
$returnPage = $type === 'audit' ? 'growth-audit.html' : 'contact.html';
$safeTitle = htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8');
$safeMessage = htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8');
echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $safeTitle . ' | GyanArt</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f8f8f6;color:#202421;font:16px/1.6 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.card{box-sizing:border-box;width:min(560px,calc(100% - 32px));padding:32px;border:1px solid #b8e7d3;border-radius:18px;background:#fff;box-shadow:0 16px 48px #18251b12}.mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#e8f7f0;color:#116149;font-size:25px}.card h1{font-size:25px;margin:18px 0 8px}.card p{margin:0 0 22px}.button{display:inline-block;padding:11px 17px;border-radius:9px;background:#173d32;color:#fff;text-decoration:none;font-weight:650}</style></head><body><main class="card"><div class="mark" aria-hidden="true">✓</div><h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p><a class="button" href="' . htmlspecialchars($returnPage, ENT_QUOTES, 'UTF-8') . '">Return to the form</a></main></body></html>';
exit;
