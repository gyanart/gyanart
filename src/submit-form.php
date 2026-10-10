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

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Please submit the form on the website.']);
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
    'X-Mailer' => 'PHP/' . phpversion()
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
    'X-Mailer' => 'PHP/' . phpversion()
];
$confirmationHeaderString = '';
foreach ($confirmationHeaders as $key => $value) $confirmationHeaderString .= $key . ': ' . $value . "\r\n";

if (!mail($email, $confirmationSubject, $confirmationBody, $confirmationHeaderString)) {
    error_log('GyanArt form: confirmation email failed for ' . $type . ' form; sender email ' . $email);
    respond(500, ['success' => false, 'message' => 'Your request reached GyanArt, but the confirmation email could not be sent. We’ll follow up within 24–48 hours; you can also reach us at info@gyanart.com.']);
}

respond(200, ['success' => true, 'message' => $successMessage]);
