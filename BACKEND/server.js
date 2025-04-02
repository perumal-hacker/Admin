import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Database Connection
import "./config/db.js";

// ENVIRONMENT VARIABLES
const PORT = process.env.PORT || 1045;

app.use(
  cors({
    origin: ["http://localhost:5173"], // Your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Still included for other authenticated routes
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

// ROUTES
import myStoreRoutes from './routes/myStoreRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import dealerProductRoutes from './routes/dealerProductsRoutes.js';
import orderProductRoutes from './routes/orderProductRoutes.js';
import userCartRoutes from './routes/userCartRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import bugReportRoutes from "./routes/bugReportRoutes.js";
import ordersByProductRoutes from './routes/ordersByProduct.js';


// APIs
app.use('/', myStoreRoutes);
app.use("/login", loginRoutes);
app.use("/", dealerProductRoutes);
app.use("/product", orderProductRoutes);
app.use("/", userCartRoutes);
app.use("/", productsRoutes);
app.use("/", bugReportRoutes);
app.use('/api', ordersByProductRoutes);

console.log(`Google Client ID: ${process.env.GOOGLE_CLIENT_ID}`);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});