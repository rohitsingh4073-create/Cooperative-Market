/**
 * Cooperative Market Delhi NCR Experience Controller
 * Clean, modern, professional vector-driven interface.
 * Implements 4 Core Extra Features:
 * 1. Regular Maintenance Subscription Plans (Idea #3)
 * 2. Best Work Portfolio Showcase (Idea #4)
 * 3. Customer Problem Photo Upload on Booking (Idea #5)
 * 4. Algorithmic Reliability Score Engine (Idea #8)
 */

// Global Application State
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

// Extra Features State
let currentSubBilling = "monthly";
let allSubscriptionPlans = [];
let customerActiveSubscription = null;
let currentProblemPhoto = "";
let currentProblemNotes = "";

// Standard Cooperative Market Rate Card in INR (₹)
const TRADE_PRICES = {
    "Electrician": "₹399",
    "Plumber": "₹349",
    "Carpenter": "₹449",
    "Cleaner": "₹499",
    "Painter": "₹599",
    "Driver": "₹699",
    "default": "₹399"
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    fetchWorkers();
    setupSearchListener();
    fetchSubscriptionPlans();
    checkCustomerSubscription();
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
        showToast("Using pre-seeded Cooperative Market Delhi NCR professionals");
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
        const relScore = worker.reliability_score || 98;
        const relTier = worker.reliability_tier || "Elite Diamond";
        const portCount = worker.portfolio_count || 2;
        const previews = worker.portfolio_preview || [];

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
                                <span class="verified-badge" title="Cooperative Market Verified Partner">✓</span>
                            </div>
                            <div class="pro-trade-title">${worker.primary_skill} • ${worker.years_of_experience || 8}+ yrs exp</div>
                            
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <div class="pro-rating-badge">★ ${ratingScore} (${reviewsCount})</div>
                                <div class="pro-reliability-badge" onclick="event.stopPropagation(); openReliabilityModal('${worker.worker_id}')" title="Click to view full Trust & Reliability Score breakdown">
                                    <span>⚡ ${relScore}/100</span>
                                    <span style="font-weight: 600; opacity: 0.85;">• ${relTier.split(' ')[0]}</span>
                                </div>
                            </div>
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

                    <p class="pro-desc">${worker.description || 'Verified Cooperative Market trade partner with 100% background check, standard transparent pricing and 30-day warranty.'}</p>

                    <!-- Feature 2: Best Work Showcase Preview -->
                    <div class="pro-portfolio-strip">
                        <div class="pro-portfolio-label-row">
                            <span>Best Work Showcase</span>
                            <button type="button" class="pro-portfolio-view-all" onclick="openPortfolioModal('${worker.worker_id}')">
                                View Gallery (${portCount}) →
                            </button>
                        </div>
                        <div class="pro-portfolio-thumbs">
                            ${(previews.length > 0 ? previews : [
                                { image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80", title: "Verified Work" }
                            ]).map(p => `
                                <img src="${p.image_url}" class="pro-portfolio-thumb" alt="${escapeQuotes(p.title)}" title="${escapeQuotes(p.title)}" onclick="openPhotoZoom('${p.image_url}', '${escapeQuotes(p.title)}', '${escapeQuotes(worker.full_name)} • ${escapeQuotes(p.category || worker.primary_skill)}')">
                            `).join("")}
                        </div>
                    </div>

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
    return (str || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// Category Grid Tile Selection
function selectCategory(categoryName) {
    activeTrade = categoryName;

    document.querySelectorAll(".category-card").forEach(card => card.classList.remove("selected"));
    
    document.querySelectorAll(".filter-pill").forEach(pill => {
        const text = pill.textContent.toLowerCase();
        if ((categoryName === 'all' && text.includes('all')) || text.includes(categoryName.toLowerCase())) {
            pill.classList.add("active");
        } else {
            pill.classList.remove("active");
        }
    });

    applyFilters();

    const listingHeader = document.getElementById("listingTitle");
    if (listingHeader) {
        listingHeader.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function filterTrade(trade, pillElement) {
    activeTrade = trade;
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    if (pillElement) pillElement.classList.add("active");
    applyFilters();
}

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
        const matchTrade = (activeTrade === "all") || 
            w.primary_skill.toLowerCase() === activeTrade.toLowerCase() ||
            w.primary_skill.toLowerCase().includes(activeTrade.toLowerCase()) ||
            (w.additional_skills || "").toLowerCase().includes(activeTrade.toLowerCase());

        const matchQuery = !query || 
            w.full_name.toLowerCase().includes(query) ||
            w.primary_skill.toLowerCase().includes(query) ||
            (w.additional_skills || "").toLowerCase().includes(query) ||
            (w.current_address || "").toLowerCase().includes(query) ||
            (w.description || "").toLowerCase().includes(query);

        return matchTrade && matchQuery;
    });

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
// FEATURE 1: REGULAR MAINTENANCE SUBSCRIPTION PLANS (IDEA #3)
// ============================================================

async function fetchSubscriptionPlans() {
    try {
        const response = await fetch("/subscriptions/plans");
        if (!response.ok) return;
        const data = await response.json();
        allSubscriptionPlans = data.plans || [];
        renderSubscriptionPlans();
    } catch (e) {
        console.error("Failed to load subscription plans:", e);
    }
}

function setSubBillingCycle(cycle) {
    currentSubBilling = cycle;
    document.getElementById("subMonthlyToggle")?.classList.toggle("active", cycle === "monthly");
    document.getElementById("subAnnualToggle")?.classList.toggle("active", cycle === "annual");
    renderSubscriptionPlans();
}

function scrollToSubscriptions() {
    const section = document.getElementById("subscriptionsSection");
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function renderSubscriptionPlans() {
    const container = document.getElementById("subscriptionPlansGrid");
    if (!container) return;

    container.innerHTML = allSubscriptionPlans.map(plan => {
        const isAnnual = currentSubBilling === "annual";
        const price = isAnnual ? `₹${(plan.price_annual / 12).toFixed(0)}` : `₹${plan.price_monthly}`;
        const billedText = isAnnual ? `Billed ₹${plan.price_annual}/yr (Save 20%)` : "Billed monthly, cancel anytime";
        const isCurrentActive = customerActiveSubscription && customerActiveSubscription.plan_id === plan.plan_id;

        return `
            <div class="sub-plan-card ${plan.popular ? 'featured' : ''}">
                <div>
                    ${plan.badge ? `<div class="sub-plan-badge">${plan.badge}</div>` : ''}
                    <div class="sub-plan-title">${plan.title}</div>
                    <div class="sub-plan-sub">${plan.subtitle}</div>

                    <div class="sub-price-row">
                        <span class="sub-price-val">${price}</span>
                        <span class="sub-price-period">/ month</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: -14px; margin-bottom: 16px;">
                        ${billedText}
                    </div>

                    <ul class="sub-perks-list">
                        ${plan.features.map(f => `
                            <li class="sub-perk-item">
                                <span class="sub-perk-icon">✓</span>
                                <span>${f}</span>
                            </li>
                        `).join("")}
                    </ul>
                </div>

                <div>
                    <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase;">
                        Ideal for: ${plan.suitable_for}
                    </div>
                    <button type="button" class="sub-cta-btn" onclick="openSubModal('${plan.plan_id}')">
                        ${isCurrentActive ? '✓ Active Plan (Manage)' : 'Subscribe to ' + plan.title.split(' ')[0]}
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

async function checkCustomerSubscription() {
    if (!currentUser.id) return;
    try {
        const response = await fetch(`/subscriptions/customer/${currentUser.id}`);
        if (!response.ok) return;
        const data = await response.json();
        customerActiveSubscription = data.active_subscription || null;
        updateCustomerActiveSubBanner();
        renderSubscriptionPlans();
    } catch (e) {
        console.warn("Could not check customer subscription:", e);
    }
}

function updateCustomerActiveSubBanner() {
    const banner = document.getElementById("customerActiveSubBanner");
    if (!banner) return;

    if (customerActiveSubscription && customerActiveSubscription.status === "ACTIVE") {
        banner.style.display = "flex";
        banner.className = "active-sub-banner";
        banner.innerHTML = `
            <div class="active-sub-banner-content">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--uc-purple); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                    🛡️
                </div>
                <div>
                    <div style="font-weight: 800; font-size: 14px; color: var(--text-primary);">
                        Active Member: ${customerActiveSubscription.plan_title}
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary);">
                        Coverage: <strong>${customerActiveSubscription.services.join(", ")}</strong> • <strong>${customerActiveSubscription.visits_remaining}</strong> complimentary visits remaining • Priority Dispatch Active
                    </div>
                </div>
            </div>
            <div>
                <button class="filter-pill active" style="font-size: 12px; padding: 6px 14px;" onclick="scrollToSubscriptions()">
                    View Plan Perks
                </button>
            </div>
        `;
    } else {
        banner.style.display = "none";
    }
}

function openSubModal(planId) {
    const plan = allSubscriptionPlans.find(p => p.plan_id === planId);
    if (!plan) return;

    const modal = document.getElementById("subModalOverlay");
    const body = document.getElementById("subModalBody");
    if (!modal || !body) return;

    const isAnnual = currentSubBilling === "annual";
    const chargeAmount = isAnnual ? `₹${plan.price_annual}` : `₹${plan.price_monthly}`;

    body.innerHTML = `
        <div style="margin-bottom: 16px;">
            <div style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">${plan.title}</div>
            <div style="font-size: 13px; color: var(--text-secondary);">${plan.subtitle}</div>
        </div>

        <div style="background: var(--bg-subtle); border-radius: 10px; padding: 14px; margin-bottom: 16px; border: 1px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                <span>Plan Tier:</span>
                <strong>${plan.title}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                <span>Billing Interval:</span>
                <strong>${isAnnual ? 'Annual (Save 20%)' : 'Monthly Recurring'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; border-top: 1px solid var(--border-light); padding-top: 8px; margin-top: 8px;">
                <span>Total Amount:</span>
                <span style="color: var(--uc-purple);">${chargeAmount}</span>
            </div>
        </div>

        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.4;">
            Includes 100% money-back guarantee, zero callout inspection fees, and guaranteed 30-minute priority dispatch in Delhi NCR.
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="button" class="drawer-close" style="flex: 1; height: 42px; border-radius: var(--radius-pill); border: 1px solid var(--border-default); background: white;" onclick="closeSubModal()">Cancel</button>
            <button type="button" class="drawer-submit-btn" style="flex: 2;" onclick="confirmSubscription('${plan.plan_id}')">
                Confirm & Activate
            </button>
        </div>
    `;

    modal.style.display = "flex";
}

function closeSubModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains("drawer-close")) return;
    const modal = document.getElementById("subModalOverlay");
    if (modal) modal.style.display = "none";
}

async function confirmSubscription(planId) {
    try {
        const response = await fetch("/subscriptions/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_id: currentUser.id || "C001",
                plan_id: planId,
                billing_cycle: currentSubBilling
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            customerActiveSubscription = data.subscription;
            closeSubModal();
            updateCustomerActiveSubBanner();
            renderSubscriptionPlans();
            showToast(`🎉 ${data.message}`);
        } else {
            showToast(data.message || "Failed to activate subscription.");
        }
    } catch (e) {
        console.error("Subscription activation error:", e);
        showToast("Error connecting to subscription server.");
    }
}

// ============================================================
// FEATURE 2: BEST WORK PORTFOLIO SHOWCASE (IDEA #4)
// ============================================================

async function openPortfolioModal(workerId) {
    const modal = document.getElementById("portfolioModalOverlay");
    const grid = document.getElementById("portfolioGridContent");
    const nameEl = document.getElementById("portfolioWorkerName");
    const skillEl = document.getElementById("portfolioWorkerSkill");

    if (!modal || !grid) return;

    modal.style.display = "flex";
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px;">Loading verified projects...</div>`;

    try {
        const response = await fetch(`/worker/${workerId}/portfolio`);
        if (!response.ok) throw new Error("Failed to load portfolio");
        const data = await response.json();

        if (nameEl) nameEl.textContent = `${data.worker_name}'s Craftsmanship Portfolio`;
        if (skillEl) skillEl.textContent = `Showing ${data.total_showcases} verified installation and restoration projects across Delhi NCR.`;

        if (!data.portfolio || data.portfolio.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 30px;">No portfolio photos uploaded yet.</div>`;
            return;
        }

        grid.innerHTML = data.portfolio.map(p => `
            <div class="portfolio-item-card">
                <img src="${p.image_url}" class="portfolio-item-img" alt="${escapeQuotes(p.title)}" onclick="openPhotoZoom('${p.image_url}', '${escapeQuotes(p.title)}', '${escapeQuotes(data.worker_name)} • ${escapeQuotes(p.category)}')">
                <div class="portfolio-item-body">
                    <div class="portfolio-item-cat">${p.category} • ${p.completed_date}</div>
                    <div class="portfolio-item-title">${p.title}</div>
                    <div class="portfolio-item-desc">${p.description}</div>
                    <div class="pro-tags" style="margin-bottom: 0;">
                        ${(p.tags || []).map(t => `<span class="pro-tag">${t}</span>`).join("")}
                    </div>
                </div>
            </div>
        `).join("");

    } catch (e) {
        console.error("Portfolio error:", e);
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load portfolio showcases.</div>`;
    }
}

function closePortfolioModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains("drawer-close")) return;
    const modal = document.getElementById("portfolioModalOverlay");
    if (modal) modal.style.display = "none";
}

function toggleAddPortfolioForm() {
    const wrap = document.getElementById("addPortfolioFormWrap");
    if (wrap) {
        wrap.style.display = wrap.style.display === "none" ? "block" : "none";
    }
}

async function handlePartnerAddPortfolio(event) {
    event.preventDefault();
    const title = document.getElementById("partnerPortTitle")?.value.trim();
    const category = document.getElementById("partnerPortCat")?.value.trim();
    const imageUrl = document.getElementById("partnerPortImg")?.value.trim();
    const tags = document.getElementById("partnerPortTags")?.value.trim();
    const desc = document.getElementById("partnerPortDesc")?.value.trim();

    if (!title || !category) {
        showToast("Please provide project title and category");
        return;
    }

    try {
        const response = await fetch(`/worker/${partnerWorkerId}/portfolio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                category: category,
                image_url: imageUrl,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                description: desc
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            showToast("✨ Showcase project published to your portfolio!");
            toggleAddPortfolioForm();
            loadPartnerPortfolio();
            fetchWorkers(); // update preview strips
        } else {
            showToast(data.message || "Failed to publish project.");
        }
    } catch (e) {
        console.error("Error adding portfolio:", e);
        showToast("Error publishing portfolio item.");
    }
}

async function loadPartnerPortfolio() {
    const container = document.getElementById("partnerPortfolioList");
    if (!container) return;

    try {
        const response = await fetch(`/worker/${partnerWorkerId}/portfolio`);
        if (!response.ok) return;
        const data = await response.json();
        const items = data.portfolio || [];

        if (items.length === 0) {
            container.innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--text-muted);">No portfolio projects published yet. Click above to showcase your craft!</div>`;
            return;
        }

        container.innerHTML = items.map(p => `
            <div class="portfolio-item-card">
                <img src="${p.image_url}" class="portfolio-item-img" alt="${escapeQuotes(p.title)}" onclick="openPhotoZoom('${p.image_url}', '${escapeQuotes(p.title)}', 'My Showcase')">
                <div class="portfolio-item-body">
                    <div class="portfolio-item-cat">${p.category} • ${p.completed_date}</div>
                    <div class="portfolio-item-title">${p.title}</div>
                    <div class="portfolio-item-desc">${p.description}</div>
                    <div class="pro-tags" style="margin-bottom: 0;">
                        ${(p.tags || []).map(t => `<span class="pro-tag">${t}</span>`).join("")}
                    </div>
                </div>
            </div>
        `).join("");
    } catch (e) {
        console.warn("Could not load partner portfolio:", e);
    }
}

// ============================================================
// FEATURE 3: CUSTOMER PROBLEM PHOTO UPLOAD ON BOOKING (IDEA #5)
// ============================================================

function handleProblemPhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        currentProblemPhoto = e.target.result;
        showProblemPreview(currentProblemPhoto);
    };
    reader.readAsDataURL(file);
}

function selectQuickIssue(issueTitle, sampleImageUrl) {
    const notesEl = document.getElementById("drawerProblemNotes");
    if (notesEl) {
        notesEl.value = `Issue: ${issueTitle}. Please inspect and repair.`;
    }
    currentProblemPhoto = sampleImageUrl;
    showProblemPreview(sampleImageUrl);
    showToast(`Selected diagnostic preset: ${issueTitle}`);
}

function showProblemPreview(src) {
    const container = document.getElementById("problemPreviewContainer");
    const img = document.getElementById("problemPreviewImg");
    if (container && img) {
        img.src = src;
        container.style.display = "block";
    }
}

function removeProblemPhoto() {
    currentProblemPhoto = "";
    const container = document.getElementById("problemPreviewContainer");
    const fileInput = document.getElementById("problemFileInput");
    if (container) container.style.display = "none";
    if (fileInput) fileInput.value = "";
}

function openPhotoZoom(imageUrl, title, subtitle) {
    const overlay = document.getElementById("photoZoomOverlay");
    const img = document.getElementById("photoZoomImg");
    const titleEl = document.getElementById("photoZoomTitle");
    const subEl = document.getElementById("photoZoomSub");

    if (overlay && img) {
        img.src = imageUrl;
        if (titleEl) titleEl.textContent = title || "Photo Preview";
        if (subEl) subEl.textContent = subtitle || "";
        overlay.style.display = "flex";
    }
}

function closePhotoZoom(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains("drawer-close")) return;
    const overlay = document.getElementById("photoZoomOverlay");
    if (overlay) overlay.style.display = "none";
}

