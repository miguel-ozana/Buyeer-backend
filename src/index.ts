import Express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import routes from "./router/routes";

dotenv.config();

const app = Express();
const port = process.env.PORT || 8000;
const prisma = new PrismaClient();

app.use(Express.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
  console.log(`http://localhost:${port}`);
});

a