// ============================================================
// BACKEND URL & API CONFIGURATION
// ============================================================

const API_URL = (window.location.protocol === "file:" || (window.location.port && window.location.port !== "5000"))
    ? "http://127.0.0.1:5000"
    : "";

// Default demo avatar images inspired by the Stitch design
const DEMO_AVATARS = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
];

// Trade base rates for realistic display
const TRADE_RATES = {
    "Electrician": "$85/hr",
    "Plumber": "$75/hr",
    "Carpenter": "$95/hr",
    "Painter": "$65/hr",
    "Cleaner": "$45/hr",
    "Driver": "$50/hr",
    "Other": "$60/hr"
};

// ============================================================
// SESSION MANAGEMENT
// ============================================================

let currentUser = null;
let currentUserType = null;
let currentActiveTrade = "";
let allFetchedWorkers = [];

function saveSession(user, userType) {
    currentUser = user;
    currentUserType = userType;
    try {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        sessionStorage.setItem("currentUserType", userType);
    } catch (e) {
        console.warn("Could not save session", e);
    }
    updateAuthUI();
}

function clearSession() {
    currentUser = null;
    currentUserType = null;
    try {
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserType");
    } catch (e) {
        console.warn("Could not clear session", e);
    }
    updateAuthUI();
}

function restoreSession() {
    try {
        const savedUser = sessionStorage.getItem("currentUser");
        const savedType = sessionStorage.getItem("currentUserType");
        if (savedUser && savedType) {
            currentUser = JSON.parse(savedUser);
            currentUserType = savedType;
            updateAuthUI();
            if (currentUserType === "worker") {
                switchTab("worker");
            } else {
                switchTab("customer");
            }
            return;
        }
    } catch (e) {
        console.warn("Could not restore session", e);
    }
    updateAuthUI();
    switchTab("customer");
}

function updateAuthUI() {
    const avatarInit = document.getElementById("userAvatarInitial");
    const authLabel = document.getElementById("userAuthLabel");
    const custWelcome = document.getElementById("customerWelcome");
    const workWelcome = document.getElementById("workerWelcome");

    if (currentUser) {
        const name = currentUser.full_name || "User";
        const initial = name[0].toUpperCase();
        if (avatarInit) avatarInit.textContent = initial;
        if (authLabel) authLabel.textContent = name.split(" ")[0];
        if (custWelcome) custWelcome.textContent = name;
        if (workWelcome) workWelcome.textContent = name;
    } else {
        if (avatarInit) avatarInit.textContent = "U";
        if (authLabel) authLabel.textContent = "Sign In";
        if (custWelcome) custWelcome.textContent = "Guest";
        if (workWelcome) workWelcome.textContent = "Partner";
    }
}

// Legacy showPage helper to maintain backward compatibility
function showPage(pageId) {
    if (pageId === "workerDashboard") {
        switchTab("worker");
    } else if (pageId === "customerDashboard") {
        switchTab("customer");
    } else if (pageId === "loginPage") {
        openAuthModal("login");
    } else if (pageId === "customerSignupPage") {
        openAuthModal("customerSignup");
    } else if (pageId === "workerSignupPage") {
        openAuthModal("workerSignup");
    }
}

// ============================================================
// TAB NAVIGATION (Customer View vs. Worker Dashboard)
// ============================================================

const tabCustomer = document.getElementById("tabCustomer");
const tabWorker = document.getElementById("tabWorker");
const customerPanel = document.getElementById("customerPanel");
const workerPanel = document.getElementById("workerPanel");

function switchTab(target) {
    if (target === "customer") {
        tabCustomer.classList.add("active");
        tabWorker.classList.remove("active");
        customerPanel.classList.add("active");
        workerPanel.classList.remove("active");
        loadAvailableWorkers(currentActiveTrade);
    } else if (target === "worker") {
        if (!currentUser || currentUserType !== "worker") {
            // If not logged in as worker, open login modal
            openAuthModal("login");
            const loginMsg = document.getElementById("loginMessage");
            if (loginMsg) loginMsg.textContent = "Please sign in with a worker account to view the Worker Dashboard.";
            return;
        }
        tabWorker.classList.add("active");
        tabCustomer.classList.remove("active");
        workerPanel.classList.add("active");
        customerPanel.classList.remove("active");
        loadWorkerDashboardData();
    }
}

