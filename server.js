const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

/* ============================
   CORS – Allow Vercel Frontend
============================ */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* ============================
   Database
============================ */
mongoose.connect('mongodb+srv://TrailBliss04:Harsha04@trailbliss.6zqk71c.mongodb.net/?appName=TrailBliss')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

/* ============================
   Cloudinary
============================ */
cloudinary.config({
    cloud_name: 'dvcn1fr7o',
    api_key: '964939665952476',
    api_secret: 'g8eq8NuD8_a1yqbwonHt7PkEm3k'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "trailbliss_uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
});
const upload = multer({ storage });

/* ============================
   Schemas
============================ */
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String
});
const User = mongoose.model("User", userSchema);

const spotSchema = new mongoose.Schema({
    state: String,
    name: String,
    category: String,
    image: String,
    desc: String,
    lat: Number,
    lng: Number
});
const TouristSpot = mongoose.model("Spot", spotSchema);

const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model("Feedback", feedbackSchema);

const guideSchema = new mongoose.Schema({
    email: String,
    name: String,
    bio: String,
    experience: String,
    languages: String,
    phone: String,
    profileImage: String
});
const Guide = mongoose.model("Guide", guideSchema);

const bookingSchema = new mongoose.Schema({
    touristEmail: String,
    touristPhone: String,
    guideEmail: String,
    spotName: String,
    date: String,
    type: String,
    status: { type: String, default: "Pending" }
});
const Booking = mongoose.model("Booking", bookingSchema);

/* ============================
   Auth
============================ */
app.post("/api/register", async (req, res) => {
    const { email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await new User({ email, password: hash, role }).save();
    res.json({ success: true });
});

app.post("/api/login", async (req, res) => {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.role !== role) return res.json({ error: "Invalid login" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ error: "Wrong password" });

    res.json({ success: true, role: user.role });
});

/* ============================
   Tourist Spots
============================ */
app.get("/api/spots", async (req, res) => {
    res.json(await TouristSpot.find());
});

app.post("/api/spots", upload.single("image"), async (req, res) => {
    const spot = new TouristSpot({
        ...req.body,
        image: req.file.path
    });
    await spot.save();
    res.json({ success: true });
});

/* ============================
   Feedback
============================ */
app.post("/api/feedback", async (req, res) => {
    await new Feedback(req.body).save();
    res.json({ success: true });
});

/* ============================
   Guides
============================ */
app.get("/api/guides", async (req, res) => {
    res.json(await Guide.find());
});

app.post("/api/guide-profile", upload.single("profileImage"), async (req, res) => {
    const data = { ...req.body };
    if (req.file) data.profileImage = req.file.path;
    await Guide.findOneAndUpdate({ email: data.email }, data, { upsert: true });
    res.json({ success: true });
});

/* ============================
   Booking
============================ */
app.post("/api/book", async (req, res) => {
    await new Booking(req.body).save();
    res.json({ success: true });
});

app.get("/api/tourist-bookings", async (req, res) => {
    res.json(await Booking.find({ touristEmail: req.query.email }));
});

/* ============================
   Start Server
============================ */
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