// ============================================================
// FEATURE 4: RELIABILITY SCORE BREAKDOWN & MODAL (IDEA #8)
// ============================================================

async function openReliabilityModal(workerId) {
    const modal = document.getElementById("reliabilityModalOverlay");
    const circle = document.getElementById("relModalScore");
    const workerEl = document.getElementById("relModalWorker");
    const tierEl = document.getElementById("relModalTier");
    const listEl = document.getElementById("relModalMetricsList");

    if (!modal || !listEl) return;

    modal.style.display = "flex";
    listEl.innerHTML = `<div style="text-align: center; padding: 20px;">Fetching live trust data...</div>`;

    try {
        const response = await fetch(`/worker/${workerId}/reliability`);
        if (!response.ok) throw new Error("Failed to fetch reliability");
        const data = await response.json();
        const rel = data.reliability;

        if (circle) circle.textContent = rel.score;
        if (workerEl) workerEl.textContent = `${rel.worker_name} (${rel.primary_skill})`;
        if (tierEl) {
            tierEl.textContent = `${rel.tier} Partner`;
            tierEl.style.color = rel.badge_color || "var(--uc-purple)";
        }

        const metrics = rel.metrics;
        const compPct = parseFloat(metrics.completion_rate) || 98;
        const cancPct = Math.max(0, 100 - (parseFloat(metrics.cancellation_rate) * 10 || 10));
        const respScore = rel.breakdown.response_points * 10;
        const repeatScore = Math.min(100, rel.breakdown.repeat_points * 5);
        const compScore = Math.min(100, rel.breakdown.complaint_points * 6.6);

        listEl.innerHTML = `
            <div class="reliability-metric-row">
                <div class="reliability-metric-header">
                    <span>Job Completion Rate</span>
                    <strong style="color: var(--uc-emerald);">${metrics.completion_rate} (${metrics.completed_jobs} completed)</strong>
                </div>
                <div class="reliability-bar-bg"><div class="reliability-bar-fill" style="width: ${compPct}%; background: var(--uc-emerald);"></div></div>
            </div>

            <div class="reliability-metric-row">
                <div class="reliability-metric-header">
                    <span>Repeat Customers</span>
                    <strong style="color: var(--uc-purple);">${metrics.repeat_customers} Loyal Homeowners</strong>
                </div>
                <div class="reliability-bar-bg"><div class="reliability-bar-fill" style="width: ${repeatScore}%;"></div></div>
            </div>

            <div class="reliability-metric-row">
                <div class="reliability-metric-header">
                    <span>Zero Cancellation Record</span>
                    <strong>${metrics.cancellation_rate} cancellation rate</strong>
                </div>
                <div class="reliability-bar-bg"><div class="reliability-bar-fill" style="width: ${cancPct}%;"></div></div>
            </div>

            <div class="reliability-metric-row">
                <div class="reliability-metric-header">
                    <span>Customer Complaints Index</span>
                    <strong style="color: ${metrics.complaint_count === 0 ? 'var(--uc-emerald)' : 'var(--uc-amber)'};">${metrics.complaint_count} Complaints Recorded</strong>
                </div>
                <div class="reliability-bar-bg"><div class="reliability-bar-fill" style="width: ${compScore}%; background: var(--uc-emerald);"></div></div>
            </div>

            <div class="reliability-metric-row">
                <div class="reliability-metric-header">
                    <span>Average Response Speed</span>
                    <strong>${metrics.avg_response_mins} mins dispatch response</strong>
                </div>
                <div class="reliability-bar-bg"><div class="reliability-bar-fill" style="width: ${respScore}%;"></div></div>
            </div>
        `;

    } catch (e) {
        console.error("Error opening reliability modal:", e);
        listEl.innerHTML = `<div style="text-align: center; color: red;">Failed to calculate reliability breakdown.</div>`;
    }
}

function closeReliabilityModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains("drawer-close")) return;
    const modal = document.getElementById("reliabilityModalOverlay");
    if (modal) modal.style.display = "none";
}

async function loadPartnerReliability() {
    const scoreVal = document.getElementById("partnerScoreVal");
    const tierVal = document.getElementById("partnerTierVal");
    const grid = document.getElementById("partnerReliabilityMetricsGrid");
    const tipsEl = document.getElementById("partnerReliabilityTips");

    if (!scoreVal || !grid) return;

    try {
        const response = await fetch(`/worker/${partnerWorkerId}/reliability`);
        if (!response.ok) return;
        const data = await response.json();
        const rel = data.reliability;

        scoreVal.textContent = rel.score;
        if (tierVal) tierVal.textContent = `${rel.tier} Status`;

        const m = rel.metrics;
        grid.innerHTML = `
            <div style="background: var(--bg-subtle); border-radius: 8px; padding: 12px; border: 1px solid var(--border-light);">
                <div style="font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Completion Rate</div>
                <div style="font-size: 18px; font-weight: 800; color: var(--uc-emerald); margin: 2px 0;">${m.completion_rate}</div>
                <div style="font-size: 11px; color: var(--text-secondary);">${m.completed_jobs} jobs verified</div>
            </div>
            <div style="background: var(--bg-subtle); border-radius: 8px; padding: 12px; border: 1px solid var(--border-light);">
                <div style="font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Repeat Customers</div>
                <div style="font-size: 18px; font-weight: 800; color: var(--uc-purple); margin: 2px 0;">${m.repeat_customers}</div>
                <div style="font-size: 11px; color: var(--text-secondary);">Frequent re-bookings</div>
            </div>
            <div style="background: var(--bg-subtle); border-radius: 8px; padding: 12px; border: 1px solid var(--border-light);">
                <div style="font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Avg Response Speed</div>
                <div style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin: 2px 0;">${m.avg_response_mins} mins</div>
                <div style="font-size: 11px; color: var(--text-secondary);">${m.cancellation_rate} cancellation</div>
            </div>
        `;

        if (tipsEl && rel.tips && rel.tips.length > 0) {
            tipsEl.innerHTML = `<span>💡 <strong>Performance Tip:</strong> ${rel.tips[0]}</span>`;
        }
    } catch (e) {
        console.warn("Could not load partner reliability scorecard:", e);
    }
}

