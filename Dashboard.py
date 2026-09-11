import csv
import os
from Customer import Customer
from Worker import Worker
from bookings import Booking
from Ratings import Rating
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS





















# # ============================================================
# # FILE NAMES
# # ============================================================

# WORKER_FILE = "worker_data.csv"
# CUSTOMER_FILE = "customer_data.csv"
# BOOKING_FILE = "booking_data.csv"
# RATING_FILE = "rating_data.csv"


# # ============================================================
# # CSV HEADERS
# # ============================================================

# worker_fields = [
#     "worker_id",
#     "full_name",
#     "password",
#     "mobile_number",
#     "email",
#     "age",
#     "current_address",
#     "city",
#     "pincode",
#     "primary_skill",
#     "additional_skills",
#     "years_of_experience",
#     "description",
#     "available",
#     "preferred_working_hours"
# ]

# customer_fields = [
#     "customer_id",
#     "full_name",
#     "password",
#     "mobile_number",
#     "email",
#     "address",
#     "pincode"
# ]

# booking_fields = [
#     "booking_id",
#     "customer_id",
#     "worker_id",
#     "service",
#     "date",
#     "status"
# ]

# rating_fields = [
#     "rating_id",
#     "booking_id",
#     "customer_id",
#     "worker_id",
#     "rating",
#     "review"
# ]



# # ============================================================
# # INITIALIZE CSV FILES
# # ============================================================

# def initialize_csv_files():

#     if not os.path.exists(WORKER_FILE):
#         with open(WORKER_FILE, "w", newline="") as file:
#             writer = csv.DictWriter(
#                 file,
#                 fieldnames=worker_fields
#             )
#             writer.writeheader()

#     if not os.path.exists(CUSTOMER_FILE):
#         with open(CUSTOMER_FILE, "w", newline="") as file:
#             writer = csv.DictWriter(
#                 file,
#                 fieldnames=customer_fields
#             )
#             writer.writeheader()

#     if not os.path.exists(BOOKING_FILE):
#         with open(BOOKING_FILE, "w", newline="") as file:
#             writer = csv.DictWriter(
#                 file,
#                 fieldnames=booking_fields
#             )
#             writer.writeheader()

#     if not os.path.exists(RATING_FILE):
#         with open(RATING_FILE, "w", newline="") as file:
#             writer = csv.DictWriter(
#                 file,
#                 fieldnames=rating_fields
#             )
#             writer.writeheader()


# # ============================================================
# # GENERATE CUSTOMER ID
# # ============================================================

# def generate_customer_id():

#     with open(CUSTOMER_FILE, "r", newline="") as file:
#         reader = csv.DictReader(file)
#         rows = list(reader)

#     return f"C{len(rows) + 1:03d}"


# # ============================================================
# # GENERATE WORKER ID
# # ============================================================

# def generate_worker_id():

#     with open(WORKER_FILE, "r", newline="") as file:
#         reader = csv.DictReader(file)
#         rows = list(reader)

#     return f"W{len(rows) + 1:03d}"


# # ============================================================
# # GENERATE BOOKING ID
# # ============================================================

# def generate_booking_id():

#     with open(BOOKING_FILE, "r", newline="") as file:
#         reader = csv.DictReader(file)
#         rows = list(reader)

#     return f"B{len(rows) + 1:03d}"


# # ============================================================
# # GENERATE RATING ID
# # ============================================================

# def generate_rating_id():

#     with open(RATING_FILE, "r", newline="") as file:
#         reader = csv.DictReader(file)
#         rows = list(reader)

#     return f"R{len(rows) + 1:03d}"


# # ============================================================
# # CUSTOMER SIGNUP
# # ============================================================

# def customer_signup():

#     print("\n========== CUSTOMER SIGNUP ==========\n")

#     customer_id = generate_customer_id()

#     full_name = input("Full Name: ")
#     password = input("Password: ")
#     mobile_number = input("Mobile Number: ")
#     email = input("Email (optional): ")
#     address = input("Address: ")
#     pincode = input("Pincode: ")

#     customer = Customer(
#         customer_id,
#         full_name,
#         password,
#         mobile_number,
#         email,
#         address,
#         pincode
#     )

#     with open(CUSTOMER_FILE, "a", newline="") as file:

#         writer = csv.DictWriter(
#             file,
#             fieldnames=customer_fields
#         )

#         writer.writerow(customer.to_dict())

#     print("\nRegistration successful!")
#     print("Your Customer ID is:", customer_id)

#     return customer


# # ============================================================
# # WORKER SIGNUP
# # ============================================================

# def worker_signup():

#     print("\n========== WORKER SIGNUP ==========\n")

#     worker_id = generate_worker_id()

#     full_name = input("Full Name: ")
#     password = input("Password: ")
#     mobile_number = input("Mobile Number: ")
#     email = input("Email: ")
#     age = input("Age: ")
#     current_address = input("Current Address: ")
#     city = input("City: ")
#     pincode = input("Pincode: ")

#     print("\nAvailable Services:")
#     print("1. Electrician")
#     print("2. Plumber")
#     print("3. Carpenter")
#     print("4. Painter")
#     print("5. Cleaner")
#     print("6. Driver")
#     print("7. Other")

#     skill_choice = input("Select Primary Skill: ")

#     skills = {
#         "1": "Electrician",
#         "2": "Plumber",
#         "3": "Carpenter",
#         "4": "Painter",
#         "5": "Cleaner",
#         "6": "Driver"
#     }

#     if skill_choice in skills:
#         primary_skill = skills[skill_choice]
#     else:
#         primary_skill = input("Enter your skill: ")

#     additional_skills = input("Additional Skills: ")
#     years_of_experience = input("Years of Experience: ")
#     description = input("Short Description/About: ")

#     available = True

#     preferred_working_hours = input(
#         "Preferred Working Hours: "
#     )

#     worker = Worker(
#         worker_id,
#         full_name,
#         password,
#         mobile_number,
#         email,
#         age,
#         current_address,
#         city,
#         pincode,
#         primary_skill,
#         additional_skills,
#         years_of_experience,
#         description,
#         available,
#         preferred_working_hours
#     )

#     with open(WORKER_FILE, "a", newline="") as file:

#         writer = csv.DictWriter(
#             file,
#             fieldnames=worker_fields
#         )

#         writer.writerow(worker.to_dict())

#     print("\nRegistration successful!")
#     print("Your Worker ID is:", worker_id)

#     return worker


# # ============================================================
# # GET WORKER RATING
# # ============================================================

# def get_worker_rating(worker_id):

#     ratings = []

#     with open(RATING_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if row["worker_id"] == worker_id:

#                 try:
#                     ratings.append(float(row["rating"]))
#                 except ValueError:
#                     pass

#     if len(ratings) == 0:
#         return None, 0

#     average_rating = sum(ratings) / len(ratings)

#     return average_rating, len(ratings)


# # ============================================================
# # GET WORKER REVIEWS
# # ============================================================

# def get_worker_reviews(worker_id):

#     reviews = []

#     with open(RATING_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if (
#                 row["worker_id"] == worker_id
#                 and row["review"].strip() != ""
#             ):
#                 reviews.append(row["review"])

#     return reviews


# # ============================================================
# # FIND WORKERS BY SERVICE
# # ============================================================

# def find_workers():

#     print("\n========== FIND A WORKER ==========\n")

#     print("What type of worker do you need?\n")

#     print("1. Electrician")
#     print("2. Plumber")
#     print("3. Carpenter")
#     print("4. Painter")
#     print("5. Cleaner")
#     print("6. Driver")
#     print("7. Other")

#     service_choice = input("\nSelect service: ")

