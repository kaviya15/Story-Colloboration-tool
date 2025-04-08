const express = require("express");
const cookieParser = require("cookie-parser");
const httpserver = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { connectDB } = require("./src/config/db");
const routes = require("./src/routes");
const { editFunction } = require("./src/sockets/socketConnection");
const cors = require("cors");
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));
const server = httpserver.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

server.listen(process.env.PORT || 5000, async () => {
  await connectDB();
  editFunction(io);
  console.log(" ✅ server started listening at port", process.env.PORT || 5000);
});
