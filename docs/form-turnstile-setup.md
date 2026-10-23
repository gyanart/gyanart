# GyanArt enquiry spam protection — Cloudflare Turnstile

## Existing layers
The PHP endpoint `src/submit-form.php` already has a honeypot, field validation, bot timing checks and a 5-submissions/15-minutes/IP rate limit. Turnstile is **additional** protection. Form types `contact`, `audit` and `offer` use the same handler, including Hindi/Kannada equivalents.

## Activate in cPanel (do not put secrets in GitHub)
1. In [Cloudflare Turnstile](https://dash.cloudflare.com/), create a **Managed** widget. Add **www.gyanart.com** (and optionally `gyanart.com`) as authorized hostnames. Get its **site key** and **secret key**. Never send the secret in chat or commit it.
2. In cPanel File Manager, navigate **one level above the domain's actual `public_html` document root** (usually `/home/CPANEL_USER/`). Create a private PHP file named `gyanart-turnstile-config.php`, permissions 0600 or 0640 where supported, containing:
   ```php
   <?php
   return [
       'site_key' => 'PASTE_PUBLIC_SITE_KEY',
       'secret_key' => 'PASTE_PRIVATE_SECRET_KEY',
   ];
   ```
   **Important:** Do NOT place this file under `public_html`, `dist`, or the GitHub repo. In this deployment, `submit-form.php` must live at `public_html/submit-form.php` so `dirname(__DIR__)` resolves to the directory where that private file is stored. If the domain document root differs, use PHP environment variables `GYANART_TURNSTILE_SITE_KEY` and `GYANART_TURNSTILE_SECRET` instead, or adjust the private path safely outside the document root.
3. After the updated GitHub `main` deploy succeeds, visit `https://www.gyanart.com/submit-form.php?turnstile_config=1`. Before private configuration, it must return `{"enabled":false,"siteKey":""}`. After setting the keys it should return `{"enabled":true,"siteKey":"<public site key>"}`. This endpoint **never returns the secret key**.
4. Reload `/contact.html`, `/growth-audit.html`, and `/starter-website-offer.html` in a private window. If configured, the Cloudflare verification should appear near the Send button when required. It may complete automatically. **Do not submit real customer details into Cloudflare's test widget keys.**

## Post-deployment test plan
- **Without keys:** Confirm legitimate forms still submit as before. Existing honeypot, validation and rate limiting remain in place.
- **After keys:** On each of Contact, Growth Audit and Starter Offer, complete verification, submit one clearly labelled **TEST** enquiry with your own email/phone, and confirm (a) the success message, (b) one owner email and (c) optional customer confirmation email. Do not send five tests inside 15 minutes from the same IP; the existing rate limit is five.
- **No token:** Using a test-only terminal or browser network tool, POST valid-looking fields to the PHP endpoint with no `cf-turnstile-response`. After activation this should return HTTP 422 with a security-verification error and **no email**. Avoid submitting actual customer data.
- **Invalid/expired/replayed token:** Should fail HTTP 422 and send no email. Use a fresh form verification when retrying.
- **Honeypot filled:** Existing behaviour is a generic 200 response **without** sending an email (intentionally avoids telling bots their detection rule).
- **Invalid fields:** HTTP 422, no email. **Rate limit:** HTTP 429 after threshold; test in a controlled environment, not on production during client enquiries.
- **Fallback:** If Cloudflare cannot load, show a helpful error with `info@gyanart.com`; never silently claim the enquiry succeeded. Check the form at 320px and 390px mobile widths and with keyboard-only navigation.
- **No duplicate leads:** Validate that GA4 `generate_lead` fires only after the server acknowledges a submitted enquiry.
- If email is still flooded after Turnstile activation, inspect server logs and mailbox filtering separately.

## Rollback
Remove or rename the **private** `gyanart-turnstile-config.php` (or unset both environment variables) to disable Turnstile while leaving existing checks intact. The JavaScript automatically stops showing the widget once the config endpoint returns disabled after refreshing the page. This is an emergency fallback, not an ideal long-term operating mode.

## Security boundaries
- Never trust a client-side widget alone; PHP calls Cloudflare Siteverify with the secret, token, visitor IP and validates success **plus hostname `www.gyanart.com`**, before either notification email is sent.
- Turnstile tokens expire and cannot be reused; tokens are reset after a failed submission and after success.
- Do not log Turnstile tokens or the private secret.
- The check cannot be confirmed as active until actual cPanel keys are configured and **server-side invalid token rejection** is observed.