#     services = {
#         "1": "Electrician",
#         "2": "Plumber",
#         "3": "Carpenter",
#         "4": "Painter",
#         "5": "Cleaner",
#         "6": "Driver"
#     }

#     if service_choice in services:
#         service = services[service_choice]
#     else:
#         service = input("Enter required service: ")

#     matching_workers = []

#     with open(WORKER_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if (
#                 row["primary_skill"].lower() == service.lower()
#                 and row["available"] == "True"
#             ):
#                 matching_workers.append(row)

#     if len(matching_workers) == 0:

#         print("\nNo available workers found for this service.")
#         return None

#     print("\n========== AVAILABLE WORKERS ==========\n")

#     for i, worker in enumerate(matching_workers, start=1):

#         print(f"{i}. {worker['full_name']}")
#         print(f"   Worker ID: {worker['worker_id']}")
#         print(f"   Service: {worker['primary_skill']}")
#         print(
#             f"   Experience: "
#             f"{worker['years_of_experience']} years"
#         )

#         # ----------------------------------------------------
#         # DISPLAY RATING
#         # ----------------------------------------------------

#         average_rating, number_of_ratings = get_worker_rating(
#             worker["worker_id"]
#         )

#         if average_rating is None:

#             print("   Rating: No ratings yet")

#         else:

#             print(
#                 f"   Rating: ★ {average_rating:.1f}/5 "
#                 f"({number_of_ratings} ratings)"
#             )

#         print(f"   About: {worker['description']}")
#         print(
#             f"   Working Hours: "
#             f"{worker['preferred_working_hours']}"
#         )

#         # ----------------------------------------------------
#         # DISPLAY REVIEWS
#         # ----------------------------------------------------

#         reviews = get_worker_reviews(
#             worker["worker_id"]
#         )

#         if len(reviews) > 0:

#             print("\n   Reviews:")

#             # Show maximum 3 reviews
#             for review in reviews[-3:]:

#                 print(f"   - {review}")

#         print()

#     # --------------------------------------------------------
#     # SELECT WORKER
#     # --------------------------------------------------------

#     while True:

#         try:

#             choice = int(
#                 input("Select a worker (0 to cancel): ")
#             )

#             if choice == 0:
#                 return None

#             if 1 <= choice <= len(matching_workers):
#                 selected_worker = matching_workers[choice - 1]
#                 break

#             print("Invalid selection.")

#         except ValueError:

#             print("Please enter a number.")

#     # --------------------------------------------------------
#     # SHOW SELECTED WORKER AGAIN
#     # --------------------------------------------------------

#     print("\n========== SELECTED WORKER ==========\n")

#     print("Name:", selected_worker["full_name"])
#     print("Worker ID:", selected_worker["worker_id"])
#     print("Service:", selected_worker["primary_skill"])
#     print(
#         "Experience:",
#         selected_worker["years_of_experience"],
#         "years"
#     )

#     average_rating, number_of_ratings = get_worker_rating(
#         selected_worker["worker_id"]
#     )

#     if average_rating is None:

#         print("Rating: No ratings yet")

#     else:

#         print(
#             f"Rating: ★ {average_rating:.1f}/5 "
#             f"({number_of_ratings} ratings)"
#         )

#     print(
#         "Working Hours:",
#         selected_worker["preferred_working_hours"]
#     )

#     print("About:", selected_worker["description"])

#     # Show reviews for selected worker

#     reviews = get_worker_reviews(
#         selected_worker["worker_id"]
#     )

#     if len(reviews) > 0:

#         print("\nReviews:")

#         for review in reviews[-3:]:

#             print("-", review)

#     confirm = input(
#         "\nDo you want to book this worker? (y/n): "
#     )

#     if confirm.lower() != "y":

#         print("\nBooking cancelled.")
#         return None

#     date = input(
#         "Enter service date (DD-MM-YYYY): "
#     )

#     return {
#         "worker_id": selected_worker["worker_id"],
#         "worker_name": selected_worker["full_name"],
#         "service": selected_worker["primary_skill"],
#         "date": date
#     }


# # ============================================================
# # CREATE BOOKING
# # ============================================================

# def create_booking(customer):

#     booking_details = find_workers()

#     if booking_details is None:
#         return

#     booking_id = generate_booking_id()

#     status = "PENDING"

#     booking = Booking(
#         booking_id,
#         customer.customer_id,
#         booking_details["worker_id"],
#         booking_details["service"],
#         booking_details["date"],
#         status
#     )

#     with open(BOOKING_FILE, "a", newline="") as file:

#         writer = csv.DictWriter(
#             file,
#             fieldnames=booking_fields
#         )

#         writer.writerow(booking.to_dict())

#     print("\n================================")
#     print("       BOOKING CREATED")
#     print("================================")

#     print("Booking ID:", booking.booking_id)
#     print("Worker:", booking_details["worker_name"])
#     print("Service:", booking.service)
#     print("Date:", booking.date)
#     print("Status:", booking.status)

#     print(
#         "\nWaiting for worker to accept the booking."
#     )


# # ============================================================
# # CUSTOMER BOOKINGS
# # ============================================================

# def customer_bookings(customer):

#     print("\n========== MY BOOKINGS ==========\n")

#     found = False

#     with open(BOOKING_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if row["customer_id"] == customer.customer_id:

#                 found = True

#                 print("Booking ID:", row["booking_id"])
#                 print("Worker ID:", row["worker_id"])
#                 print("Service:", row["service"])
#                 print("Date:", row["date"])
#                 print("Status:", row["status"])

#                 # ------------------------------------------------
#                 # ALLOW RATING AFTER COMPLETION
#                 # ------------------------------------------------

#                 if row["status"] == "COMPLETED":

#                     if not has_customer_rated(
#                         row["booking_id"]
#                     ):

#                         print("\n1. Give Rating")
#                         print("2. Skip")

#                         choice = input(
#                             "Enter choice: "
#                         )

#                         if choice == "1":

#                             add_rating(
#                                 customer,
#                                 row
#                             )

#                 print("--------------------------------")

#     if not found:

#         print("You have no bookings.")


# # ============================================================
# # CHECK WHETHER CUSTOMER HAS ALREADY RATED BOOKING
# # ============================================================

# def has_customer_rated(booking_id):

#     with open(RATING_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if row["booking_id"] == booking_id:
#                 return True

#     return False


# # ============================================================
# # ADD RATING
# # ============================================================

# def add_rating(customer, booking):

#     print("\n========== GIVE RATING ==========\n")

#     while True:

#         try:

#             rating = int(
#                 input("Rating (1-5): ")
#             )

#             if 1 <= rating <= 5:
#                 break

#             print(
#                 "Please enter a number between 1 and 5."
#             )

#         except ValueError:

#             print("Please enter a valid number.")

#     review = input(
#         "Write a review (optional): "
#     )

#     rating_id = generate_rating_id()

#     new_rating = Rating(
#         rating_id,
#         booking["booking_id"],
#         customer.customer_id,
#         booking["worker_id"],
#         rating,
#         review
#     )

#     with open(RATING_FILE, "a", newline="") as file:

#         writer = csv.DictWriter(
#             file,
#             fieldnames=rating_fields
#         )

#         writer.writerow(new_rating.to_dict())

#     print("\nThank you for your feedback!")


# # ============================================================
# # UPDATE BOOKING STATUS
# # ============================================================

# def update_booking_status(
#     booking_id,
#     new_status
# ):

#     rows = []

#     with open(BOOKING_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if row["booking_id"] == booking_id:

#                 row["status"] = new_status

#             rows.append(row)

#     with open(BOOKING_FILE, "w", newline="") as file:

#         writer = csv.DictWriter(
#             file,
#             fieldnames=booking_fields
#         )

