# ============================================================
# BOOKING CLASS 
# ============================================================ 

class Booking: 
    def __init__( 
            self, 
            booking_id, 
            customer_id, 
            worker_id, 
            service, 
            date, 
            status,
            problem_photo=None,
            problem_notes=None
            ): 
            self.booking_id = booking_id 
            self.customer_id = customer_id 
            self.worker_id = worker_id 
            self.service = service 
            self.date = date 
            self.status = status 
            self.problem_photo = problem_photo 
            self.problem_notes = problem_notes 

    def to_dict(self): 
        return { 
            "booking_id": self.booking_id, 
            "customer_id": self.customer_id, 
            "worker_id": self.worker_id, 
            "service": self.service, 
            "date": self.date, 
            "status": self.status,
            "problem_photo": self.problem_photo,
            "problem_notes": self.problem_notes
            }