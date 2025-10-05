import express, { type Request, type Response } from 'express';
import cors from "cors";
import compression from "compression";



const app = express();



app.use(compression());
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);



app.get("/", (req: Request, res: Response) =>{
    res.status(200).json({
        message: "Welcome to Portfolio Backend"
    })
});




export default app;



