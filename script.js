
// ============================================================
// BACKEND URL
// ============================================================

const API_URL = "";


// ============================================================
// CURRENT LOGGED-IN USER
// ============================================================

let currentUser = null;
let currentUserType = null;


// ============================================================
// PAGE CONTROL
// ============================================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}


// ============================================================
// LOGIN
// ============================================================

document.getElementById("loginButton").addEventListener(
    "click",
    async function() {

        const mobile =
            document.getElementById("loginMobile").value;

        const password =
            document.getElementById("loginPassword").value;


        if (!mobile || !password) {

            document.getElementById("loginMessage").textContent =
                "Please enter mobile number and password.";

            return;
        }


        try {

            const response = await fetch(
                API_URL + "/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        mobile_number: mobile,
                        password: password

                    })
                }
            );


            const data = await response.json();


            if (!data.success) {

                document.getElementById("loginMessage").textContent =
                    data.message;

                return;
            }


            currentUser = data.user;
            currentUserType = data.user_type;


            document.getElementById("loginMessage").textContent =
                "";


            if (currentUserType === "customer") {

                document.getElementById(
                    "customerWelcome"
                ).textContent =
                    currentUser.full_name;

                showPage("customerDashboard");

            }


            else if (currentUserType === "worker") {

                document.getElementById(
                    "workerWelcome"
                ).textContent =
                    currentUser.full_name;

                showPage("workerDashboard");

            }

        }


        catch (error) {

            console.error(error);

            document.getElementById("loginMessage").textContent =
                "Could not connect to the server.";

        }

    }
);


// ============================================================
// CUSTOMER SIGNUP PAGE
// ============================================================

document.getElementById(
    "customerSignupButton"
).addEventListener(
    "click",
    function() {

        showPage("customerSignupPage");

    }
);


// ============================================================
// WORKER SIGNUP PAGE
// ============================================================

document.getElementById(
    "workerSignupButton"
).addEventListener(
    "click",
    function() {

        showPage("workerSignupPage");

    }
);


// ============================================================
// CUSTOMER SIGNUP
// ============================================================

document.getElementById(
    "customerSignupSubmit"
).addEventListener(
    "click",
    async function() {

        const data = {

            full_name:
                document.getElementById(
                    "customerName"
                ).value,

            password:
                document.getElementById(
                    "customerPassword"
                ).value,

            mobile_number:
                document.getElementById(
                    "customerMobile"
                ).value,

            email:
                document.getElementById(
                    "customerEmail"
                ).value,

            address:
                document.getElementById(
                    "customerAddress"
                ).value,

            pincode:
                document.getElementById(
                    "customerPincode"
                ).value

        };


        try {

            const response = await fetch(
                API_URL + "/signup/customer",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );


            const result = await response.json();


            const message =
                document.getElementById(
                    "customerSignupMessage"
                );


            if (result.success) {

                message.textContent =
                    "Account created successfully. Please login.";

            }

            else {

                message.textContent =
                    result.message;

            }

        }


        catch (error) {

            console.error(error);

            document.getElementById(
                "customerSignupMessage"
            ).textContent =
                "Could not connect to the server.";

        }

    }
);


// ============================================================
// WORKER SIGNUP
// ============================================================

document.getElementById(
    "workerSignupSubmit"
).addEventListener(
    "click",
    async function() {

        const data = {

            full_name:
                document.getElementById(
                    "workerName"
                ).value,

            password:
                document.getElementById(
                    "workerPassword"
                ).value,

            mobile_number:
                document.getElementById(
                    "workerMobile"
                ).value,

            email:
                document.getElementById(
                    "workerEmail"
                ).value,

            age:
                document.getElementById(
                    "workerAge"
                ).value,

            current_address:
                document.getElementById(
                    "workerAddress"
                ).value,

            city:
                document.getElementById(
                    "workerCity"
                ).value,

            pincode:
                document.getElementById(
                    "workerPincode"
                ).value,

            primary_skill:
                document.getElementById(
                    "workerSkill"
                ).value,

            additional_skills:
                document.getElementById(
                    "workerAdditionalSkills"
                ).value,

            years_of_experience:
                document.getElementById(
                    "workerExperience"
                ).value,

            description:
                document.getElementById(
                    "workerDescription"
                ).value,

            preferred_working_hours:
                document.getElementById(
                    "workerHours"
                ).value

        };


        try {

            const response = await fetch(
                API_URL + "/signup/worker",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );


            const result = await response.json();


            const message =
                document.getElementById(
                    "workerSignupMessage"
                );


            if (result.success) {

                message.textContent =
                    "Worker account created successfully. Please login.";

            }

            else {

                message.textContent =
                    result.message;

            }

        }


        catch (error) {

            console.error(error);

            document.getElementById(
                "workerSignupMessage"
            ).textContent =
                "Could not connect to the server.";

        }

    }
);


