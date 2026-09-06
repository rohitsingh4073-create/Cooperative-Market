import urllib.request
import json
import time

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

print("=== Starting End-to-End Workflow Test ===")

# 1. Register a new Customer
ts = int(time.time())
cust_mobile = f"99{ts % 100000000:08d}"
cust_data = {
    "full_name": "Minimalist Customer",
    "password": "pass1234",
    "mobile_number": cust_mobile,
    "email": "cust@example.com",
    "address": "123 Minimalist Blvd, Suite 4A",
    "pincode": "560001"
}
res = post_json("/signup/customer", cust_data)
assert res["success"], f"Customer signup failed: {res}"
print(f"[PASS] Customer registered with mobile: {cust_mobile}")

# 2. Register a new Worker
worker_mobile = f"98{ts % 100000000:08d}"
worker_data = {
    "full_name": "Pro Carpenter",
    "password": "work1234",
    "mobile_number": worker_mobile,
    "email": "carpenter@example.com",
    "age": 32,
    "current_address": "45 Industrial Ave",
    "city": "Bengaluru",
    "pincode": "560001",
    "primary_skill": "Carpenter",
    "additional_skills": "Fine cabinetry, Furniture repair",
    "years_of_experience": 8,
    "description": "Master artisan crafting bespoke furniture and woodwork repairs.",
    "preferred_working_hours": "8:00 AM - 5:00 PM"
}
res = post_json("/signup/worker", worker_data)
assert res["success"], f"Worker signup failed: {res}"
print(f"[PASS] Worker registered with mobile: {worker_mobile}")

# 3. Test Customer Login
res = post_json("/login", {"mobile_number": cust_mobile, "password": "pass1234"})
assert res["success"] and res["user_type"] == "customer"
customer = res["user"]
cust_id = customer["customer_id"]
print(f"[PASS] Customer login successful: {customer['full_name']} (ID: {cust_id})")

# 4. Test Worker Login
res = post_json("/login", {"mobile_number": worker_mobile, "password": "work1234"})
assert res["success"] and res["user_type"] == "worker"
worker = res["user"]
worker_id = worker["worker_id"]
print(f"[PASS] Worker login successful: {worker['full_name']} (ID: {worker_id})")

# 5. Search for Workers in "Carpenter" category
res = get_json("/workers?service=Carpenter")
assert res["success"]
workers = res["workers"]
matching_worker = next((w for w in workers if w["worker_id"] == worker_id), None)
assert matching_worker is not None, "Newly registered worker not found in search"
print(f"[PASS] Search returned {len(workers)} Carpenter(s), found {matching_worker['full_name']}")

# 6. Book Worker
booking_payload = {
    "customer_id": cust_id,
    "worker_id": worker_id,
    "date": "2026-09-15"
}
res = post_json("/book", booking_payload)
assert res["success"], f"Booking failed: {res}"
booking_id = res["booking"]["booking_id"]
print(f"[PASS] Created booking: #{booking_id}")

# 7. Check Worker Bookings
res = get_json(f"/bookings/worker/{worker_id}")
assert res["success"]
w_booking = next((b for b in res["bookings"] if b["booking_id"] == booking_id), None)
assert w_booking is not None and w_booking["status"] == "PENDING"
print(f"[PASS] Worker received booking #{booking_id} with status PENDING")

# 8. Worker Accepts Booking
res = post_json(f"/booking/{booking_id}/accept", {})
assert res["success"]
print(f"[PASS] Worker accepted booking #{booking_id}")

# 9. Customer Checks Bookings and Marks Complete
res = get_json(f"/bookings/customer/{cust_id}")
c_booking = next((b for b in res["bookings"] if b["booking_id"] == booking_id), None)
assert c_booking["status"] == "ACCEPTED"

res = post_json(f"/booking/{booking_id}/complete", {})
assert res["success"]
print(f"[PASS] Customer marked booking #{booking_id} as COMPLETED")

# 10. Customer Submits Rating & Review
rating_data = {
    "booking_id": booking_id,
    "customer_id": cust_id,
    "rating": "5",
    "review": "Exceptional precision craftsmanship! Beautiful woodwork and punctual service."
}
res = post_json("/rating", rating_data)
assert res["success"]
print(f"[PASS] Customer submitted 5-star review: '{rating_data['review']}'")

# 11. Check Worker Ratings & Average
res = get_json(f"/ratings/worker/{worker_id}")
assert res["success"] and len(res["ratings"]) >= 1
print(f"[PASS] Verified worker ratings list: {len(res['ratings'])} review(s)")

# 12. Check Worker Earnings
res = get_json(f"/worker/{worker_id}/earnings")
assert res["success"]
assert res["completed_jobs"] >= 1
assert "earnings" in res
print(f"[PASS] Worker earnings verified: {res['completed_jobs']} job(s) completed, INR {res['earnings']} recorded")

# 13. Toggle Worker Availability
res = post_json(f"/worker/{worker_id}/availability", {"available": False})
assert res["success"] and res["available"] is False
print("[PASS] Worker successfully toggled status to Unavailable")

# Worker should no longer appear in active search
res = get_json("/workers?service=Carpenter")
hidden_worker = next((w for w in res["workers"] if w["worker_id"] == worker_id), None)
assert hidden_worker is None, "Unavailable worker still appeared in search results"
print("[PASS] Verified unavailable worker is properly excluded from search results")

# Toggle back to Available
res = post_json(f"/worker/{worker_id}/availability", {"available": True})
assert res["success"] and res["available"] is True
print("[PASS] Worker restored to Available status")

print("\n*** ALL 13 END-TO-END WORKFLOW CHECKS PASSED SUCCESSFULLY! ***")