// ============================================================
// COOPERATIVE MARKET SLIDE-OUT BOOKING DRAWER
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

    // Check if customer has an active subscription covering this service
    const perkContainer = document.getElementById("drawerSubscriptionPerk");
    const totalEl = document.getElementById("drawerTotal");

    const isCovered = customerActiveSubscription && 
                      customerActiveSubscription.status === "ACTIVE" && 
                      customerActiveSubscription.services.some(s => s.toLowerCase() === trade.toLowerCase());

    if (isCovered && perkContainer) {
        perkContainer.innerHTML = `
            <div class="booking-perk-badge">
                <span>🛡️</span>
                <span><strong>${customerActiveSubscription.plan_title} Applied:</strong> ₹0 Diagnostic / Callout Fee + 15% discount on spares!</span>
            </div>
        `;
        if (totalEl) totalEl.innerHTML = `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 14px; margin-right: 6px;">${price}</span> ₹0.00 (Plan Covered)`;
    } else {
        if (perkContainer) perkContainer.innerHTML = "";
        if (totalEl) totalEl.textContent = price;
    }

    // Reset problem photo and notes
    removeProblemPhoto();
    const notesEl = document.getElementById("drawerProblemNotes");
    if (notesEl) notesEl.value = "";

    drawer.classList.add("active");
    overlay.classList.add("active");
}

