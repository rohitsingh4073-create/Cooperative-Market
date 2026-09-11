import urllib.request
import json

BASE_URL = "http://127.0.0.1:5000"

def post_json(path, data):
    req = urllib.request.Request(
        BASE_URL + path,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_json(path):
    with urllib.request.urlopen(BASE_URL + path) as resp:
        return json.loads(resp.read().decode("utf-8"))

print("=== Testing 4 New Feature Endpoints ===")

# 1. SUBSCRIPTION PLANS (Idea #3)
res = get_json("/subscriptions/plans")
assert res["success"] and len(res["plans"]) >= 3
print(f"[PASS] Retrieved {len(res['plans'])} subscription maintenance plans:")
for p in res["plans"]:
    print(f"       - {p['title']} ({', '.join(p['services'])}): Rs. {p['price_monthly']}/mo")

# Subscribe customer C001
sub_payload = {
    "customer_id": "C001",
    "plan_id": "sub_dual_shield",
    "billing_cycle": "annual"
}
res = post_json("/subscriptions/subscribe", sub_payload)
assert res["success"] and res["subscription"]["status"] == "ACTIVE"
sub_id = res["subscription"]["subscription_id"]
print(f"[PASS] Customer C001 subscribed to plan '{res['subscription']['plan_title']}' (Sub ID: {sub_id})")

# Check customer subscription status
res = get_json("/subscriptions/customer/C001")
assert res["success"] and res["has_active_subscription"]
assert res["active_subscription"]["subscription_id"] == sub_id
print(f"[PASS] Verified customer active subscription with {res['active_subscription']['visits_remaining']} visits remaining")

# 2. BEST WORK PORTFOLIO (Idea #4)
res = get_json("/worker/W001/portfolio")
assert res["success"] and res["total_showcases"] >= 2
print(f"[PASS] Worker W001 portfolio retrieved with {res['total_showcases']} showcase item(s)")

# Worker adds a new project to portfolio
new_portfolio = {
    "title": "Smart Touch Switchboard & Automation Hub",
    "category": "Smart Home",
    "description": "Retrofit 8-gang capacitive glass touch panel with voice control.",
    "tags": ["Smart Touch", "Glass Panel", "Alexa Compatible"]
}
res = post_json("/worker/W001/portfolio", new_portfolio)
assert res["success"] and res["item"]["id"].startswith("PORT-W001")
print(f"[PASS] Added new portfolio showcase project: '{res['item']['title']}' (ID: {res['item']['id']})")

# Verify new item appears in worker portfolio
res = get_json("/worker/W001/portfolio")
assert any(i["title"] == "Smart Touch Switchboard & Automation Hub" for i in res["portfolio"])
print("[PASS] Verified newly added project appears in worker portfolio list")

# 3. BOOKING WITH PROBLEM PHOTO & DIAGNOSTIC NOTES (Idea #5)
sample_base64_photo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150'><rect width='200' height='150' fill='%23ef4444'/><text x='20' y='80' fill='white'>Water Leak</text></svg>"
booking_with_photo = {
    "customer_id": "C001",
    "worker_id": "W002",
    "date": "Tomorrow, 11:00 AM",
    "problem_photo": sample_base64_photo,
    "problem_notes": "Main drainage sink pipe joint is leaking under high water pressure."
}
res = post_json("/book", booking_with_photo)
assert res["success"]
new_b_id = res["booking"]["booking_id"]
assert res["booking"]["problem_photo"] == sample_base64_photo
assert "drainage sink pipe" in res["booking"]["problem_notes"]
print(f"[PASS] Created booking #{new_b_id} with attached problem photo and notes")

# Verify worker receives problem photo & notes in their bookings endpoint
res = get_json("/bookings/worker/W002")
assert res["success"]
found_booking = next((b for b in res["bookings"] if b["booking_id"] == new_b_id), None)
assert found_booking is not None
assert found_booking["problem_photo"] == sample_base64_photo
assert "drainage sink pipe" in found_booking["problem_notes"]
print(f"[PASS] Worker W002 received booking #{new_b_id} containing customer's problem photo and notes")

# 4. RELIABILITY SCORE ENGINE (Idea #8)
res = get_json("/worker/W001/reliability")
assert res["success"]
rel = res["reliability"]
assert 80 <= rel["score"] <= 100
assert rel["tier"] in ["Elite Diamond", "Platinum Verified", "Gold Trusted"]
print(f"[PASS] Worker W001 Reliability Score: {rel['score']}/100 ({rel['tier']})")
print(f"       - Completion Rate: {rel['metrics']['completion_rate']}")
print(f"       - Repeat Customers: {rel['metrics']['repeat_customers']}")
print(f"       - Cancellation Rate: {rel['metrics']['cancellation_rate']}")
print(f"       - Avg Response Time: {rel['metrics']['avg_response_mins']} mins")

# Verify /workers endpoint embeds reliability & portfolio
res = get_json("/workers?all=true")
assert res["success"]
w1 = next(w for w in res["workers"] if w["worker_id"] == "W001")
assert "reliability_score" in w1 and w1["reliability_score"] >= 80
assert "portfolio_count" in w1 and w1["portfolio_count"] >= 3
print(f"[PASS] /workers listing verified: includes reliability_score={w1['reliability_score']} and portfolio_count={w1['portfolio_count']}")

print("\n*** ALL 4 NEW FEATURE ENDPOINTS VALIDATED SUCCESSFULLY! ***")
