import express from "express";
import router from "./routes/index.js";
import cors from "cors";


const app = express();

app.use(express.json());
// app.use(cors())
app.use(cors({origin: ["http://localhost:3000", "http://localhost:3002"], credentials: true}));
app.options('*', cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], credentials: true }));
app.use("/api", router);

export default app;