#         writer.writeheader()
#         writer.writerows(rows)


# # ============================================================
# # WORKER BOOKINGS
# # ============================================================

# def worker_bookings(worker):

#     print("\n========== MY BOOKINGS ==========\n")

#     bookings = []

#     with open(BOOKING_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if row["worker_id"] == worker.worker_id:

#                 bookings.append(row)

#     if len(bookings) == 0:

#         print("You have no bookings.")
#         return

#     for booking in bookings:

#         customer_name = "Unknown"

#         with open(CUSTOMER_FILE, "r", newline="") as file:

#             reader = csv.DictReader(file)

#             for customer in reader:

#                 if (
#                     customer["customer_id"]
#                     == booking["customer_id"]
#                 ):

#                     customer_name = customer["full_name"]
#                     break

#         print("--------------------------------")
#         print("Booking ID:", booking["booking_id"])
#         print("Customer:", customer_name)
#         print("Service:", booking["service"])
#         print("Date:", booking["date"])
#         print("Status:", booking["status"])
#         print("--------------------------------")

#         # ----------------------------------------------------
#         # PENDING BOOKING
#         # ----------------------------------------------------

#         if booking["status"] == "PENDING":

#             print("1. Accept")
#             print("2. Reject")
#             print("3. Skip")

#             choice = input("Enter choice: ")

#             if choice == "1":

#                 update_booking_status(
#                     booking["booking_id"],
#                     "ACCEPTED"
#                 )

#                 print("\nBooking accepted!")

#             elif choice == "2":

#                 update_booking_status(
#                     booking["booking_id"],
#                     "REJECTED"
#                 )

#                 print("\nBooking rejected.")

#         # ----------------------------------------------------
#         # ACCEPTED BOOKING
#         # ----------------------------------------------------

#         elif booking["status"] == "ACCEPTED":

#             print("1. Mark Work as Completed")
#             print("2. Skip")

#             choice = input("Enter choice: ")

#             if choice == "1":

#                 update_booking_status(
#                     booking["booking_id"],
#                     "COMPLETED"
#                 )

#                 print("\nWork marked as completed!")

#         # ----------------------------------------------------
#         # COMPLETED BOOKING
#         # ----------------------------------------------------

#         elif booking["status"] == "COMPLETED":

#             print(
#                 "Work has already been completed."
#             )


# # ============================================================
# # UPDATE WORKER IN CSV
# # ============================================================

# def update_worker_in_csv(worker):

#     rows = []

#     with open(WORKER_FILE, "r", newline="") as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if row["worker_id"] == worker.worker_id:

#                 row["available"] = str(
#                     worker.available
#                 )

#             rows.append(row)

#     with open(WORKER_FILE, "w", newline="") as file:

#         writer = csv.DictWriter(
#             file,
#             fieldnames=worker_fields
#         )

#         writer.writeheader()
#         writer.writerows(rows)


# # ============================================================
# # CUSTOMER DASHBOARD
# # ============================================================

# def customer_dashboard(customer):

#     while True:

#         print("\n================================")
#         print("       CUSTOMER DASHBOARD")
#         print("================================")

#         print(
#             f"\nWelcome, {customer.full_name}!\n"
#         )

#         print("1. Find a Worker")
#         print("2. My Bookings")
#         print("3. My Profile")
#         print("4. Logout")

#         choice = input(
#             "\nEnter your choice: "
#         )

#         if choice == "1":

#             create_booking(customer)

#         elif choice == "2":

#             customer_bookings(customer)

#         elif choice == "3":

#             print(
#                 "\n========== MY PROFILE =========="
#             )

#             print(
#                 "Customer ID:",
#                 customer.customer_id
#             )

#             print(
#                 "Name:",
#                 customer.full_name
#             )

#             print(
#                 "Mobile:",
#                 customer.mobile_number
#             )

#             print(
#                 "Email:",
#                 customer.email
#             )

#             print(
#                 "Address:",
#                 customer.address
#             )

#             print(
#                 "Pincode:",
#                 customer.pincode
#             )

#         elif choice == "4":

#             print("\nLogging out...")
#             break

#         else:

#             print("\nInvalid choice.")


# # ============================================================
# # WORKER DASHBOARD
# # ============================================================

# def worker_dashboard(worker):

#     while True:

#         print("\n================================")
#         print("        WORKER DASHBOARD")
#         print("================================")

#         print(
#             f"\nWelcome, {worker.full_name}!\n"
#         )

#         print("1. My Profile")
#         print("2. My Bookings")
#         print("3. Availability")
#         print("4. Earnings")
#         print("5. Logout")

#         choice = input(
#             "\nEnter your choice: "
#         )

#         if choice == "1":

#             print(
#                 "\n========== MY PROFILE =========="
#             )

#             print(
#                 "Worker ID:",
#                 worker.worker_id
#             )

#             print(
#                 "Name:",
#                 worker.full_name
#             )

#             print(
#                 "Mobile:",
#                 worker.mobile_number
#             )

#             print(
#                 "Email:",
#                 worker.email
#             )

#             print(
#                 "City:",
#                 worker.city
#             )

#             print(
#                 "Pincode:",
#                 worker.pincode
#             )

#             print(
#                 "Primary Skill:",
#                 worker.primary_skill
#             )

#             print(
#                 "Additional Skills:",
#                 worker.additional_skills
#             )

#             print(
#                 "Experience:",
#                 worker.years_of_experience
#             )

#             print(
#                 "Description:",
#                 worker.description
#             )

#             print(
#                 "Available:",
#                 worker.available
#             )

#             print(
#                 "Working Hours:",
#                 worker.preferred_working_hours
#             )

#             # Show worker's own rating

#             average_rating, number_of_ratings = (
#                 get_worker_rating(worker.worker_id)
#             )

#             if average_rating is None:

#                 print(
#                     "Rating: No ratings yet"
#                 )

#             else:

#                 print(
#                     f"Rating: ★ "
#                     f"{average_rating:.1f}/5 "
#                     f"({number_of_ratings} ratings)"
#                 )

#         elif choice == "2":

#             worker_bookings(worker)

#         elif choice == "3":

#             print(
#                 "\nCurrent availability:",
#                 worker.available
#             )

#             change = input(
#                 "Change availability? (y/n): "
#             ).lower()

#             if change == "y":

#                 worker.available = not worker.available

#                 update_worker_in_csv(worker)

#                 print(
#                     "Availability changed to:",
#                     worker.available
#                 )

#         elif choice == "4":

#             print(
#                 "\nEarnings functionality "
#                 "will be added later."
#             )

#         elif choice == "5":

#             print("\nLogging out...")
#             break

#         else:

#             print("\nInvalid choice.")


# # ============================================================
# # LOGIN
# # ============================================================

# def login():

#     print("\n========== LOGIN ==========\n")

#     mobile_number = input(
#         "Mobile Number: "
#     )

#     password = input(
#         "Password: "
#     )

#     # --------------------------------------------------------
#     # CHECK CUSTOMER
#     # --------------------------------------------------------

#     with open(
#         CUSTOMER_FILE,
#         "r",
#         newline=""
#     ) as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if (
#                 row["mobile_number"] == mobile_number
#                 and row["password"] == password
#             ):

#                 customer = Customer(
#                     row["customer_id"],
#                     row["full_name"],
#                     row["password"],
#                     row["mobile_number"],
#                     row["email"],
#                     row["address"],
#                     row["pincode"]
#                 )

#                 print("\nLogin successful!")

#                 customer_dashboard(customer)

#                 return

#     # --------------------------------------------------------
#     # CHECK WORKER
#     # --------------------------------------------------------

#     with open(
#         WORKER_FILE,
#         "r",
#         newline=""
#     ) as file:

