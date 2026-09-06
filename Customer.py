
# ============================================================
# CUSTOMER CLASS
# ============================================================

class Customer:

    def __init__(
        self,
        customer_id,
        full_name,
        password,
        mobile_number,
        email,
        address,
        pincode
    ):
        self.customer_id = customer_id
        self.full_name = full_name
        self.password = password
        self.mobile_number = mobile_number
        self.email = email
        self.address = address
        self.pincode = pincode

    def to_dict(self):
        return {
            "customer_id": self.customer_id,
            "full_name": self.full_name,
            "password": self.password,
            "mobile_number": self.mobile_number,
            "email": self.email,
            "address": self.address,
            "pincode": self.pincode
        }
