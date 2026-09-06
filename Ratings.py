
# ============================================================
# RATING CLASS
# ============================================================

class Rating:

    def __init__(
        self,
        rating_id,
        booking_id,
        customer_id,
        worker_id,
        rating,
        review
    ):
        self.rating_id = rating_id
        self.booking_id = booking_id
        self.customer_id = customer_id
        self.worker_id = worker_id
        self.rating = rating
        self.review = review

    def to_dict(self):
        return {
            "rating_id": self.rating_id,
            "booking_id": self.booking_id,
            "customer_id": self.customer_id,
            "worker_id": self.worker_id,
            "rating": self.rating,
            "review": self.review
        }