#         reader = csv.DictReader(file)

#         for row in reader:

#             if (
#                 row["mobile_number"] == mobile_number
#                 and row["password"] == password
#             ):

#                 worker = Worker(
#                     row["worker_id"],
#                     row["full_name"],
#                     row["password"],
#                     row["mobile_number"],
#                     row["email"],
#                     row["age"],
#                     row["current_address"],
#                     row["city"],
#                     row["pincode"],
#                     row["primary_skill"],
#                     row["additional_skills"],
#                     row["years_of_experience"],
#                     row["description"],
#                     row["available"] == "True",
#                     row["preferred_working_hours"]
#                 )

#                 print("\nLogin successful!")

#                 worker_dashboard(worker)

#                 return

#     print(
#         "\nInvalid mobile number or password."
#     )


# # ============================================================
# # MAIN DASHBOARD
# # ============================================================

# def dashboard():

#     initialize_csv_files()

#     while True:

#         print("\n================================")
#         print("     COOPERATIVE SERVICES")
#         print("================================")

#         print("\n1. Login")
#         print("2. Sign Up")
#         print("3. Exit")

#         choice = input(
#             "\nEnter your choice: "
#         )

#         if choice == "1":

#             login()

#         elif choice == "2":

#             print(
#                 "\n========== SIGN UP ==========\n"
#             )

#             print("1. Customer")
#             print("2. Worker")

#             signup_choice = input(
#                 "\nSelect account type: "
#             )

#             if signup_choice == "1":

#                 customer_signup()

#             elif signup_choice == "2":

#                 worker_signup()

#             else:

#                 print("\nInvalid choice.")

#         elif choice == "3":

#             print(
#                 "\nThank you for using "
#                 "Cooperative Services!"
#             )

#             break

#         else:

#             print("\nInvalid choice.")


# # ============================================================
# # START PROGRAM
# # ============================================================

# if __name__ == "__main__":

#     dashboard()


























# ============================================================
# APP SETUP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# TEMPORARY IN-MEMORY STORAGE (Pre-seeded with Stitch reference demo data)
# ============================================================

workers = [
    Worker(
        "W001",
        "Sarah Jenkins",
        "pass1234",
        "9876543201",
        "sarah@example.com",
        34,
        "Saket, South Delhi",
        "Delhi NCR",
        "110017",
        "Electrician",
        "Smart Home, Wiring & Fuse, Inverter Repair",
        10,
        "Cooperative Market Verified Master Electrician with 10+ years experience in Delhi NCR. 100% background checked with 30-day guarantee.",
        True,
        "8:00 AM - 8:00 PM"
    ),
    Worker(
        "W002",
        "Michael Torres",
        "pass1234",
        "9876543202",
        "michael@example.com",
        38,
        "Cyber City, Sector 29",
        "Gurgaon",
        "122002",
        "Plumber",
        "Tap & Mixer, Pipe Fitting, Water Tank Cleaning",
        8,
        "Certified professional plumber specializing in quick leak fixes, sanitary fixtures, and emergency pipe repairs.",
        True,
        "24/7 Emergency Service"
    ),
    Worker(
        "W003",
        "David Chen",
        "pass1234",
        "9876543203",
        "david@example.com",
        42,
        "Sector 62",
        "Noida",
        "201301",
        "Carpenter",
        "Modular Furniture, Door Locks, Drill & Hang",
        12,
        "Expert carpenter for fine woodworking, modular wardrobe assembly, and precision lock installations.",
        True,
        "9:00 AM - 6:00 PM"
    ),
    Worker(
        "W004",
        "Sunita Rao",
        "pass1234",
        "9876543204",
        "sunita@example.com",
        31,
        "Greater Kailash 1",
        "Delhi NCR",
        "110048",
        "Cleaner",
        "Deep Home Cleaning, Bathroom, Kitchen, Sofa Sanitization",
        7,
        "Specialist in eco-friendly deep house cleaning, motorized scrubber scrubbing, and hospital-grade sanitization.",
        True,
        "8:00 AM - 7:00 PM"
    ),
    Worker(
        "W005",
        "Amit Verma",
        "pass1234",
        "9876543205",
        "amit@example.com",
        36,
        "Sector 14, Rohini",
        "Delhi NCR",
        "110085",
        "Painter",
        "Waterproofing, Wall Touch-ups, Full Home Painting",
        11,
        "Cooperative Market Top-Rated Painter. Laser measurement, zero mess guarantee, and premium weather-resistant coats.",
        True,
        "9:00 AM - 6:00 PM"
    ),
    Worker(
        "W006",
        "Vikram Singh",
        "pass1234",
        "9876543206",
        "vikram@example.com",
        40,
        "Dwarka Sector 10",
        "Delhi NCR",
        "110075",
        "Driver",
        "City Chauffeur, Outstation Trips, Luxury Automatics",
        14,
        "Professional licensed chauffeur with clean driving record across Delhi NCR and highways. Punctual and courteous.",
        True,
        "Available on demand"
    )
]

customers = [
    Customer(
        "C001",
        "Alex Rivera",
        "pass1234",
        "9876543210",
        "alex@example.com",
        "C-14 Hauz Khas Enclave",
        "110016"
    )
]

bookings = [
    Booking("B001", "C001", "W001", "Electrician", "Today, 2:00 PM", "ACCEPTED"),
    Booking("B002", "C001", "W001", "Electrician", "Tomorrow, 10:00 AM", "PENDING"),
    Booking("B003", "C001", "W002", "Plumber", "Today, 4:30 PM", "COMPLETED")
]

ratings = [
    Rating("R001", "B001", "C001", "W001", 5, "Outstanding electrical service! The switchboard and ceiling fan were installed in 30 mins with zero mess."),
    Rating("R002", "B003", "C001", "W002", 5, "Fixed our kitchen pipeline leakage promptly. Highly polite and verified expert."),
    Rating("R003", "B001", "C001", "W003", 5, "Assembled our heavy 6-door wardrobe flawlessly."),
    Rating("R004", "B001", "C001", "W004", 5, "Bathroom sparkling clean! Used high quality mechanized tools."),
    Rating("R005", "B001", "C001", "W005", 5, "Great painting work and wall putty finish.")
]


# ============================================================
# ID COUNTERS
# ============================================================

customer_counter = 2
worker_counter = 7
booking_counter = 4
rating_counter = 6


# ============================================================
# SUBSCRIPTION PLANS & STORE (IDEA #3)
# ============================================================