// ============================================================
// BACK TO LOGIN
// ============================================================

document.getElementById(
    "customerSignupBack"
).addEventListener(
    "click",
    function() {

        showPage("loginPage");

    }
);


document.getElementById(
    "workerSignupBack"
).addEventListener(
    "click",
    function() {

        showPage("loginPage");

    }
);


// ============================================================
// CUSTOMER - FIND WORKER
// ============================================================

document.getElementById(
    "findWorkerButton"
).addEventListener(
    "click",
    function() {

        const content =
            document.getElementById(
                "customerContent"
            );


        content.innerHTML = `

            <h2>Find a Worker</h2>

            <label>
                Select Service
            </label>

            <select id="serviceSelect">

                <option value="Electrician">
                    Electrician
                </option>

                <option value="Plumber">
                    Plumber
                </option>

                <option value="Carpenter">
                    Carpenter
                </option>

                <option value="Painter">
                    Painter
                </option>

                <option value="Cleaner">
                    Cleaner
                </option>

                <option value="Driver">
                    Driver
                </option>

                <option value="Other">
                    Other
                </option>

            </select>

            <button id="searchWorkersButton">
                Search
            </button>

            <div id="workerResults"></div>

        `;


        document.getElementById(
            "searchWorkersButton"
        ).addEventListener(
            "click",
            searchWorkers
        );

    }
);


// ============================================================
// SEARCH WORKERS
// ============================================================

async function searchWorkers() {

    const service =
        document.getElementById(
            "serviceSelect"
        ).value;


    const results =
        document.getElementById(
            "workerResults"
        );


    results.innerHTML =
        "Searching...";


    try {

        const response = await fetch(

            API_URL +
            "/workers?service=" +
            encodeURIComponent(service)

        );


        const data =
            await response.json();


        if (
            !data.success ||
            data.workers.length === 0
        ) {

            results.innerHTML =
                "<p>No available workers found.</p>";

            return;
        }


        results.innerHTML =
            "<h3>Available Workers</h3>";


        data.workers.forEach(
            function(worker) {

                let ratingText =
                    "No ratings yet";


                if (
                    worker.average_rating !== null
                ) {

                    ratingText =
                        worker.average_rating +
                        " / 5 (" +
                        worker.number_of_ratings +
                        " ratings)";

                }


                const workerCard =
                    document.createElement(
                        "div"
                    );


                workerCard.className =
                    "worker-card";


                workerCard.innerHTML = `

                    <h3>
                        ${worker.full_name}
                    </h3>

                    <p>
                        Skill:
                        ${worker.primary_skill}
                    </p>

                    <p>
                        Experience:
                        ${worker.years_of_experience}
                        years
                    </p>

                    <p>
                        About:
                        ${worker.description}
                    </p>

                    <p>
                        Working hours:
                        ${worker.preferred_working_hours}
                    </p>

                    <p>
                        Rating:
                        ${ratingText}
                    </p>

                    <button>
                        Book Worker
                    </button>

                `;


                const bookButton =
                    workerCard.querySelector(
                        "button"
                    );


                bookButton.addEventListener(
                    "click",
                    function() {

                        showBookingForm(worker);

                    }
                );


                results.appendChild(
                    workerCard
                );

            }
        );

    }


    catch (error) {

        console.error(error);

        results.innerHTML =
            "<p>Could not connect to the server.</p>";

    }

}


// ============================================================
// BOOKING FORM
// ============================================================

function showBookingForm(worker) {

    const content =
        document.getElementById(
            "customerContent"
        );


    content.innerHTML = `

        <h2>Book Worker</h2>

        <p>
            Worker:
            ${worker.full_name}
        </p>

        <p>
            Service:
            ${worker.primary_skill}
        </p>

        <label>
            Select Date
        </label>

        <input
            type="date"
            id="bookingDate"
        >

        <button id="confirmBookingButton">
            Confirm Booking
        </button>

        <button id="backToWorkersButton">
            Back
        </button>

        <p id="bookingMessage"></p>

    `;


    document.getElementById(
        "confirmBookingButton"
    ).addEventListener(
        "click",
        function() {

            createBooking(worker);

        }
    );


    document.getElementById(
        "backToWorkersButton"
    ).addEventListener(
        "click",
        function() {

            document.getElementById(
                "findWorkerButton"
            ).click();

        }
    );

}


