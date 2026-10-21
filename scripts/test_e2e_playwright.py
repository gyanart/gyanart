import asyncio
from playwright.async_api import async_playwright

async def run_tests():
    print("="*70)
    print("3. RUNNING PLAYWRIGHT E2E INTERACTION & CONSOLE ERROR TEST")
    print("="*70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        console_errors = []
        page_errors = []
        
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error"] else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        
        # Test 1: Homepage & Theme Switcher
        print("\n[Test 1] Testing Homepage & Theme Toggle...")
        await page.goto("http://localhost:3000/index.html", wait_until="networkidle")
        initial_theme = await page.evaluate("document.documentElement.getAttribute('data-theme')")
        print(f"  Initial theme: {initial_theme}")
        
        theme_btn = await page.query_selector(".theme-toggle-desktop")
        if theme_btn:
            await theme_btn.click()
            new_theme = await page.evaluate("document.documentElement.getAttribute('data-theme')")
            print(f"  Toggled theme: {new_theme}")
            assert new_theme != initial_theme, "Theme toggle did not change theme"
            # toggle back
            await theme_btn.click()
            restored_theme = await page.evaluate("document.documentElement.getAttribute('data-theme')")
            print(f"  Restored theme: {restored_theme}")
            assert restored_theme == initial_theme, "Theme toggle did not restore theme"
            print("  ✓ Theme Toggle PASSED")
        else:
            print("  ! Theme toggle button not found")

        # Test 2: FAQ Accordion
        print("\n[Test 2] Testing FAQ Accordion...")
        faq_btn = await page.query_selector(".faq-item button")
        if faq_btn:
            is_expanded_before = await faq_btn.get_attribute("aria-expanded")
            await faq_btn.click()
            is_expanded_after = await faq_btn.get_attribute("aria-expanded")
            print(f"  FAQ aria-expanded before: {is_expanded_before}, after: {is_expanded_after}")
            assert is_expanded_after == "true", "FAQ button did not expand"
            await faq_btn.click()
            print("  ✓ FAQ Accordion PASSED")

        # Test 3: Language Menu
        print("\n[Test 3] Testing Language Menu Dropdown...")
        lang_toggle = await page.query_selector(".language-toggle")
        if lang_toggle:
            await lang_toggle.click()
            menu = await page.query_selector(".language-menu")
            is_hidden = await menu.get_attribute("hidden")
            print(f"  Language menu hidden attribute after click: {is_hidden}")
            assert is_hidden is None or is_hidden == "false", "Language menu did not open"
            print("  ✓ Language Menu PASSED")

        # Test 4: Pricing Page
        print("\n[Test 4] Testing Pricing Page (/pricing.html)...")
        await page.goto("http://localhost:3000/pricing.html", wait_until="networkidle")
        title = await page.title()
        print(f"  Pricing title: {title}")
        cards = await page.query_selector_all(".price-card")
        print(f"  Price cards found: {len(cards)}")
        assert len(cards) == 3, f"Expected 3 pricing cards, found {len(cards)}"
        print("  ✓ Pricing Page PASSED")

        # Test 5: Growth Audit Page & Form Validation
        print("\n[Test 5] Testing Growth Audit Page (/growth-audit.html)...")
        await page.goto("http://localhost:3000/growth-audit.html", wait_until="networkidle")
        form = await page.query_selector("form[data-email-form]")
        assert form is not None, "Form not found on growth audit page"
        honeypot = await page.query_selector("input[name='website_confirm']")
        assert honeypot is not None, "Honeypot input not found"
        print("  ✓ Growth Audit Form Structure PASSED")

        # Test 6: 404 Page
        print("\n[Test 6] Testing 404 Error Page (/404.html)...")
        await page.goto("http://localhost:3000/404.html", wait_until="networkidle")
        h1 = await page.inner_text("h1")
        print(f"  404 H1: {h1}")
        home_link = await page.query_selector("a[href='index.html']")
        assert home_link is not None, "Return home link not found on 404 page"
        print("  ✓ 404 Page PASSED")

        print("\n" + "="*70)
        print("CONSOLE ERROR AUDIT SUMMARY:")
        print(f"  Page errors (uncaught exceptions): {len(page_errors)}")
        print(f"  Console errors: {len(console_errors)}")
        for ce in console_errors:
            print(f"    - {ce}")
        for pe in page_errors:
            print(f"    - {pe}")
        print("="*70)
        
        assert len(page_errors) == 0, "Page errors detected"
        assert len(console_errors) == 0, "Console errors detected"
        print("ALL E2E & RUNTIME BEHAVIOR TESTS PASSED WITH 0 ERRORS!")
        
        await browser.close()

asyncio.run(run_tests())