SUBSCRIPTION_PLANS = [
    {
        "plan_id": "sub_dual_shield",
        "title": "Dual Shield Care",
        "subtitle": "Electricity + Plumbing Regular Maintenance",
        "services": ["Electrician", "Plumber"],
        "price_monthly": 699,
        "price_annual": 6710,
        "popular": True,
        "badge": "Most Popular",
        "features": [
            "2 Scheduled routine maintenance sweeps / month",
            "Zero inspection & diagnosis fee on all emergency calls",
            "15% Discount on all branded electrical & plumbing spare parts",
            "Priority technician dispatch in under 30 minutes in Delhi NCR",
            "30-Day unconditional rework guarantee on all repairs"
        ],
        "suitable_for": "1-3 BHK Apartments & Floors"
    },
    {
        "plan_id": "sub_total_home",
        "title": "Total Home Care Shield",
        "subtitle": "Electricity + Plumbing + Deep Cleaning + Carpentry",
        "services": ["Electrician", "Plumber", "Cleaner", "Carpenter"],
        "price_monthly": 1299,
        "price_annual": 12470,
        "popular": False,
        "badge": "Comprehensive",
        "features": [
            "4 Scheduled visits / month covering all 4 essential trades",
            "Free seasonal AC and water tank electrical leakage inspection",
            "Zero callout fees across all trades 24/7",
            "20% Discount on spare parts & materials",
            "Dedicated senior master technician assigned to your address",
            "Free monthly plumbing pressure & drain declogging check"
        ],
        "suitable_for": "Villas, Duplexes & Large Homes"
    },
    {
        "plan_id": "sub_society_office",
        "title": "RWA, Society & Office Shield",
        "subtitle": "Complete Campus Multi-Trade Infrastructure Maintenance",
        "services": ["Electrician", "Plumber", "Carpenter", "Cleaner", "Painter"],
        "price_monthly": 3999,
        "price_annual": 38390,
        "popular": False,
        "badge": "Society & Commercial",
        "features": [
            "Unlimited routine sweeps & emergency dispatch within 15 mins",
            "Common pump room, panel board & lighting safety audit",
            "Monthly statutory electrical earthing & plumbing compliance log",
            "Dedicated multi-craftsman on-site deployment team",
            "Bulk wholesale pricing on all commercial consumables & spares",
            "Consolidated monthly invoicing with GST reporting"
        ],
        "suitable_for": "Housing Societies, RWAs & Offices"
    }
]

subscriptions = [
    {
        "subscription_id": "SUB001",
        "customer_id": "C001",
        "plan_id": "sub_dual_shield",
        "plan_title": "Dual Shield Care",
        "subtitle": "Electricity + Plumbing Regular Maintenance",
        "services": ["Electrician", "Plumber"],
        "billing_cycle": "monthly",
        "amount": 699,
        "status": "ACTIVE",
        "start_date": "2026-09-01",
        "next_billing_date": "2026-10-01",
        "visits_remaining": 2
    }
]

subscription_counter = 2


# ============================================================
# WORKER / SHOP BEST WORK PORTFOLIO STORE (IDEA #4)
# ============================================================

worker_portfolios = {
    "W001": [
        {
            "id": "PORT-W001-1",
            "worker_id": "W001",
            "title": "Concealed LED Architectural Strip & Ambient Ceiling Lighting",
            "category": "Smart Home & Lighting",
            "description": "Custom installation of 24V warm architectural COB strip lights with smart WiFi dual dimmers in Hauz Khas villa.",
            "completed_date": "August 2026",
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
            "tags": ["Smart Home", "Concealed LED", "Zero Mess"],
            "verified_by_platform": True
        },
        {
            "id": "PORT-W001-2",
            "worker_id": "W001",
            "title": "Heavy 3-Phase Distribution Box & MCB Breaker Overhaul",
            "category": "High Voltage & Safety",
            "description": "Complete rewiring of main distribution panel, replacing rewirable porcelain fuses with Siemens RCBO breakers.",
            "completed_date": "July 2026",
            "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
            "tags": ["3-Phase Panel", "Surge Protection", "Schneider"],
            "verified_by_platform": True
        }
    ],
    "W002": [
        {
            "id": "PORT-W002-1",
            "worker_id": "W002",
            "title": "Concealed Hansgrohe Thermostatic Diverter & Rain Shower",
            "category": "Luxury Plumbing",
            "description": "Precision pressure balancing valve fitting with zero wall tile breakage in DLF Phase 5 apartment.",
            "completed_date": "August 2026",
            "image_url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
            "tags": ["Concealed Diverter", "Zero Leakage", "Warranty"],
            "verified_by_platform": True
        },
        {
            "id": "PORT-W002-2",
            "worker_id": "W002",
            "title": "Automatic 1.5 HP Hydro-Pneumatic Pressure Booster System",
            "category": "Pumps & Piping",
            "description": "Installed dual pump automated booster system with dry-run protection for a 4-storey home in Gurgaon.",
            "completed_date": "July 2026",
            "image_url": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80",
            "tags": ["Pressure Booster", "Grundfos", "Automated"],
            "verified_by_platform": True
        }
    ],
    "W003": [
        {
            "id": "PORT-W003-1",
            "worker_id": "W003",
            "title": "Fluted Teak Wood Acoustic Slat Wall & Floating Media Console",
            "category": "Custom Woodwork",
            "description": "Handcrafted modular acoustic teak paneling with invisible cable conduit routing for 75-inch OLED setup.",
            "completed_date": "August 2026",
            "image_url": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80",
            "tags": ["Teak Wood", "Acoustic Slats", "Precision Joinery"],
            "verified_by_platform": True
        }
    ],
    "W004": [
        {
            "id": "PORT-W004-1",
            "worker_id": "W004",
            "title": "Hospital-Grade Mechanized Tile Grout & Steam Scrubbing",
            "category": "Deep Sanitization",
            "description": "High-pressure 140°C steam extraction and anti-fungal treatment for large master bathroom in Greater Kailash.",
            "completed_date": "September 2026",
            "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
            "tags": ["Steam Sterilization", "Eco-Friendly", "Karcher"],
            "verified_by_platform": True
        }
    ],
    "W005": [
        {
            "id": "PORT-W005-1",
            "worker_id": "W005",
            "title": "Italian Stucco Lustro Venetian Accent Wall Finish",
            "category": "Luxury Wall Finishes",
            "description": "Multi-layer hand-troweled marble plaster polished to mirror-glass finish in Vasant Vihar drawing room.",
            "completed_date": "July 2026",
            "image_url": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80",
            "tags": ["Venetian Plaster", "High Gloss", "Dust-Free"],
            "verified_by_platform": True
        }
    ],
    "W006": [
        {
            "id": "PORT-W006-1",
            "worker_id": "W006",
            "title": "VIP Interstate Chauffeur Delegation & Highway Trip",
            "category": "Luxury Chauffeur",
            "description": "Smooth 650km round trip to Jaipur with zero incidents, executive protocol, and immaculate vehicle care.",
            "completed_date": "August 2026",
            "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
            "tags": ["Luxury Automatic", "Clean Record", "VIP Protocol"],
            "verified_by_platform": True
        }
    ]
}

portfolio_counter = 10


# ============================================================
# RELIABILITY SCORE ENGINE (IDEA #8)
# ============================================================

