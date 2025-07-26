import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { connectDB } from "./database/db.js";
import authRouter from "./routes/authRoutes.js"
export const app = express();

app.use(cors())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true

}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//localhost:5000/api/auth
app.get("/", (req, res) => {
    res.send("Welcome to the Library Backend");
});
app.use("/api/auth", authRouter);
connectDB();
app.use(errorMiddleware);