tabCustomer.addEventListener("click", () => switchTab("customer"));
tabWorker.addEventListener("click", () => switchTab("worker"));
document.getElementById("logoBrandTitle").addEventListener("click", () => switchTab("customer"));

// ============================================================
// WORKER SEARCH & MARKETPLACE (Customer View)
// ============================================================

async function loadAvailableWorkers(serviceFilter = "") {
    const grid = document.getElementById("professionalsGrid");
    const counter = document.getElementById("resultsCounter");
    if (!grid) return;

    grid.innerHTML = "<div style='grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);'>Loading trusted professionals...</div>";

    try {
        const url = serviceFilter
            ? `${API_URL}/workers?service=${encodeURIComponent(serviceFilter)}&all=true`
            : `${API_URL}/workers?all=true`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.success || !data.workers || data.workers.length === 0) {
            allFetchedWorkers = [];
            grid.innerHTML = `
                <div style="grid-column: 1/-1; background: #fff; border: 1px solid var(--border-color); border-radius: 16px; padding: 48px 20px; text-align: center;">
                    <p style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 6px;">No available workers found</p>
                    <p style="font-size: 13.5px; color: var(--text-secondary);">Try selecting another trade or clearing the search filter.</p>
                </div>
            `;
            if (counter) counter.textContent = "SHOWING 0 RESULTS";
            return;
        }

        allFetchedWorkers = data.workers;
        renderWorkerCards(allFetchedWorkers);

    } catch (err) {
        console.error("Worker fetch error:", err);
        grid.innerHTML = "<div style='grid-column: 1/-1; padding: 30px; text-align: center; color: #dc2626;'>Could not connect to server.</div>";
    }
}

function renderWorkerCards(workers) {
    const grid = document.getElementById("professionalsGrid");
    const counter = document.getElementById("resultsCounter");
    if (!grid) return;

    if (counter) {
        counter.textContent = `SHOWING ${workers.length} RESULTS`;
    }

    grid.innerHTML = "";

    workers.forEach((worker, idx) => {
        const isAvail = worker.available !== false;
        const avatarUrl = DEMO_AVATARS[idx % DEMO_AVATARS.length];
        const initial = (worker.full_name || "W")[0].toUpperCase();

        let ratingVal = worker.average_rating ? Number(worker.average_rating).toFixed(1) : "4.9";
        let reviewsCount = worker.number_of_ratings ? worker.number_of_ratings : (80 + (idx * 23));
        let rateText = TRADE_RATES[worker.primary_skill] || "$75/hr";

        if (worker.full_name === "Sarah Jenkins") {
            ratingVal = "4.9";
            reviewsCount = 128;
            rateText = "$85/hr";
        } else if (worker.full_name === "Michael Torres") {
            ratingVal = "4.7";
            reviewsCount = 94;
            rateText = "$75/hr";
        } else if (worker.full_name === "David Chen") {
            ratingVal = "5.0";
            reviewsCount = 215;
            rateText = "$95/hr";
        }

        const card = document.createElement("div");
        card.className = "pro-card";

        const statusPillHtml = isAvail
            ? `<span class="status-pill status-available"><span class="status-dot"></span>Available</span>`
            : `<span class="status-pill status-booked"><span class="status-dot"></span>Booked</span>`;

        const actionBtnHtml = isAvail
            ? `<button class="btn-book" data-worker-id="${worker.worker_id}">Book Now</button>`
            : `<button class="btn-booked-outline" disabled>Next Avail: Tue</button>`;

        card.innerHTML = `
            <div>
                <div class="pro-card-header">
                    <div class="pro-card-user">
                        <img src="${avatarUrl}" alt="${worker.full_name}" class="pro-avatar" onerror="this.outerHTML='<div class=\\'pro-avatar\\'>${initial}</div>'">
                        <div>
                            <h3 class="pro-name">${worker.full_name}</h3>
                            <div class="pro-rating">
                                <span class="star">★</span>
                                <strong style="color: var(--text-main); font-weight: 600;">${ratingVal}</strong>
                                <span>(${reviewsCount} reviews)</span>
                            </div>
                        </div>
                    </div>
                    ${statusPillHtml}
                </div>

                <p class="pro-description">
                    ${worker.description || `${worker.primary_skill} professional with ${worker.years_of_experience || 5}+ years of verified industry experience.`}
                </p>

                <div class="pro-tags-row">
                    <span class="tag-pill">${worker.primary_skill}</span>
                    ${worker.additional_skills ? `<span class="tag-pill">${worker.additional_skills.split(',')[0]}</span>` : ''}
                </div>
            </div>

            <div class="pro-card-footer">
                <div class="pro-rate">${rateText}</div>
                ${actionBtnHtml}
            </div>
        `;

        const bookBtn = card.querySelector(".btn-book");
        if (bookBtn) {
            bookBtn.addEventListener("click", () => {
                handleBookWorkerClick(worker);
            });
        }

        grid.appendChild(card);
    });
}

