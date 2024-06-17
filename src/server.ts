import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3333;

import { cartRoute } from "./router/cart.route";
import { userRoute } from "./router/user.route";
import { productRoute } from "./router/product.route";


app.use(cors());
app.use(express.json());

app.use("/cart", cartRoute);
app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(PORT, () => console.log("listening on", PORT));