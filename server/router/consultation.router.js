import { Router } from "express";

import {
  submitConsultation,
  getAllConsultations,
} from "../controllers/consultation.controller.js";

const consultationRouter = Router();

consultationRouter.post("/submit", submitConsultation);
consultationRouter.get("/all", getAllConsultations);

export default consultationRouter;