// ============================================================
// CREATE BOOKING
// ============================================================

async function createBooking(worker) {

    const date =
        document.getElementById(
            "bookingDate"
        ).value;


    if (!date) {

        document.getElementById(
            "bookingMessage"
        ).textContent =
            "Please select a date.";

        return;
    }


    const data = {

        customer_id:
            currentUser.customer_id,

        worker_id:
            worker.worker_id,

        date: date

    };


    try {

        const response = await fetch(
            API_URL + "/book",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        document.getElementById(
            "bookingMessage"
        ).textContent =
            result.message;


        if (result.success) {

            setTimeout(
                function() {

                    loadCustomerBookings();

                },
                1000
            );

        }

    }


    catch (error) {

        console.error(error);

        document.getElementById(
            "bookingMessage"
        ).textContent =
            "Could not connect to the server.";

    }

}


// ============================================================
// CUSTOMER BOOKINGS
// ============================================================

document.getElementById(
    "customerBookingsButton"
).addEventListener(
    "click",
    loadCustomerBookings
);


async function loadCustomerBookings() {

    const content =
        document.getElementById(
            "customerContent"
        );


    content.innerHTML =
        "<h2>My Bookings</h2><p>Loading...</p>";


    try {

        const response = await fetch(

            API_URL +
            "/bookings/customer/" +
            currentUser.customer_id

        );


        const data =
            await response.json();


        if (
            data.bookings.length === 0
        ) {

            content.innerHTML = `

                <h2>My Bookings</h2>

                <p>
                    You have no bookings.
                </p>

            `;

            return;
        }


        content.innerHTML =
            "<h2>My Bookings</h2>";


        data.bookings.forEach(
            function(booking) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-card";


                let buttons = "";


                if (
                    booking.status ===
                    "ACCEPTED"
                ) {

                    buttons += `

                        <button
                            class="complete-button"
                        >
                            Service Completed
                        </button>

                    `;

                }


                if (
                    booking.status ===
                    "COMPLETED"
                ) {

                    buttons += `

                        <button
                            class="rating-button"
                        >
                            Give Rating / Review
                        </button>

                    `;

                }


                card.innerHTML = `

                    <h3>
                        Booking ${booking.booking_id}
                    </h3>

                    <p>
                        Worker:
                        ${booking.worker_name || "Unknown"}
                    </p>

                    <p>
                        Service:
                        ${booking.service}
                    </p>

                    <p>
                        Date:
                        ${booking.date}
                    </p>

                    <p>
                        Status:
                        ${booking.status}
                    </p>

                    ${buttons}

                `;


                const completeButton =
                    card.querySelector(
                        ".complete-button"
                    );


                if (completeButton) {

                    completeButton.addEventListener(
                        "click",
                        function() {

                            completeBooking(
                                booking.booking_id
                            );

                        }
                    );

                }


                const ratingButton =
                    card.querySelector(
                        ".rating-button"
                    );


                if (ratingButton) {

                    ratingButton.addEventListener(
                        "click",
                        function() {

                            showRatingForm(
                                booking
                            );

                        }
                    );

                }


                content.appendChild(card);

            }
        );

    }


    catch (error) {

        console.error(error);

        content.innerHTML =
            "<p>Could not connect to the server.</p>";

    }

}


// ============================================================
// COMPLETE SERVICE
// ============================================================

async function completeBooking(
    bookingId
) {

    const response = await fetch(

        API_URL +
        "/booking/" +
        bookingId +
        "/complete",

        {
            method: "POST"
        }

    );


    const data =
        await response.json();


    alert(data.message);


    if (data.success) {

        loadCustomerBookings();

    }

}


// ============================================================
// RATING FORM
// ============================================================

