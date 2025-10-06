import express, { type Request, type Response } from 'express';
import cors from "cors";
import compression from "compression";
import { router } from './routes/index.js';
import { globalErrorHandler } from './middlewares/globalErrorHandlers.js';
import notFound from './middlewares/notFound.js';



const app = express();



app.use(compression());
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use("/api/v1", router);


app.get("/", (req: Request, res: Response) =>{
    res.status(200).json({
        message: "Welcome to Portfolio Backend"
    })
});



app.use(globalErrorHandler);
app.use(notFound);


export default app;



