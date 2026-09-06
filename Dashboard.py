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
# TEMPORARY IN-MEMORY STORAGE
# ============================================================

workers = []
customers = []
bookings = []
ratings = []


# ============================================================
# ID COUNTERS
# ============================================================

customer_counter = 1
worker_counter = 1
booking_counter = 1
rating_counter = 1



# ============================================================
# HOME / TEST ROUTE
# ============================================================



@app.route("/")
def serve_website():
    return send_from_directory(".", "index.html")




@app.route("/script.js")
def serve_javascript():
    return send_from_directory(".", "script.js")


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


    if not service:

        return jsonify({

            "success": False,

            "message":
                "Please provide a service."

        }), 400


    matching_workers = []


    for worker in workers:

        if (
            worker.primary_skill.lower()
            == service.lower()
            and
            worker.available
        ):

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


    booking = Booking(

        booking_id,

        customer_id,

        worker_id,

        worker.primary_skill,

        date,

        "PENDING"

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
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    print()
    print("========================================")
    print("   COOPERATIVE SERVICES BACKEND")
    print("========================================")
    print()
    print("Server running at:")
    print("http://127.0.0.1:5000")
    print()
    print("Data is stored temporarily in memory.")
    print("Stopping this program will erase")
    print("all customers, workers, bookings")
    print("and ratings.")
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

