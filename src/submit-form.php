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
// Domain-only addresses are common in Growth Audit enquiries. Normalize on the
// server too, so browsers without JS and direct form posts follow the same rules.
function normalize_website_link(string $value): ?string {
    if ($value === '') return '';
    if (preg_match('/\\s/u', $value) || preg_match('/[\\x00-\\x1F\\x7F]/', $value) || strpos($value, '//') === 0) return null;
    if (!preg_match('~^https?://~i', $value)) {
        if (preg_match('~^[a-z][a-z0-9+.-]*:~i', $value)) return null;
        $value = 'https://' . $value;
    }
    if (!filter_var($value, FILTER_VALIDATE_URL)) return null;
    $parts = parse_url($value);
    if (!is_array($parts) || !isset($parts['host'], $parts['scheme'])) return null;
    if (!in_array(strtolower((string)$parts['scheme']), ['http', 'https'], true)) return null;
    if (isset($parts['user']) || isset($parts['pass'])) return null;
    $host = (string)$parts['host'];
    if (strpos($host, '.') === false || !filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME)) return null;
    $segments = explode('.', $host);
    $tld = end($segments);
    if (!is_string($tld) || strlen($tld) < 2 || !preg_match('/[a-z]/i', $tld)) return null;
    return $value;
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

// Public config exposes the site key only. Both values must be configured on
// the server before Turnstile is activated. Never put the secret in Git.
$turnstileSiteKey = trim((string)(getenv('GYANART_TURNSTILE_SITE_KEY') ?: ''));
$turnstileSecret = trim((string)(getenv('GYANART_TURNSTILE_SECRET') ?: ''));
// cPanel fallback: place this private file ONE directory above public_html.
// It must not be committed to Git or placed in the public web directory.
$privateConfigPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'gyanart-turnstile-config.php';
if (is_file($privateConfigPath)) {
    $privateConfig = require $privateConfigPath;
    if (is_array($privateConfig)) {
        $turnstileSiteKey = trim((string)($privateConfig['site_key'] ?? $turnstileSiteKey));
        $turnstileSecret = trim((string)($privateConfig['secret_key'] ?? $turnstileSecret));
    }
}
$turnstileEnabled = $turnstileSiteKey !== '' && $turnstileSecret !== '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && ($_GET['turnstile_config'] ?? '') === '1') {
    respond(200, ['enabled' => $turnstileEnabled, 'siteKey' => $turnstileEnabled ? $turnstileSiteKey : '']);
}

function turnstile_passes(string $secret): bool {
    $token = $_POST['cf-turnstile-response'] ?? '';
    if (!is_string($token) || $token === '' || strlen($token) > 2048) return false;
    if (!function_exists('curl_init')) return false;
    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => (string)($_SERVER['REMOTE_ADDR'] ?? ''),
    ]);
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    if ($ch === false) return false;
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 9,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $result = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (!is_string($result) || $httpCode !== 200) return false;
    $data = json_decode($result, true);
    // Check the expected host so tokens issued for a different website fail.
    return is_array($data)
        && ($data['success'] ?? false) === true
        && strtolower((string)($data['hostname'] ?? '')) === 'www.gyanart.com';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Please submit the form on the website.']);
}

// Honeypot: legitimate visitors should never see or complete this field.
if (field('website_confirm', 200) !== '') {
    respond(200, ['success' => true, 'message' => 'Thank you.']);
}

// Use timing as a lightweight bot signal, not as a hard requirement.
// Missing/old timestamps can occur with disabled JavaScript or a long-open tab;
// reject only a supplied timestamp that indicates an unrealistically fast submit.
$started = filter_var($_POST['form_started_at'] ?? null, FILTER_VALIDATE_INT);
if ($started !== false && $started !== null && $started > 0) {
    $elapsed = time() - (int)floor($started / 1000);
    if ($elapsed >= 0 && $elapsed < 3) {
        respond(422, ['success' => false, 'message' => 'Please take a moment to review the form and try again.']);
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
$promoOptIn = field('promo_opt_in', 10) === 'yes';

if (!in_array($type, ['contact', 'audit', 'offer'], true)) {
    respond(400, ['success' => false, 'message' => 'This form could not be identified. Please refresh the page and try again.']);
}
if ($name === '' || $mobile === '' || ($type !== 'offer' && $email === '') || ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL))) {
    respond(422, ['success' => false, 'message' => 'Please complete the required fields with a valid email address.']);
}
if ($type === 'contact' && $message === '') {
    respond(422, ['success' => false, 'message' => 'Please tell us briefly how we can help.']);
}
if (in_array($type, ['audit', 'offer'], true) && $business === '') {
    respond(422, ['success' => false, 'message' => 'Please enter your business name to request the audit.']);
}
$normalizedWebsite = normalize_website_link($website);
if ($normalizedWebsite === null) {
    respond(422, ['success' => false, 'message' => 'Please enter a valid website such as gyanart.com or a Google Maps link.']);
}
$website = $normalizedWebsite; // Save a complete, clickable URL in the enquiry email.
// Reject unverified submissions before sending any owner or customer emails.
if ($turnstileEnabled && !turnstile_passes($turnstileSecret)) {
    respond(422, ['success' => false, 'message' => 'Security verification failed or expired. Please try again, or email info@gyanart.com.']);
}
if (!rate_limit_passes()) {
    respond(429, ['success' => false, 'message' => 'Too many submissions were received from this connection. Please wait 15 minutes before trying again, or email info@gyanart.com.']);
}

