import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  legalMatterType: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const consultationModel = mongoose.model("Consultation", consultationSchema);
export default consultationModel;
