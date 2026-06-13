from playwright.sync_api import sync_playwright

def verify_component(page):
    # Navigate to the component preview page
    page.goto("http://localhost:3000/components/chromatic-slice-card")
    page.wait_for_load_state('networkidle')

    # Take screenshot of default state
    page.screenshot(path="verification_default.png")

    # Force hover to bypass the interception overlay
    card = page.locator("h2:has-text('VOID')").first
    if card:
        card.hover(force=True)
        page.wait_for_timeout(1000) # Wait for animation
        page.screenshot(path="verification_hover.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_component(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
