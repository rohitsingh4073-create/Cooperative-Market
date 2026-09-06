
# ============================================================
# WORKER CLASS
# ============================================================

class Worker:

    def __init__(
        self,
        worker_id,
        full_name,
        password,
        mobile_number,
        email,
        age,
        current_address,
        city,
        pincode,
        primary_skill,
        additional_skills,
        years_of_experience,
        description,
        available,
        preferred_working_hours
    ):
        self.worker_id = worker_id
        self.full_name = full_name
        self.password = password
        self.mobile_number = mobile_number
        self.email = email
        self.age = age
        self.current_address = current_address
        self.city = city
        self.pincode = pincode
        self.primary_skill = primary_skill
        self.additional_skills = additional_skills
        self.years_of_experience = years_of_experience
        self.description = description
        self.available = available
        self.preferred_working_hours = preferred_working_hours


    def to_dict(self):
        return {
            "worker_id": self.worker_id,
            "full_name": self.full_name,
            "password": self.password,
            "mobile_number": self.mobile_number,
            "email": self.email,
            "age": self.age,
            "current_address": self.current_address,
            "city": self.city,
            "pincode": self.pincode,
            "primary_skill": self.primary_skill,
            "additional_skills": self.additional_skills,
            "years_of_experience": self.years_of_experience,
            "description": self.description,
            "available": self.available,
            "preferred_working_hours": self.preferred_working_hours
        }
