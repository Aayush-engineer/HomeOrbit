import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import { authMiddleware } from "./middleware/authMiddleware";





// configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// ROUTES
app.get("/",(req,res) => {
    res.send("this is home route");
})


app.use("/tenants", authMiddleware(["tenant"]));
app.use("/managers", authMiddleware(["manager"]));





// SERVER

const port = Number(process.env.PORT) || 3002;
app.listen(port, "0.0.0.0",()=>{
    console.log(`server running on port ${port}`);
})