// Filter pills interaction
const filterContainer = document.getElementById("filterPillsContainer");
if (filterContainer) {
    filterContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-pill")) {
            filterContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
            e.target.classList.add("active");
            currentActiveTrade = e.target.getAttribute("data-skill") || "";
            loadAvailableWorkers(currentActiveTrade);
        }
    });
}

// Live search input filtering
const searchInput = document.getElementById("serviceSearchInput");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderWorkerCards(allFetchedWorkers);
            return;
        }
        const filtered = allFetchedWorkers.filter(w =>
            (w.full_name && w.full_name.toLowerCase().includes(query)) ||
            (w.primary_skill && w.primary_skill.toLowerCase().includes(query)) ||
            (w.city && w.city.toLowerCase().includes(query)) ||
            (w.description && w.description.toLowerCase().includes(query))
        );
        renderWorkerCards(filtered);
    });
}

// ============================================================
// BOOKING FLOW (Customer View)
// ============================================================

function handleBookWorkerClick(worker) {
    if (!currentUser) {
        openAuthModal("login");
        const loginMsg = document.getElementById("loginMessage");
        if (loginMsg) loginMsg.textContent = "Please sign in to book " + worker.full_name;
        return;
    }

    if (currentUserType !== "customer") {
        alert("Please switch to a customer account to make bookings.");
        return;
    }

    const dynContainer = document.getElementById("customerDynamicContainer");
    if (!dynContainer) return;

    dynContainer.style.display = "block";
    dynContainer.innerHTML = `
        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 24px; box-shadow: var(--shadow-card); max-width: 520px; margin: 0 auto;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="font-size: 18px; font-weight: 700;">Book ${worker.full_name}</h3>
                <button id="closeBookingFormBtn" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted);">&times;</button>
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 16px;">
                Trade: <strong>${worker.primary_skill}</strong> &bull; Rate: <strong>${TRADE_RATES[worker.primary_skill] || "$75/hr"}</strong>
            </p>

            <div class="form-group">
                <label for="bookingDate">Select Service Date</label>
                <input type="date" id="bookingDate">
            </div>

            <button class="btn-full-black" id="confirmBookingButton">Confirm Booking Appointment</button>
            <p class="form-feedback-msg" id="bookingMessage"></p>
        </div>
    `;

    document.getElementById("closeBookingFormBtn").addEventListener("click", () => {
        dynContainer.style.display = "none";
    });

    document.getElementById("confirmBookingButton").addEventListener("click", () => {
        createBooking(worker);
    });
}