def calculate_worker_reliability(worker_id):
    worker_bookings = [b for b in bookings if b.worker_id == worker_id]
    completed_jobs = len([b for b in worker_bookings if b.status == "COMPLETED"])
    cancelled_jobs = len([b for b in worker_bookings if b.status == "REJECTED"])

    worker_ratings = [r for r in ratings if r.worker_id == worker_id]
    complaints = len([r for r in worker_ratings if r.rating <= 2])
    
    cust_ids = [b.customer_id for b in worker_bookings if b.status in ("COMPLETED", "ACCEPTED")]
    repeat_count = max(0, len(cust_ids) - len(set(cust_ids)))

    seed_stats = {
        "W001": {"base_completed": 142, "base_cancelled": 1, "base_repeat": 48, "avg_resp_mins": 9, "complaints": 0},
        "W002": {"base_completed": 118, "base_cancelled": 2, "base_repeat": 39, "avg_resp_mins": 12, "complaints": 0},
        "W003": {"base_completed": 95,  "base_cancelled": 1, "base_repeat": 27, "avg_resp_mins": 14, "complaints": 0},
        "W004": {"base_completed": 160, "base_cancelled": 2, "base_repeat": 54, "avg_resp_mins": 8,  "complaints": 0},
        "W005": {"base_completed": 82,  "base_cancelled": 1, "base_repeat": 22, "avg_resp_mins": 15, "complaints": 0},
        "W006": {"base_completed": 130, "base_cancelled": 0, "base_repeat": 45, "avg_resp_mins": 6,  "complaints": 0},
    }
    base = seed_stats.get(worker_id, {"base_completed": 25, "base_cancelled": 0, "base_repeat": 8, "avg_resp_mins": 12, "complaints": 0})

    tot_comp = base["base_completed"] + completed_jobs
    tot_canc = base["base_cancelled"] + cancelled_jobs
    tot_handled = tot_comp + tot_canc
    completion_rate = (tot_comp / tot_handled * 100.0) if tot_handled > 0 else 100.0
    cancellation_rate = (tot_canc / tot_handled * 100.0) if tot_handled > 0 else 0.0
    tot_repeat = base["base_repeat"] + repeat_count
    tot_complaints = base["complaints"] + complaints
    avg_resp = base["avg_resp_mins"]

    # 1. Completion rate (35 pts max)
    score_comp = min(35.0, (completion_rate / 100.0) * 35.0)

    # 2. Repeat customers (20 pts max, 30+ repeats = full 20 pts)
    score_repeat = min(20.0, (tot_repeat / 30.0) * 20.0)

    # 3. Low Cancellation rate (20 pts max)
    score_canc = max(0.0, 20.0 - (cancellation_rate * 3.0))

    # 4. Zero Complaint record (15 pts max)
    score_complaints = max(0.0, 15.0 - (tot_complaints * 5.0))

    # 5. Response time (10 pts max)
    if avg_resp <= 10:
        score_resp = 10.0
    elif avg_resp <= 20:
        score_resp = 8.5
    elif avg_resp <= 30:
        score_resp = 7.0
    else:
        score_resp = 5.0

    raw_score = score_comp + score_repeat + score_canc + score_complaints + score_resp
    final_score = int(round(min(100, max(60, raw_score))))

    if final_score >= 95:
        tier = "Elite Diamond"
        badge_color = "#6E42E5"
    elif final_score >= 90:
        tier = "Platinum Verified"
        badge_color = "#0f8a5f"
    elif final_score >= 80:
        tier = "Gold Trusted"
        badge_color = "#d97706"
    else:
        tier = "Standard Partner"
        badge_color = "#4b5563"

    return {
        "worker_id": worker_id,
        "score": final_score,
        "tier": tier,
        "badge_color": badge_color,
        "metrics": {
            "completion_rate": f"{completion_rate:.1f}%",
            "completed_jobs": tot_comp,
            "cancellation_rate": f"{cancellation_rate:.1f}%",
            "repeat_customers": tot_repeat,
            "complaint_count": tot_complaints,
            "avg_response_mins": avg_resp
        },
        "breakdown": {
            "completion_points": round(score_comp, 1),
            "repeat_points": round(score_repeat, 1),
            "cancellation_points": round(score_canc, 1),
            "complaint_points": round(score_complaints, 1),
            "response_points": round(score_resp, 1)
        },
        "tips": [
            "Accept booking requests within 10 minutes to maximize response score",
            "Ensure 100% job fulfillment to retain Platinum/Elite Diamond status",
            "Consistently provide spotless post-service cleanup to keep 0 complaints"
        ]
    }



# ============================================================
# HOME / TEST ROUTE
# ============================================================



BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route("/")
def serve_website():
    return send_from_directory(BASE_DIR, "index.html")




@app.route("/script.js")
def serve_javascript():
    return send_from_directory(BASE_DIR, "script.js")



# ============================================================
# CUSTOMER SIGNUP
# ============================================================

@app.route("/signup/customer", methods=["POST"])
def signup_customer():

    global customer_counter

    data = request.json

    required_fields = [
        "full_name",
        "password",
        "mobile_number",
        "address",
        "pincode"
    ]

    for field in required_fields:

        if not data.get(field):

            return jsonify({
                "success": False,
                "message":
                    f"{field} is required."
            }), 400


    # Check duplicate mobile number

    for customer in customers:

        if (
            customer.mobile_number
            == data["mobile_number"]
        ):

            return jsonify({
                "success": False,
                "message":
                    "Mobile number already registered."
            }), 400


    customer_id = (
        f"C{customer_counter:03d}"
    )

    customer_counter += 1


    customer = Customer(

        customer_id,

        data["full_name"],

        data["password"],

        data["mobile_number"],

        data.get("email", ""),

        data["address"],

        data["pincode"]
    )


    customers.append(customer)


    return jsonify({

        "success": True,

        "message":
            "Customer account created.",

        "customer":
            customer.to_dict()

    })


# ============================================================
# WORKER SIGNUP
# ============================================================

@app.route("/signup/worker", methods=["POST"])
def signup_worker():

    global worker_counter

    data = request.json

    required_fields = [
        "full_name",
        "password",
        "mobile_number",
        "age",
        "current_address",
        "city",
        "pincode",
        "primary_skill",
        "years_of_experience"
    ]

    for field in required_fields:

        if not data.get(field):

            return jsonify({
                "success": False,
                "message":
                    f"{field} is required."
            }), 400


    # Check duplicate mobile number

    for worker in workers:

        if (
            worker.mobile_number
            == data["mobile_number"]
        ):

            return jsonify({
                "success": False,
                "message":
                    "Mobile number already registered."
            }), 400


    worker_id = (
        f"W{worker_counter:03d}"
    )

    worker_counter += 1


    worker = Worker(

        worker_id,

        data["full_name"],

        data["password"],

        data["mobile_number"],

        data.get("email", ""),

        data["age"],

        data["current_address"],

        data["city"],

        data["pincode"],

        data["primary_skill"],

        data.get("additional_skills", ""),

        data["years_of_experience"],

        data.get("description", ""),

        True,

        data.get(
            "preferred_working_hours",
            ""
        )
    )


    workers.append(worker)


    return jsonify({

        "success": True,

        "message":
            "Worker account created.",

        "worker":
            worker.to_dict()

    })


# ============================================================
# LOGIN
# ============================================================

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    mobile_number = data.get(
        "mobile_number"
    )

    password = data.get(
        "password"
    )


    # Check customers

    for customer in customers:

        if (
            customer.mobile_number
            == mobile_number
            and
            customer.password
            == password
        ):

            return jsonify({

                "success": True,

                "user_type":
                    "customer",

                "user":
                    customer.to_dict()

            })


    # Check workers

    for worker in workers:

        if (
            worker.mobile_number
            == mobile_number
            and
            worker.password
            == password
        ):

            return jsonify({

                "success": True,

                "user_type":
                    "worker",

                "user":
                    worker.to_dict()

            })


    return jsonify({

        "success": False,

        "message":
            "Invalid mobile number or password."

    }), 401


# ============================================================
# FIND WORKERS
# ============================================================

@app.route("/workers", methods=["GET"])
def find_workers():

    service = request.args.get(
        "service"
    )

    available_only = request.args.get("available_only", "true").lower() == "true"
    if request.args.get("all") == "true":
        available_only = False

    matching_workers = []

    for worker in workers:
        match_service = True
        if service and service.strip() != "" and service.lower() != "all":
            req_s = service.strip().lower()
            w_skill = worker.primary_skill.lower()
            w_add = (worker.additional_skills or "").lower()
            match_service = (req_s == w_skill or req_s in w_skill or w_skill in req_s or req_s in w_add)

        should_include = match_service and (not available_only or worker.available)

        if should_include:
            worker_data = worker.to_dict()


            # Get worker rating

            worker_ratings = [

                rating

                for rating in ratings

                if rating.worker_id
                == worker.worker_id

            ]


            if len(worker_ratings) == 0:

                worker_data["average_rating"] = None

                worker_data["number_of_ratings"] = 0

            else:

                total = sum(
                    rating.rating
                    for rating in worker_ratings
                )

                worker_data[
                    "average_rating"
                ] = round(
                    total /
                    len(worker_ratings),
                    1
                )

                worker_data[
                    "number_of_ratings"
                ] = len(worker_ratings)


            # Get reviews

            worker_data["reviews"] = [

                {
                    "rating":
                        rating.rating,

                    "review":
                        rating.review

                }

                for rating in worker_ratings

                if rating.review.strip() != ""

            ]


            # Attach Reliability Score & Portfolio Info
            reliability_info = calculate_worker_reliability(worker.worker_id)
            worker_data["reliability"] = reliability_info
            worker_data["reliability_score"] = reliability_info["score"]
            worker_data["reliability_tier"] = reliability_info["tier"]
            worker_data["portfolio_count"] = len(worker_portfolios.get(worker.worker_id, []))
            worker_data["portfolio_preview"] = worker_portfolios.get(worker.worker_id, [])[:2]

            matching_workers.append(
                worker_data
            )


    return jsonify({

        "success": True,

        "workers":
            matching_workers

    })


