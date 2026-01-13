const API = "https://trail-bliss.onrender.com";

/* ======================
   AUTH
====================== */

// Register
async function registerUser(email, password, role) {
    const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
    });
    return res.json();
}

// Login
async function loginUser(email, password, role) {
    const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
    });
    return res.json();
}

/* ======================
   TOURIST SPOTS
====================== */

async function getSpots() {
    const res = await fetch(`${API}/api/spots`);
    return res.json();
}

async function addSpot(formData) {
    const res = await fetch(`${API}/api/spots`, {
        method: "POST",
        body: formData
    });
    return res.json();
}

/* ======================
   FEEDBACK
====================== */

async function sendFeedback(name, email, message) {
    const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
    });
    return res.json();
}

/* ======================
   GUIDES
====================== */

async function getGuides() {
    const res = await fetch(`${API}/api/guides`);
    return res.json();
}

async function updateGuideProfile(formData) {
    const res = await fetch(`${API}/api/guide-profile`, {
        method: "POST",
        body: formData
    });
    return res.json();
}

/* ======================
   BOOKINGS
====================== */

async function bookGuide(data) {
    const res = await fetch(`${API}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function getTouristBookings(email) {
    const res = await fetch(`${API}/api/tourist-bookings?email=${email}`);
    return res.json();
}
