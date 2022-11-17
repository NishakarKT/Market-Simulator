import express from "express";
import * as ctrl from "./controllers/ctrl.js";

const Router = express.Router();

// User Routes
Router.get("/data", ctrl.getData);
Router.post("/order", ctrl.acceptOrder);
Router.post("/new_user", ctrl.newUser);

export default Router;