# ============================================================
# CREATE BOOKING
# ============================================================

@app.route("/book", methods=["POST"])
def create_booking():

    global booking_counter

    data = request.json


    customer_id = data.get(
        "customer_id"
    )

    worker_id = data.get(
        "worker_id"
    )

    date = data.get(
        "date"
    )


    # Check customer

    customer = next(

        (
            c for c in customers

            if c.customer_id
            == customer_id
        ),

        None
    )


    if customer is None:

        return jsonify({

            "success": False,

            "message":
                "Customer not found."

        }), 404


    # Check worker

    worker = next(

        (
            w for w in workers

            if w.worker_id
            == worker_id
        ),

        None
    )


    if worker is None:

        return jsonify({

            "success": False,

            "message":
                "Worker not found."

        }), 404


    if not worker.available:

        return jsonify({

            "success": False,

            "message":
                "Worker is currently unavailable."

        }), 400


    booking_id = (
        f"B{booking_counter:03d}"
    )

    booking_counter += 1

    problem_photo = data.get("problem_photo")
    problem_notes = data.get("problem_notes")

    booking = Booking(

        booking_id,

        customer_id,

        worker_id,

        worker.primary_skill,

        date,

        "PENDING",

        problem_photo=problem_photo,

        problem_notes=problem_notes

    )


    bookings.append(booking)


    return jsonify({

        "success": True,

        "message":
            "Booking created.",

        "booking":
            booking.to_dict()

    })


# ============================================================
# CUSTOMER BOOKINGS
# ============================================================

@app.route(
    "/bookings/customer/<customer_id>",
    methods=["GET"]
)
def customer_bookings(customer_id):

    result = []


    for booking in bookings:

        if (
            booking.customer_id
            == customer_id
        ):

            booking_data = booking.to_dict()


            worker = next(

                (
                    w for w in workers

                    if w.worker_id
                    == booking.worker_id
                ),

                None
            )


            if worker:

                booking_data[
                    "worker_name"
                ] = worker.full_name


            result.append(
                booking_data
            )


    return jsonify({

        "success": True,

        "bookings": result

    })


# ============================================================
# WORKER BOOKINGS
# ============================================================

@app.route(
    "/bookings/worker/<worker_id>",
    methods=["GET"]
)
def worker_bookings(worker_id):

    result = []


    for booking in bookings:

        if (
            booking.worker_id
            == worker_id
        ):

            booking_data = booking.to_dict()


            customer = next(

                (
                    c for c in customers

                    if c.customer_id
                    == booking.customer_id
                ),

                None
            )


            if customer:

                booking_data[
                    "customer_name"
                ] = customer.full_name


            result.append(
                booking_data
            )


    return jsonify({

        "success": True,

        "bookings": result

    })


# ============================================================
# ACCEPT BOOKING
# ============================================================

@app.route(
    "/booking/<booking_id>/accept",
    methods=["POST"]
)
def accept_booking(booking_id):

    booking = next(

        (
            b for b in bookings

            if b.booking_id
            == booking_id
        ),

        None
    )


    if booking is None:

        return jsonify({

            "success": False,

            "message":
                "Booking not found."

        }), 404


    booking.status = "ACCEPTED"


    return jsonify({

        "success": True,

        "message":
            "Booking accepted.",

        "booking":
            booking.to_dict()

    })


# ============================================================
# REJECT BOOKING
# ============================================================

@app.route(
    "/booking/<booking_id>/reject",
    methods=["POST"]
)
def reject_booking(booking_id):

    booking = next(

        (
            b for b in bookings

            if b.booking_id
            == booking_id
        ),

        None
    )


    if booking is None:

        return jsonify({

            "success": False,

            "message":
                "Booking not found."

        }), 404


    booking.status = "REJECTED"


    return jsonify({

        "success": True,

        "message":
            "Booking rejected.",

        "booking":
            booking.to_dict()

    })


# ============================================================
# COMPLETE BOOKING
# ============================================================

@app.route(
    "/booking/<booking_id>/complete",
    methods=["POST"]
)
def complete_booking(booking_id):

    booking = next(

        (
            b for b in bookings

            if b.booking_id
            == booking_id
        ),

        None
    )


    if booking is None:

        return jsonify({

            "success": False,

            "message":
                "Booking not found."

        }), 404


    if booking.status != "ACCEPTED":

        return jsonify({

            "success": False,

            "message":
                "Only accepted bookings can be completed."

        }), 400


    booking.status = "COMPLETED"


    return jsonify({

        "success": True,

        "message":
            "Work marked as completed.",

        "booking":
            booking.to_dict()

    })


# ============================================================
# ADD RATING
# ============================================================

@app.route("/rating", methods=["POST"])
def add_rating():

    global rating_counter

    data = request.json


    booking_id = data.get(
        "booking_id"
    )

    customer_id = data.get(
        "customer_id"
    )

    rating_value = data.get(
        "rating"
    )

    review = data.get(
        "review",
        ""
    )


    # Find booking

    booking = next(

        (
            b for b in bookings

            if b.booking_id
            == booking_id
        ),

        None
    )


    if booking is None:

        return jsonify({

            "success": False,

            "message":
                "Booking not found."

        }), 404


    if booking.status != "COMPLETED":

        return jsonify({

            "success": False,

            "message":
                "Work must be completed before rating."

        }), 400


    if booking.customer_id != customer_id:

        return jsonify({

            "success": False,

            "message":
                "You cannot rate this booking."

        }), 403


    # Check if already rated

    for existing_rating in ratings:

        if (
            existing_rating.booking_id
            == booking_id
        ):

            return jsonify({

                "success": False,

                "message":
                    "This booking has already been rated."

            }), 400


    # Validate rating

    try:

        rating_value = int(
            rating_value
        )

    except (TypeError, ValueError):

        return jsonify({

            "success": False,

            "message":
                "Rating must be a number."

        }), 400


    if rating_value < 1 or rating_value > 5:

        return jsonify({

            "success": False,

            "message":
                "Rating must be between 1 and 5."

        }), 400


    rating_id = (
        f"R{rating_counter:03d}"
    )

    rating_counter += 1


    rating = Rating(

        rating_id,

        booking_id,

        customer_id,

        booking.worker_id,

        rating_value,

        review

    )


    ratings.append(rating)


    return jsonify({

        "success": True,

        "message":
            "Rating submitted.",

        "rating":
            rating.to_dict()

    })


# ============================================================
# GET WORKER RATINGS
# ============================================================

