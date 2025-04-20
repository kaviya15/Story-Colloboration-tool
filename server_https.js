const express = require("express");
const cookieParser = require("cookie-parser");
const https = require("https");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");
require("dotenv").config();
const { connectDB } = require("./src/config/db");
const routes = require("./src/routes");
const { editFunction } = require("./src/sockets/socketConnection");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "https://zlx20010815.uk", // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

// Read SSL certificate and key
const privateKey = fs.readFileSync("/etc/letsencrypt/live/zlx20010815.uk/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/zlx20010815.uk/fullchain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

// Create WebSocket server on HTTPS
const io = new Server(httpsServer, {
  cors: {
    origin: "https://zlx20010815.uk",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Connect database and start HTTPS server
httpsServer.listen(process.env.PORT || 443, async () => {
  await connectDB();
  editFunction(io);
  console.log("✅ Secure server started listening on port", process.env.PORT || 443);
});

// (Optional) Redirect HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(`https://zlx20010815.uk${req.url}`);
});
http.createServer(httpApp).listen(80, () => {
  console.log("🌐 Redirecting all HTTP traffic to HTTPS");
});