async function createBooking(worker) {
    const dateInput = document.getElementById("bookingDate");
    const msgEl = document.getElementById("bookingMessage");
    const date = dateInput ? dateInput.value : "";

    if (!date) {
        if (msgEl) msgEl.textContent = "Please choose a booking appointment date.";
        return;
    }

    const payload = {
        customer_id: currentUser.customer_id,
        worker_id: worker.worker_id,
        date: date
    };

    try {
        const res = await fetch(`${API_URL}/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (msgEl) {
            msgEl.textContent = data.message;
            msgEl.style.display = "block";
            msgEl.style.color = data.success ? "#059669" : "#dc2626";
            msgEl.style.background = data.success ? "#ecfdf5" : "#fef2f2";
            msgEl.style.borderColor = data.success ? "#a7f3d0" : "#fecaca";
        }

        if (data.success) {
            setTimeout(() => {
                const dyn = document.getElementById("customerDynamicContainer");
                if (dyn) dyn.style.display = "none";
                alert("Booking created successfully!");
            }, 1200);
        }
    } catch (err) {
        console.error(err);
        if (msgEl) msgEl.textContent = "Could not connect to server.";
    }
}

// ============================================================
// WORKER DASHBOARD DATA & INTERACTIONS
// ============================================================

async function loadWorkerDashboardData() {
    if (!currentUser || currentUserType !== "worker") return;

    // 1. Fetch Earnings
    try {
        const res = await fetch(`${API_URL}/worker/${currentUser.worker_id}/earnings`);
        const data = await res.json();
        if (data.success) {
            const earningsEl = document.getElementById("dashEarningsVal");
            const payoutEl = document.getElementById("dashPayoutVal");
            if (earningsEl) {
                earningsEl.textContent = data.earnings > 0 ? `₹${data.earnings}` : "$3,240.50";
            }
            if (payoutEl) {
                payoutEl.textContent = "$850.00";
            }
        }
    } catch (err) {
        console.error("Earnings fetch error:", err);
    }

    // 2. Fetch Availability Status
    updateWorkerAvailabilityBadge(currentUser.available);

    // 3. Fetch Bookings
    loadWorkerBookings();
}

function updateWorkerAvailabilityBadge(isAvailable) {
    const badge = document.getElementById("dashAvailabilityBadge");
    const text = document.getElementById("dashAvailabilityText");
    if (!badge || !text) return;

    if (isAvailable !== false) {
        badge.className = "status-pill status-available";
        text.textContent = "Available for Jobs";
    } else {
        badge.className = "status-pill status-booked";
        text.textContent = "Currently Unavailable";
    }
}

const dashToggleAvailBtn = document.getElementById("dashToggleAvailBtn");
if (dashToggleAvailBtn) {
    dashToggleAvailBtn.addEventListener("click", toggleAvailability);
}

async function toggleAvailability() {
    if (!currentUser || currentUserType !== "worker") return;
    const newStatus = !(currentUser.available !== false);

    try {
        const res = await fetch(`${API_URL}/worker/${currentUser.worker_id}/availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ available: newStatus })
        });
        const data = await res.json();
        if (data.success) {
            currentUser.available = data.available;
            saveSession(currentUser, currentUserType);
            updateWorkerAvailabilityBadge(currentUser.available);
        }
    } catch (err) {
        console.error("Availability toggle error:", err);
    }
}

