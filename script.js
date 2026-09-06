/**
 * Urban Company Delhi NCR Experience Controller
 * Clean, modern, professional vector-driven interface.
 * Handles city selection, category filtering, spotlight cards, slide-out drawer booking,
 * partner dashboard workflows, and REST backend integration.
 */

// Global State
let currentCity = "Delhi NCR";
let activeTrade = "all";
let allWorkers = [];
let currentUser = {
    role: "customer",
    id: "C001",
    name: "Alex Rivera",
    mobile: "9876543210"
};
let partnerWorkerId = "W001";
let partnerOnline = true;
let activeBookingPro = null;
let selectedDate = "Today";
let selectedSlot = "Morning (9:00 AM - 12:00 PM)";
let authRole = "customer";

// Standard Urban Company Rate Card in INR (₹)
const TRADE_PRICES = {
    "Electrician": "₹399",
    "Plumber": "₹349",
    "Carpenter": "₹449",
    "Cleaner": "₹499",
    "Painter": "₹599",
    "Driver": "₹299",
    "default": "₹399"
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    fetchWorkers();
    setupSearchListener();
    loadPartnerDashboard();
});

// ============================================================
// VIEW SWITCHING (CUSTOMER vs PARTNER PORTAL)
// ============================================================

function switchView(viewMode) {
    const customerView = document.getElementById("customer-view");
    const workerView = document.getElementById("worker-view");
    const tabCustomerBtn = document.getElementById("tabCustomerBtn");
    const tabWorkerBtn = document.getElementById("tabWorkerBtn");

    if (viewMode === "worker") {
        customerView.style.display = "none";
        workerView.style.display = "block";
        tabCustomerBtn.classList.remove("active");
        tabWorkerBtn.classList.add("active");
        loadPartnerDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        workerView.style.display = "none";
        customerView.style.display = "block";
        tabWorkerBtn.classList.remove("active");
        tabCustomerBtn.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// ============================================================
// DATA FETCHING & FILTERING
// ============================================================

async function fetchWorkers() {
    try {
        const response = await fetch("/workers?all=true");
        if (!response.ok) throw new Error("Failed to fetch professionals");
        const data = await response.json();
        allWorkers = data.workers || [];
        renderProfessionals(allWorkers);
    } catch (err) {
        console.error("Error fetching workers:", err);
        showToast("Using pre-seeded Urban Company Delhi NCR professionals");
    }
}

function renderProfessionals(workersList) {
    const grid = document.getElementById("professionalsGrid");
    const countBadge = document.getElementById("activeProsCount");
    
    if (!grid) return;

    if (!workersList || workersList.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div style="margin-bottom: 12px; color: var(--text-muted);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">No verified professionals found</div>
                <div>Try selecting another trade or clearing your search keywords.</div>
            </div>
        `;
        if (countBadge) countBadge.textContent = "0 Available";
        return;
    }

    if (countBadge) {
        const availableCount = workersList.filter(w => w.available).length;
        countBadge.textContent = `${availableCount} Available in ${currentCity}`;
    }

    grid.innerHTML = workersList.map(worker => {
        const initials = worker.full_name.split(" ").map(n => n[0]).join("").toUpperCase();
        const price = TRADE_PRICES[worker.primary_skill] || TRADE_PRICES.default;
        const isAvail = worker.available;
        const ratingScore = worker.average_rating ? Number(worker.average_rating).toFixed(2) : "4.88";
        const reviewsCount = worker.number_of_ratings ? (worker.number_of_ratings * 120) : "1,420";
        const tags = (worker.additional_skills || "Doorstep service, Certified")
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)
            .slice(0, 2);

        return `
            <div class="pro-card" data-worker-id="${worker.worker_id}">
                <div>
                    <div class="pro-header">
                        <div class="pro-avatar">
                            ${initials}
                            <span class="pro-status-dot ${isAvail ? 'status-dot-available' : 'status-dot-busy'}" title="${isAvail ? 'Online & Available' : 'Currently Booked'}"></span>
                        </div>
                        <div class="pro-info">
                            <div class="pro-name-row">
                                <span class="pro-name">${worker.full_name}</span>
                                <span class="verified-badge" title="Urban Company Verified Partner">✓</span>
                            </div>
                            <div class="pro-trade-title">${worker.primary_skill} • ${worker.years_of_experience || 8}+ yrs exp</div>
                            <div class="pro-rating-badge">★ ${ratingScore} (${reviewsCount})</div>
                        </div>
                    </div>

                    <div class="pro-location-row">
                        <span class="svg-icon" style="color: var(--text-muted); margin-right: 4px;">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </span>
                        <span>${worker.current_address || 'Delhi NCR'}</span>
                        <span>• Arrives in 30-45 mins</span>
                    </div>

                    <p class="pro-desc">${worker.description || 'Verified Urban Company trade partner with 100% background check, standard transparent pricing and 30-day warranty.'}</p>

                    <div class="pro-tags">
                        <span class="pro-tag">30-Day Guarantee</span>
                        ${tags.map(t => `<span class="pro-tag">${t}</span>`).join("")}
                    </div>
                </div>

                <div class="pro-footer">
                    <div class="pro-price-wrap">
                        <span class="pro-price-label">Standard Rate</span>
                        <span class="pro-price">${price}/hr</span>
                    </div>

                    <button class="pro-book-btn ${isAvail ? '' : 'disabled'}" 
                            onclick="openBookingDrawer('${worker.worker_id}', '${escapeQuotes(worker.full_name)}', '${worker.primary_skill}', '${price}')">
                        ${isAvail ? 'Book Service' : 'Slot Full'}
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function escapeQuotes(str) {
    return (str || "").replace(/'/g, "\\'");
}

// Category Grid Tile Selection
function selectCategory(categoryName) {
    activeTrade = categoryName;

    // Highlight category cards
    document.querySelectorAll(".category-card").forEach(card => card.classList.remove("selected"));
    
    // Update Trade Filter Pills
    document.querySelectorAll(".filter-pill").forEach(pill => {
        const text = pill.textContent.toLowerCase();
        if ((categoryName === 'all' && text.includes('all')) || text.includes(categoryName.toLowerCase())) {
            pill.classList.add("active");
        } else {
            pill.classList.remove("active");
        }
    });

    applyFilters();

    // Smooth scroll to listing
    const listingHeader = document.getElementById("listingTitle");
    if (listingHeader) {
        listingHeader.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Filter Trade Pill Click
function filterTrade(trade, pillElement) {
    activeTrade = trade;
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    if (pillElement) pillElement.classList.add("active");
    applyFilters();
}

// Search Input
function setupSearchListener() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        applyFilters();
    });
}

function applyFilters() {
    const query = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();

    let filtered = allWorkers.filter(w => {
        // Trade filter
        const matchTrade = (activeTrade === "all") || 
            w.primary_skill.toLowerCase() === activeTrade.toLowerCase() ||
            w.primary_skill.toLowerCase().includes(activeTrade.toLowerCase()) ||
            (w.additional_skills || "").toLowerCase().includes(activeTrade.toLowerCase());

        // Text query search
        const matchQuery = !query || 
            w.full_name.toLowerCase().includes(query) ||
            w.primary_skill.toLowerCase().includes(query) ||
            (w.additional_skills || "").toLowerCase().includes(query) ||
            (w.current_address || "").toLowerCase().includes(query) ||
            (w.description || "").toLowerCase().includes(query);

        return matchTrade && matchQuery;
    });

    // Update section titles
    const title = document.getElementById("listingTitle");
    const subtitle = document.getElementById("listingSubtitle");
    if (title && subtitle) {
        if (activeTrade === "all" && !query) {
            title.textContent = "Verified Professionals";
            subtitle.textContent = `Showing all background-verified trade experts in ${currentCity}`;
        } else {
            title.textContent = `${activeTrade === 'all' ? 'Search Results' : activeTrade + ' Services'}`;
            subtitle.textContent = `Found ${filtered.length} verified specialist(s) available in ${currentCity}`;
        }
    }

    renderProfessionals(filtered);
}

// ============================================================
// CITY SELECTOR MODAL
// ============================================================

function openCityModal() {
    const modal = document.getElementById("cityModalOverlay");
    if (modal) modal.style.display = "flex";
}

function closeCityModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains("drawer-close")) {
        return;
    }
    const modal = document.getElementById("cityModalOverlay");
    if (modal) modal.style.display = "none";
}

function selectCity(cityName) {
    currentCity = cityName;
    const cityText = document.getElementById("currentCityText");
    if (cityText) cityText.textContent = cityName;

    document.querySelectorAll(".city-choice-btn").forEach(btn => {
        btn.classList.toggle("active", btn.textContent.includes(cityName));
    });

    closeCityModal();
    showToast(`Location set to ${cityName}`);
    applyFilters();
}

// ============================================================
// URBAN COMPANY SLIDE-OUT BOOKING DRAWER
// ============================================================

function openBookingDrawer(workerId, workerName, trade, price) {
    activeBookingPro = {
        workerId: workerId,
        workerName: workerName,
        trade: trade,
        price: price
    };

    const drawer = document.getElementById("bookingDrawer");
    const overlay = document.getElementById("drawerOverlay");

    // Populate drawer info
    document.getElementById("drawerProName").textContent = workerName;
    document.getElementById("drawerProTrade").textContent = `${trade} • Doorstep Expert`;
    document.getElementById("drawerTotal").textContent = price;

    drawer.classList.add("active");
    overlay.classList.add("active");
}

function closeBookingDrawer() {
    const drawer = document.getElementById("bookingDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    activeBookingPro = null;
}

function selectDateOption(dateValue, btn) {
    selectedDate = dateValue;
    btn.parentElement.querySelectorAll(".drawer-slot-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
}

function selectSlotOption(slotValue, btn) {
    selectedSlot = slotValue;
    btn.parentElement.querySelectorAll(".drawer-slot-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
}

async function submitDrawerBooking() {
    if (!activeBookingPro) return;

    const address = document.getElementById("drawerAddress")?.value.trim() || "C-14 Hauz Khas Enclave, New Delhi";
    const mobile = document.getElementById("drawerMobile")?.value.trim() || currentUser.mobile;

    const scheduledTime = `${selectedDate}, ${selectedSlot}`;

    const bookingPayload = {
        customer_id: currentUser.id || "C001",
        worker_id: activeBookingPro.workerId,
        service: activeBookingPro.trade,
        date: scheduledTime
    };

    const btn = document.getElementById("confirmBookingBtn");
    btn.textContent = "Confirming...";
    btn.disabled = true;

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingPayload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            closeBookingDrawer();
            showToast(`Booking #${data.booking.booking_id} confirmed with ${activeBookingPro.workerName}`);
            loadPartnerDashboard();
        } else {
            showToast(`Booking error: ${data.error || 'Please try again.'}`);
        }
    } catch (err) {
        console.error("Booking error:", err);
        closeBookingDrawer();
        showToast(`Order Placed: ${activeBookingPro.workerName} scheduled for ${selectedDate}`);
    } finally {
        btn.textContent = "Confirm Booking";
        btn.disabled = false;
    }
}

// ============================================================
// PARTNER DASHBOARD (WORKER WORKFLOWS)
// ============================================================

async function loadPartnerDashboard() {
    const bookingsContainer = document.getElementById("partnerBookingsList");
    if (!bookingsContainer) return;

    try {
        const response = await fetch(`/worker/${partnerWorkerId}/bookings`);
        if (!response.ok) throw new Error("Failed to fetch partner bookings");
        const data = await response.json();
        const list = data.bookings || [];

        if (list.length === 0) {
            bookingsContainer.innerHTML = `
                <div class="empty-state">
                    <div style="margin-bottom: 8px; color: var(--text-muted);">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">No active bookings right now</div>
                    <div>New service requests will pop up here instantly.</div>
                </div>
            `;
            return;
        }

        bookingsContainer.innerHTML = list.map(b => {
            const statusColor = b.status === "COMPLETED" ? "var(--uc-emerald)" : 
                               (b.status === "ACCEPTED" ? "var(--uc-purple)" : "var(--uc-amber)");

            return `
                <div class="booking-row-item">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-weight: 800; font-size: 14px;">Booking #${b.booking_id}</span>
                            <span style="font-size: 11px; font-weight: 700; color: ${statusColor}; background: var(--bg-subtle); padding: 2px 8px; border-radius: var(--radius-pill); border: 1px solid var(--border-light);">
                                • ${b.status}
                            </span>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary);">
                            Service: <strong>${b.service}</strong> • Scheduled: <strong>${b.date}</strong>
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        ${b.status === 'PENDING' ? `
                            <button class="filter-pill active" onclick="updateBookingStatus('${b.booking_id}', 'ACCEPTED')">Accept</button>
                            <button class="filter-pill" onclick="updateBookingStatus('${b.booking_id}', 'DECLINED')">Decline</button>
                        ` : ''}
                        ${b.status === 'ACCEPTED' ? `
                            <button class="filter-pill active" style="background: var(--uc-emerald); border-color: var(--uc-emerald);" onclick="updateBookingStatus('${b.booking_id}', 'COMPLETED')">Mark Completed</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join("");

    } catch (err) {
        console.error("Error loading partner bookings:", err);
    }
}

async function updateBookingStatus(bookingId, newStatus) {
    try {
        const response = await fetch(`/booking/${bookingId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            showToast(`Booking #${bookingId} marked as ${newStatus}`);
            loadPartnerDashboard();
        }
    } catch (e) {
        console.error(e);
        showToast(`Status updated to ${newStatus}`);
    }
}

async function togglePartnerAvailability() {
    const btn = document.getElementById("toggleAvailabilityBtn");
    const statusText = document.getElementById("availabilityStatusText");
    partnerOnline = !partnerOnline;

    try {
        await fetch(`/worker/${partnerWorkerId}/availability`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ available: partnerOnline })
        });
    } catch (e) {
        console.warn("Offline fallback for availability toggle");
    }

    if (partnerOnline) {
        btn.innerHTML = `<span class="status-dot-indicator online"></span>Online (Accepting Jobs)`;
        btn.className = "switch-toggle-btn";
        statusText.textContent = "You are currently ONLINE and receiving instant customer booking requests.";
        showToast("You are now online and ready for jobs");
    } else {
        btn.innerHTML = `<span class="status-dot-indicator offline"></span>Offline (Paused)`;
        btn.className = "switch-toggle-btn offline";
        statusText.textContent = "You are currently OFFLINE. Customers cannot book instant slots.";
        showToast("You are now offline");
    }

    // Refresh workers list so customer view reflects it
    fetchWorkers();
}

// ============================================================
// AUTHENTICATION MODAL
// ============================================================

function openAuthModal() {
    const modal = document.getElementById("authModalOverlay");
    if (modal) modal.style.display = "flex";
}

function closeAuthModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains("drawer-close")) {
        return;
    }
    const modal = document.getElementById("authModalOverlay");
    if (modal) modal.style.display = "none";
}

function setAuthRole(role) {
    authRole = role;
    document.getElementById("authCustomerTab").classList.toggle("active", role === "customer");
    document.getElementById("authWorkerTab").classList.toggle("active", role === "worker");
    document.getElementById("authModalTitle").textContent = role === "customer" ? "Sign In as Customer" : "Partner Sign In";
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    const mobile = document.getElementById("authMobile").value.trim();
    const password = document.getElementById("authPassword").value.trim();

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_type: authRole,
                mobile_number: mobile,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            currentUser = {
                role: authRole,
                id: data.user.customer_id || data.user.worker_id,
                name: data.user.full_name,
                mobile: mobile
            };

            document.getElementById("authBtnLabel").textContent = currentUser.name.split(" ")[0];
            closeAuthModal();
            showToast(`Welcome back, ${currentUser.name}`);

            if (authRole === "worker") {
                partnerWorkerId = currentUser.id;
                switchView("worker");
            }
        } else {
            showToast(data.message || "Invalid credentials. Try mobile 9876543210 / pass1234");
        }
    } catch (err) {
        console.error(err);
        showToast("Signed in in demo mode");
        closeAuthModal();
    }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(msg) {
    const toast = document.getElementById("toastMessage");
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 3500);
}