$recipient = 'info@gyanart.com';
$sender = 'info@gyanart.com';
$replyEmail = clean_header($email !== '' ? $email : $sender);
$subject = $type === 'audit'
    ? 'New free growth audit request — ' . clean_header($business)
    : ($type === 'offer' ? '₹4,999 Starter Website offer enquiry — ' . clean_header($business) : 'New website enquiry — ' . clean_header($name));

$details = [
    'Form: ' . ($type === 'audit' ? 'Free Growth Audit' : ($type === 'offer' ? '₹4,999 Starter Website Offer' : 'Contact enquiry')),
    'Name: ' . $name,
    'Business: ' . ($business !== '' ? $business : 'Not provided'),
    'Email: ' . $email,
    'Mobile: ' . $mobile,
    'Website / Google Maps: ' . ($website !== '' ? $website : 'Not provided'),
    'Message: ' . ($message !== '' ? $message : 'Not provided'),
    'Audit goal: ' . ($goal !== '' ? $goal : 'Not provided'),
    'Optional marketing opt-in: ' . ($type === 'offer' ? ($promoOptIn ? 'YES, explicitly checked' : 'NO') : 'Not requested'),
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
} elseif ($type === 'offer') {
    $confirmationSubject = 'We received your Starter Website enquiry | GyanArt';
    $confirmationBody = "Hi " . $name . ",\n\nThank you for asking about the ₹4,999 Starter Website offer. I’ve received your details and will get in touch to discuss what your business needs, what the setup includes and any separately payable third-party costs.\n\nThere is no mandatory monthly subscription with this offer. No project is confirmed until we agree the scope and terms.\n\nRegards,\nGyanArt\ninfo@gyanart.com";
    $successMessage = 'Thanks! Your ₹4,999 Starter Website enquiry has been sent. We’ll contact you to discuss the next steps.';
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

if ($email !== '' && !mail($email, $confirmationSubject, $confirmationBody, $confirmationHeaderString)) {
    // The owner notification has already been accepted above. Do not report
    // a failed enquiry (or trigger a visitor retry) just because the optional
    // customer confirmation could not be sent.
    error_log('GyanArt form: confirmation email failed for ' . $type . ' form');
    $successMessage = 'Your enquiry was submitted, but we could not send a confirmation email. We’ll contact you directly; you can also email info@gyanart.com.';
}

$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
if (stripos($accept, 'application/json') !== false || strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'xmlhttprequest') {
    respond(200, ['success' => true, 'message' => $successMessage]);
}
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
$pageTitle = $type === 'audit' ? 'Growth audit request submitted' : ($type === 'offer' ? 'Starter Website enquiry submitted' : 'Contact form submitted');
$returnPage = $type === 'audit' ? 'growth-audit.html' : ($type === 'offer' ? 'starter-website-offer.html#offer-enquiry' : 'contact.html');
$safeTitle = htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8');
$safeMessage = htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8');
echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $safeTitle . ' | GyanArt</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f8f8f6;color:#202421;font:16px/1.6 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.card{box-sizing:border-box;width:min(560px,calc(100% - 32px));padding:32px;border:1px solid #b8e7d3;border-radius:18px;background:#fff;box-shadow:0 16px 48px #18251b12}.mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#e8f7f0;color:#116149;font-size:25px}.card h1{font-size:25px;margin:18px 0 8px}.card p{margin:0 0 22px}.button{display:inline-block;padding:11px 17px;border-radius:9px;background:#173d32;color:#fff;text-decoration:none;font-weight:650}</style></head><body><main class="card"><div class="mark" aria-hidden="true">✓</div><h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p><a class="button" href="' . htmlspecialchars($returnPage, ENT_QUOTES, 'UTF-8') . '">Return to the form</a></main></body></html>';
exit;