function showRatingForm(booking) {

    const content =
        document.getElementById(
            "customerContent"
        );


    content.innerHTML = `

        <h2>Rate Worker</h2>

        <p>
            Worker:
            ${booking.worker_name}
        </p>

        <label>
            Rating (1 - 5)
        </label>

        <select id="ratingValue">

            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>

        </select>


        <label>
            Review
        </label>

        <textarea
            id="reviewText"
            rows="5"
        ></textarea>


        <button id="submitRatingButton">
            Submit Rating
        </button>


        <p id="ratingMessage"></p>

    `;


    document.getElementById(
        "submitRatingButton"
    ).addEventListener(
        "click",
        function() {

            submitRating(booking);

        }
    );

}


// ============================================================
// SUBMIT RATING
// ============================================================

async function submitRating(booking) {

    const rating =
        document.getElementById(
            "ratingValue"
        ).value;


    const review =
        document.getElementById(
            "reviewText"
        ).value;


    const data = {

        booking_id:
            booking.booking_id,

        customer_id:
            currentUser.customer_id,

        rating:
            rating,

        review:
            review

    };


    try {

        const response = await fetch(
            API_URL + "/rating",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        document.getElementById(
            "ratingMessage"
        ).textContent =
            result.message;


        if (result.success) {

            setTimeout(
                function() {

                    loadCustomerBookings();

                },
                1000
            );

        }

    }


    catch (error) {

        console.error(error);

        document.getElementById(
            "ratingMessage"
        ).textContent =
            "Could not connect to the server.";

    }

}


// ============================================================
// CUSTOMER PROFILE
// ============================================================

document.getElementById(
    "customerProfileButton"
).addEventListener(
    "click",
    function() {

        const content =
            document.getElementById(
                "customerContent"
            );


        content.innerHTML = `

            <h2>My Profile</h2>

            <p>
                Name:
                ${currentUser.full_name}
            </p>

            <p>
                Mobile:
                ${currentUser.mobile_number}
            </p>

            <p>
                Email:
                ${currentUser.email || "Not provided"}
            </p>

            <p>
                Address:
                ${currentUser.address}
            </p>

            <p>
                Pincode:
                ${currentUser.pincode}
            </p>

        `;

    }
);


// ============================================================
// WORKER PROFILE
// ============================================================

document.getElementById(
    "workerProfileButton"
).addEventListener(
    "click",
    function() {

        const content =
            document.getElementById(
                "workerContent"
            );


        content.innerHTML = `

            <h2>My Profile</h2>

            <p>
                Name:
                ${currentUser.full_name}
            </p>

            <p>
                Mobile:
                ${currentUser.mobile_number}
            </p>

            <p>
                Email:
                ${currentUser.email || "Not provided"}
            </p>

            <p>
                Age:
                ${currentUser.age}
            </p>

            <p>
                Address:
                ${currentUser.current_address}
            </p>

            <p>
                City:
                ${currentUser.city}
            </p>

            <p>
                Pincode:
                ${currentUser.pincode}
            </p>

            <p>
                Primary Skill:
                ${currentUser.primary_skill}
            </p>

            <p>
                Additional Skills:
                ${currentUser.additional_skills}
            </p>

            <p>
                Experience:
                ${currentUser.years_of_experience}
                years
            </p>

            <p>
                About:
                ${currentUser.description}
            </p>

            <p>
                Preferred Working Hours:
                ${currentUser.preferred_working_hours}
            </p>

        `;

    }
);


// ============================================================
// WORKER BOOKINGS
// ============================================================

document.getElementById(
    "workerBookingsButton"
).addEventListener(
    "click",
    loadWorkerBookings
);


async function loadWorkerBookings() {

    const content =
        document.getElementById(
            "workerContent"
        );


    content.innerHTML =
        "<h2>My Bookings</h2><p>Loading...</p>";


    try {

        const response = await fetch(

            API_URL +
            "/bookings/worker/" +
            currentUser.worker_id

        );


        const data =
            await response.json();


        if (
            data.bookings.length === 0
        ) {

            content.innerHTML = `

                <h2>My Bookings</h2>

                <p>
                    You have no bookings.
                </p>

            `;

            return;
        }


        content.innerHTML =
            "<h2>My Bookings</h2>";


        data.bookings.forEach(
            function(booking) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-card";


                let buttons = "";


                if (
                    booking.status ===
                    "PENDING"
                ) {

                    buttons = `

                        <button
                            class="accept-button"
                        >
                            Accept
                        </button>

                        <button
                            class="reject-button"
                        >
                            Reject
                        </button>

                    `;

                }


                card.innerHTML = `

                    <h3>
                        Booking ${booking.booking_id}
                    </h3>

                    <p>
                        Customer:
                        ${booking.customer_name || "Unknown"}
                    </p>

                    <p>
                        Service:
                        ${booking.service}
                    </p>

                    <p>
                        Date:
                        ${booking.date}
                    </p>

                    <p>
                        Status:
                        ${booking.status}
                    </p>

                    ${buttons}

                `;


                const acceptButton =
                    card.querySelector(
                        ".accept-button"
                    );


                if (acceptButton) {

                    acceptButton.addEventListener(
                        "click",
                        function() {

                            updateBookingStatus(
                                booking.booking_id,
                                "accept"
                            );

                        }
                    );

                }


                const rejectButton =
                    card.querySelector(
                        ".reject-button"
                    );


                if (rejectButton) {

                    rejectButton.addEventListener(
                        "click",
                        function() {

                            updateBookingStatus(
                                booking.booking_id,
                                "reject"
                            );

                        }
                    );

                }


                content.appendChild(card);

            }
        );

    }


    catch (error) {

        console.error(error);

        content.innerHTML =
            "<p>Could not connect to the server.</p>";

    }

}