@app.route(
    "/ratings/worker/<worker_id>",
    methods=["GET"]
)
def get_worker_ratings(worker_id):

    worker_ratings = [

        rating

        for rating in ratings

        if rating.worker_id
        == worker_id

    ]


    if len(worker_ratings) == 0:

        return jsonify({

            "success": True,

            "average_rating": None,

            "number_of_ratings": 0,

            "ratings": []

        })


    total = sum(

        rating.rating

        for rating in worker_ratings

    )


    average = (
        total /
        len(worker_ratings)
    )


    return jsonify({

        "success": True,

        "average_rating":
            round(average, 1),

        "number_of_ratings":
            len(worker_ratings),

        "ratings": [

            rating.to_dict()

            for rating in worker_ratings

        ]

    })


# ============================================================
# CHANGE WORKER AVAILABILITY
# ============================================================

@app.route(
    "/worker/<worker_id>/availability",
    methods=["POST"]
)
def change_availability(worker_id):

    worker = next(

        (
            w for w in workers

            if w.worker_id
            == worker_id
        ),

        None
    )


    if worker is None:

        return jsonify({

            "success": False,

            "message":
                "Worker not found."

        }), 404


    data = request.json


    if "available" not in data:

        return jsonify({

            "success": False,

            "message":
                "Availability value required."

        }), 400


    worker.available = bool(
        data["available"]
    )


    return jsonify({

        "success": True,

        "available":
            worker.available

    })


# ============================================================
# WORKER EARNINGS
# ============================================================

@app.route(
    "/worker/<worker_id>/earnings",
    methods=["GET"]
)
def worker_earnings(worker_id):

    # Payment has intentionally not been
    # implemented yet.

    completed_bookings = [

        booking

        for booking in bookings

        if (
            booking.worker_id
            == worker_id
            and
            booking.status
            == "COMPLETED"
        )

    ]


    return jsonify({

        "success": True,

        "message":
            "Payment functionality will be added later.",

        "completed_jobs":
            len(completed_bookings),

        "earnings":
            0

    })



# ============================================================
# SUBSCRIPTION ROUTES (IDEA #3)
# ============================================================

@app.route("/subscriptions/plans", methods=["GET"])
def get_subscription_plans():
    return jsonify({
        "success": True,
        "plans": SUBSCRIPTION_PLANS
    })


@app.route("/subscriptions/subscribe", methods=["POST"])
def create_subscription():
    global subscription_counter
    data = request.json or {}
    customer_id = data.get("customer_id")
    plan_id = data.get("plan_id")
    billing_cycle = data.get("billing_cycle", "monthly")

    if not customer_id or not plan_id:
        return jsonify({
            "success": False,
            "message": "customer_id and plan_id are required."
        }), 400

    plan = next((p for p in SUBSCRIPTION_PLANS if p["plan_id"] == plan_id), None)
    if not plan:
        return jsonify({
            "success": False,
            "message": "Subscription plan not found."
        }), 404

    for sub in subscriptions:
        if sub["customer_id"] == customer_id and sub["status"] == "ACTIVE":
            sub["status"] = "SUPERSEDED"

    sub_id = f"SUB{subscription_counter:03d}"
    subscription_counter += 1

    amount = plan["price_annual"] if billing_cycle == "annual" else plan["price_monthly"]

    new_sub = {
        "subscription_id": sub_id,
        "customer_id": customer_id,
        "plan_id": plan["plan_id"],
        "plan_title": plan["title"],
        "subtitle": plan["subtitle"],
        "services": plan["services"],
        "billing_cycle": billing_cycle,
        "amount": amount,
        "status": "ACTIVE",
        "start_date": "2026-09-11",
        "next_billing_date": "2026-10-11" if billing_cycle == "monthly" else "2027-09-11",
        "visits_remaining": 4 if plan_id == "sub_total_home" else (999 if plan_id == "sub_society_office" else 2)
    }
    subscriptions.append(new_sub)

    return jsonify({
        "success": True,
        "message": f"Successfully subscribed to {plan['title']}!",
        "subscription": new_sub
    })


@app.route("/subscriptions/customer/<customer_id>", methods=["GET"])
def get_customer_subscriptions(customer_id):
    active_sub = next((s for s in subscriptions if s["customer_id"] == customer_id and s["status"] == "ACTIVE"), None)
    cust_subs = [s for s in subscriptions if s["customer_id"] == customer_id]
    return jsonify({
        "success": True,
        "has_active_subscription": active_sub is not None,
        "active_subscription": active_sub,
        "all_subscriptions": cust_subs
    })


@app.route("/subscriptions/cancel", methods=["POST"])
def cancel_subscription():
    data = request.json or {}
    subscription_id = data.get("subscription_id")
    customer_id = data.get("customer_id")

    sub = next((s for s in subscriptions if s.get("subscription_id") == subscription_id or (customer_id and s["customer_id"] == customer_id and s["status"] == "ACTIVE")), None)
    if not sub:
        return jsonify({
            "success": False,
            "message": "Active subscription not found."
        }), 404

    sub["status"] = "CANCELLED"
    return jsonify({
        "success": True,
        "message": "Subscription cancelled successfully.",
        "subscription": sub
    })


# ============================================================
# BEST WORK PORTFOLIO ROUTES (IDEA #4)
# ============================================================

@app.route("/worker/<worker_id>/portfolio", methods=["GET"])
def get_worker_portfolio(worker_id):
    items = worker_portfolios.get(worker_id, [])
    worker = next((w for w in workers if w.worker_id == worker_id), None)
    worker_name = worker.full_name if worker else "Partner"

    return jsonify({
        "success": True,
        "worker_id": worker_id,
        "worker_name": worker_name,
        "total_showcases": len(items),
        "portfolio": items
    })


@app.route("/worker/<worker_id>/portfolio", methods=["POST"])
def add_worker_portfolio(worker_id):
    global portfolio_counter
    data = request.json or {}

    title = data.get("title", "").strip()
    image_url = data.get("image_url", "").strip()
    description = data.get("description", "").strip()
    category = data.get("category", "General Craftsmanship").strip()
    tags = data.get("tags", ["Verified Work", "Quality Assured"])

    if not title:
        return jsonify({
            "success": False,
            "message": "Project title is required."
        }), 400

    if not image_url:
        image_url = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80"

    portfolio_counter += 1
    new_item = {
        "id": f"PORT-{worker_id}-{portfolio_counter}",
        "worker_id": worker_id,
        "title": title,
        "category": category,
        "description": description or "Showcase of verified craftsmanship and meticulous doorstep service.",
        "completed_date": "September 2026",
        "image_url": image_url,
        "tags": tags if isinstance(tags, list) else [t.strip() for t in str(tags).split(",") if t.strip()],
        "verified_by_platform": True
    }

    if worker_id not in worker_portfolios:
        worker_portfolios[worker_id] = []

    worker_portfolios[worker_id].insert(0, new_item)

    return jsonify({
        "success": True,
        "message": "Portfolio showcase item added successfully!",
        "item": new_item
    }), 201


# ============================================================
# RELIABILITY SCORE ROUTE (IDEA #8)
# ============================================================

@app.route("/worker/<worker_id>/reliability", methods=["GET"])
def get_worker_reliability(worker_id):
    worker = next((w for w in workers if w.worker_id == worker_id), None)
    if not worker:
        return jsonify({
            "success": False,
            "message": "Worker not found."
        }), 404

    reliability_data = calculate_worker_reliability(worker_id)
    reliability_data["worker_name"] = worker.full_name
    reliability_data["primary_skill"] = worker.primary_skill

    return jsonify({
        "success": True,
        "reliability": reliability_data
    })



# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    print()
    print("========================================")
    print("   COOPERATIVE SERVICES BACKEND")
    print("========================================")
    print()
    print("Data is stored temporarily in memory.")
    print("Stopping this program will erase")
    print("all customers, workers, bookings")
    print("and ratings.")
    print()

    import os

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )



