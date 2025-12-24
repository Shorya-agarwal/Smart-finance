from playwright.sync_api import sync_playwright, expect
import time

def verify_financial_health(page):
    # 1. Navigate to the app
    page.goto("http://127.0.0.1:5173")

    # 2. Wait for the app to load
    page.wait_for_selector("text=SmartFinance")

    # 3. Create an Alert Threshold
    # Fill category and amount
    # Use specific selector to avoid ambiguity
    page.select_option("select", "Food")
    page.fill("input[placeholder='e.g., 100.00']", "50")
    page.click("button:has-text('Set Threshold')")

    # Wait for the alert to appear in the list
    expect(page.locator(".bg-slate-50").filter(has_text="Food").first).to_be_visible()

    # 4. Create a Transaction that breaches the threshold
    # The transaction must be categorized as "Food" for the alert to trigger.
    # The backend uses an AI service (which might fail) or a local fallback.
    # "Expensive Dinner" might not match "food", "burger", etc in local fallback.
    # Let's use a description that definitely hits the "Food" fallback: "steak dinner".

    page.fill("input[placeholder='e.g. Starbucks, Uber, Rent']", "Big steak dinner")
    page.fill("input[placeholder='0.00']", "100")
    page.click("button:has-text('Add Transaction')")

    # 5. Verify the Alert Notification
    # Expect "Incident Response Triggered" or similar text
    try:
        expect(page.locator("text=Incident Response Triggered")).to_be_visible(timeout=10000)
    except Exception as e:
        print("Alert notification not found. Check if transaction category was 'Food'.")
        # print(page.content())
        raise e

    # Verify Health Status changed to "Anomalies Detected"
    expect(page.locator("text=Anomalies Detected")).to_be_visible()

    # 6. Screenshot
    time.sleep(1) # Allow animations
    page.screenshot(path="/home/jules/verification/financial_health.png")
    print("Screenshot taken at /home/jules/verification/financial_health.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_financial_health(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()