// ============================================================
// ACCEPT / REJECT BOOKING
// ============================================================

async function updateBookingStatus(
    bookingId,
    action
) {

    try {

        const response = await fetch(

            API_URL +
            "/booking/" +
            bookingId +
            "/" +
            action,

            {
                method: "POST"
            }

        );


        const data =
            await response.json();


        alert(data.message);


        if (data.success) {

            loadWorkerBookings();

        }

    }


    catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }

}


// ============================================================
// WORKER AVAILABILITY
// ============================================================

document.getElementById(
    "availabilityButton"
).addEventListener(
    "click",
    function() {

        const content =
            document.getElementById(
                "workerContent"
            );


        const status =
            currentUser.available
            ? "Available"
            : "Unavailable";


        content.innerHTML = `

            <h2>Availability</h2>

            <p>
                Current status:
                ${status}
            </p>

            <button id="toggleAvailabilityButton">
                Change Availability
            </button>

            <p id="availabilityMessage"></p>

        `;


        document.getElementById(
            "toggleAvailabilityButton"
        ).addEventListener(
            "click",
            toggleAvailability
        );

    }
);


// ============================================================
// TOGGLE AVAILABILITY
// ============================================================

async function toggleAvailability() {

    const newStatus =
        !currentUser.available;


    try {

        const response = await fetch(

            API_URL +
            "/worker/" +
            currentUser.worker_id +
            "/availability",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    available:
                        newStatus

                })

            }

        );


        const data =
            await response.json();


        if (data.success) {

            currentUser.available =
                data.available;


            const status =
                currentUser.available
                ? "Available"
                : "Unavailable";


            document.getElementById(
                "availabilityMessage"
            ).textContent =
                "You are now " + status + ".";

        }

        else {

            document.getElementById(
                "availabilityMessage"
            ).textContent =
                data.message;

        }

    }


    catch (error) {

        console.error(error);

        document.getElementById(
            "availabilityMessage"
        ).textContent =
            "Could not connect to the server.";

    }

}


// ============================================================
// WORKER EARNINGS
// ============================================================

document.getElementById(
    "earningsButton"
).addEventListener(
    "click",
    async function() {

        const content =
            document.getElementById(
                "workerContent"
            );


        try {

            const response = await fetch(

                API_URL +
                "/worker/" +
                currentUser.worker_id +
                "/earnings"

            );


            const data =
                await response.json();


            content.innerHTML = `

                <h2>Earnings</h2>

                <p>
                    Completed Jobs:
                    ${data.completed_jobs}
                </p>

                <p>
                    Earnings:
                    ₹${data.earnings}
                </p>

                <p>
                    ${data.message}
                </p>

            `;

        }


        catch (error) {

            console.error(error);

            content.innerHTML =
                "<p>Could not connect to the server.</p>";

        }

    }
);


// ============================================================
// LOGOUT
// ============================================================

document.getElementById(
    "customerLogoutButton"
).addEventListener(
    "click",
    logout
);


document.getElementById(
    "workerLogoutButton"
).addEventListener(
    "click",
    logout
);


function logout() {

    currentUser = null;
    currentUserType = null;


    document.getElementById(
        "loginMobile"
    ).value = "";


    document.getElementById(
        "loginPassword"
    ).value = "";


    document.getElementById(
        "loginMessage"
    ).textContent = "";


    showPage("loginPage");

}