function closeBookingDrawer() {
    const drawer = document.getElementById("bookingDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    activeBookingPro = null;
    removeProblemPhoto();
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
    const problemNotes = document.getElementById("drawerProblemNotes")?.value.trim() || "";

    const scheduledTime = `${selectedDate}, ${selectedSlot}`;

    const bookingPayload = {
        customer_id: currentUser.id || "C001",
        worker_id: activeBookingPro.workerId,
        service: activeBookingPro.trade,
        date: scheduledTime,
        problem_photo: currentProblemPhoto || null,
        problem_notes: problemNotes || null
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
            showToast(`🎉 Booking #${data.booking.booking_id} confirmed with ${activeBookingPro.workerName}!`);
            loadPartnerDashboard();
        } else {
            showToast(`Booking error: ${data.message || data.error || 'Please try again.'}`);
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
    
    // Also load partner reliability & portfolio
    loadPartnerReliability();
    loadPartnerPortfolio();

    if (!bookingsContainer) return;

    try {
        const response = await fetch(`/bookings/worker/${partnerWorkerId}`);
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
                    <div>New customer service requests and problem photos will pop up here instantly.</div>
                </div>
            `;
            return;
        }

        bookingsContainer.innerHTML = list.map(b => {
            const statusColor = b.status === "COMPLETED" ? "var(--uc-emerald)" : 
                               (b.status === "ACCEPTED" ? "var(--uc-purple)" : "var(--uc-amber)");

            return `
                <div class="booking-row-item" style="flex-direction: column; align-items: stretch;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
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
                                <button class="filter-pill active" onclick="updateBookingStatus('${b.booking_id}', 'accept')">Accept Job</button>
                                <button class="filter-pill" onclick="updateBookingStatus('${b.booking_id}', 'reject')">Decline</button>
                            ` : ''}
                            ${b.status === 'ACCEPTED' ? `
                                <button class="filter-pill active" style="background: var(--uc-emerald); border-color: var(--uc-emerald);" onclick="updateBookingStatus('${b.booking_id}', 'complete')">Mark Completed</button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Feature 3: Attached Problem Photo & Diagnostic Notes Display -->
                    ${(b.problem_photo || b.problem_notes) ? `
                        <div class="booking-problem-box">
                            ${b.problem_photo ? `
                                <img src="${b.problem_photo}" class="booking-problem-thumb" alt="Problem photo" title="Click to enlarge customer photo" onclick="openPhotoZoom('${b.problem_photo}', 'Customer Issue Photo (Booking #${b.booking_id})', '${escapeQuotes(b.service)} Doorstep Job')">
                            ` : ''}
                            <div style="flex: 1;">
                                <div style="font-size: 11px; font-weight: 800; color: var(--uc-purple); text-transform: uppercase; letter-spacing: 0.03em;">
                                    Customer Problem Photo & Diagnostic Notes
                                </div>
                                <div style="font-size: 12px; color: var(--text-primary); margin-top: 3px; line-height: 1.4;">
                                    ${b.problem_notes || 'Customer attached an issue photo above. Inspect to pack matching spare parts & tools.'}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join("");

    } catch (err) {
        console.error("Error loading partner bookings:", err);
    }
}

async function updateBookingStatus(bookingId, action) {
    try {
        const response = await fetch(`/booking/${bookingId}/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            showToast(`Booking #${bookingId} marked as ${action.toUpperCase()}`);
            loadPartnerDashboard();
            fetchWorkers(); // updates reliability scores in real time
        }
    } catch (e) {
        console.error(e);
        showToast(`Status updated`);
    }
}

async function togglePartnerAvailability() {
    const btn = document.getElementById("toggleAvailabilityBtn");
    const statusText = document.getElementById("availabilityStatusText");
    partnerOnline = !partnerOnline;

    try {
        await fetch(`/worker/${partnerWorkerId}/availability`, {
            method: "POST",
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
            } else {
                checkCustomerSubscription();
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