async function loadWorkerBookings() {
    const listEl = document.getElementById("workerBookingsList");
    if (!listEl || !currentUser) return;

    listEl.innerHTML = "<div style='padding: 24px; text-align: center; color: var(--text-muted);'>Loading appointments...</div>";

    try {
        const res = await fetch(`${API_URL}/bookings/worker/${currentUser.worker_id}`);
        const data = await res.json();

        if (!data.bookings || data.bookings.length === 0) {
            listEl.innerHTML = `
                <div style="background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 40px; text-align: center;">
                    <p style="font-size: 15px; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">No bookings currently scheduled</p>
                    <p style="font-size: 13px; color: var(--text-secondary);">New client job requests will appear here in real-time.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = "";

        data.bookings.forEach((b, idx) => {
            const avatarUrl = DEMO_AVATARS[(idx + 1) % DEMO_AVATARS.length];
            const item = document.createElement("div");
            item.className = "booking-item-card";

            let statusClass = "status-pending";
            let statusLabel = "• Pending";
            if (b.status === "ACCEPTED") {
                statusClass = "status-accepted";
                statusLabel = "• Booked";
            } else if (b.status === "COMPLETED") {
                statusClass = "status-available";
                statusLabel = "• Completed";
            } else if (b.status === "REJECTED") {
                statusClass = "status-booked";
                statusLabel = "• Declined";
            }

            let actionsHtml = "";
            if (b.status === "PENDING") {
                actionsHtml = `
                    <button class="btn-action-sm btn-accept" data-booking-id="${b.booking_id}">Accept</button>
                    <button class="btn-action-sm btn-reject" data-booking-id="${b.booking_id}">Decline</button>
                `;
            }

            item.innerHTML = `
                <div class="booking-item-left">
                    <img src="${avatarUrl}" alt="Client avatar" class="pro-avatar" style="width: 40px; height: 40px;">
                    <div class="booking-item-info">
                        <h4>${b.customer_name || "Client Booking"}</h4>
                        <p>${b.service || "Service Consultation"}</p>
                    </div>
                </div>

                <div class="booking-item-right">
                    <div class="booking-item-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>${b.date || "Today, 2:00 PM"}</span>
                    </div>
                    <span class="status-pill ${statusClass}">${statusLabel}</span>
                    ${actionsHtml}
                </div>
            `;

            const acceptBtn = item.querySelector(".btn-accept");
            if (acceptBtn) {
                acceptBtn.addEventListener("click", () => updateBookingStatus(b.booking_id, "accept"));
            }

            const rejectBtn = item.querySelector(".btn-reject");
            if (rejectBtn) {
                rejectBtn.addEventListener("click", () => updateBookingStatus(b.booking_id, "reject"));
            }

            listEl.appendChild(item);
        });

    } catch (err) {
        console.error("Worker bookings error:", err);
        listEl.innerHTML = "<div style='padding: 20px; text-align: center; color: #dc2626;'>Could not connect to server.</div>";
    }
}

async function updateBookingStatus(bookingId, action) {
    try {
        const res = await fetch(`${API_URL}/booking/${bookingId}/${action}`, {
            method: "POST"
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
            loadWorkerBookings();
        }
    } catch (err) {
        console.error(err);
        alert("Could not connect to server.");
    }
}

const refreshWorkerBookingsBtn = document.getElementById("refreshWorkerBookingsBtn");
if (refreshWorkerBookingsBtn) {
    refreshWorkerBookingsBtn.addEventListener("click", loadWorkerBookings);
}

// ============================================================
// AUTH MODAL & REGISTRATION
// ============================================================

const authModal = document.getElementById("authModal");
const closeAuthModalBtn = document.getElementById("closeAuthModal");
const userAuthTrigger = document.getElementById("userAuthTrigger");

const modalLoginView = document.getElementById("modalLoginView");
const modalCustomerSignupView = document.getElementById("modalCustomerSignupView");
const modalWorkerSignupView = document.getElementById("modalWorkerSignupView");

function openAuthModal(view = "login") {
    if (authModal) authModal.classList.add("active");
    if (modalLoginView) modalLoginView.style.display = view === "login" ? "block" : "none";
    if (modalCustomerSignupView) modalCustomerSignupView.style.display = view === "customerSignup" ? "block" : "none";
    if (modalWorkerSignupView) modalWorkerSignupView.style.display = view === "workerSignup" ? "block" : "none";
}

function closeAuthModal() {
    if (authModal) authModal.classList.remove("active");
    const loginMsg = document.getElementById("loginMessage");
    if (loginMsg) loginMsg.textContent = "";
}

if (closeAuthModalBtn) closeAuthModalBtn.addEventListener("click", closeAuthModal);

if (userAuthTrigger) {
    userAuthTrigger.addEventListener("click", () => {
        if (currentUser) {
            const logoutConfirm = confirm(`Logged in as ${currentUser.full_name} (${currentUserType}). Do you want to sign out?`);
            if (logoutConfirm) {
                clearSession();
                switchTab("customer");
            }
        } else {
            openAuthModal("login");
        }
    });
}

// Modal view switches
document.getElementById("customerSignupButton").addEventListener("click", () => openAuthModal("customerSignup"));
document.getElementById("workerSignupButton").addEventListener("click", () => openAuthModal("workerSignup"));
document.getElementById("customerSignupBack").addEventListener("click", () => openAuthModal("login"));
document.getElementById("workerSignupBack").addEventListener("click", () => openAuthModal("login"));

// Login Submission
document.getElementById("loginButton").addEventListener("click", async () => {
    const mobile = document.getElementById("loginMobile").value;
    const password = document.getElementById("loginPassword").value;
    const msgEl = document.getElementById("loginMessage");

    if (!mobile || !password) {
        if (msgEl) msgEl.textContent = "Please enter mobile number and password.";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile_number: mobile, password: password })
        });

        const data = await res.json();

        if (!data.success) {
            if (msgEl) msgEl.textContent = data.message;
            return;
        }

        saveSession(data.user, data.user_type);
        closeAuthModal();

        if (data.user_type === "worker") {
            switchTab("worker");
        } else {
            switchTab("customer");
        }

    } catch (err) {
        console.error(err);
        if (msgEl) msgEl.textContent = "Could not connect to server.";
    }
});

// Customer Signup Submission
document.getElementById("customerSignupSubmit").addEventListener("click", async () => {
    const data = {
        full_name: document.getElementById("customerName").value,
        password: document.getElementById("customerPassword").value,
        mobile_number: document.getElementById("customerMobile").value,
        email: document.getElementById("customerEmail").value,
        address: document.getElementById("customerAddress").value,
        pincode: document.getElementById("customerPincode").value
    };

    const msgEl = document.getElementById("customerSignupMessage");

    try {
        const res = await fetch(`${API_URL}/signup/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (msgEl) {
            msgEl.textContent = result.message;
            msgEl.style.display = "block";
            msgEl.style.color = result.success ? "#059669" : "#dc2626";
            msgEl.style.background = result.success ? "#ecfdf5" : "#fef2f2";
            msgEl.style.borderColor = result.success ? "#a7f3d0" : "#fecaca";
        }

        if (result.success) {
            setTimeout(() => openAuthModal("login"), 1200);
        }
    } catch (err) {
        console.error(err);
        if (msgEl) msgEl.textContent = "Could not connect to server.";
    }
});

// Worker Signup Submission
document.getElementById("workerSignupSubmit").addEventListener("click", async () => {
    const data = {
        full_name: document.getElementById("workerName").value,
        password: document.getElementById("workerPassword").value,
        mobile_number: document.getElementById("workerMobile").value,
        email: document.getElementById("workerEmail").value,
        age: document.getElementById("workerAge").value || "28",
        current_address: document.getElementById("workerAddress").value || "City Center",
        city: document.getElementById("workerCity").value,
        pincode: document.getElementById("workerPincode").value,
        primary_skill: document.getElementById("workerSkill").value,
        additional_skills: document.getElementById("workerAdditionalSkills").value,
        years_of_experience: document.getElementById("workerExperience").value,
        description: document.getElementById("workerDescription").value,
        preferred_working_hours: document.getElementById("workerHours").value || "8:00 AM - 6:00 PM"
    };

    const msgEl = document.getElementById("workerSignupMessage");

    try {
        const res = await fetch(`${API_URL}/signup/worker`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (msgEl) {
            msgEl.textContent = result.message;
            msgEl.style.display = "block";
            msgEl.style.color = result.success ? "#059669" : "#dc2626";
            msgEl.style.background = result.success ? "#ecfdf5" : "#fef2f2";
            msgEl.style.borderColor = result.success ? "#a7f3d0" : "#fecaca";
        }

        if (result.success) {
            setTimeout(() => openAuthModal("login"), 1200);
        }
    } catch (err) {
        console.error(err);
        if (msgEl) msgEl.textContent = "Could not connect to server.";
    }
});

// Initialize session and default marketplace feed
restoreSession();
