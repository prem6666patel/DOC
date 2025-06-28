import consultationModel from "../models/consultation.model.js";

export const submitConsultation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, legalMatterType, message } =
      req.body;

    // Basic validation (optional: add stricter rules or use validation libraries)
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !legalMatterType ||
      !message
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newConsultation = new consultationModel({
      firstName,
      lastName,
      email,
      phone,
      legalMatterType,
      message,
    });

    await newConsultation.save();

    res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting consultation:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await consultationModel
      .find()
      .sort({ submittedAt: -1 });

    if (consultations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No consultation requests found.",
        data: [],
      });
    }

    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultation requests",
    });
  }
};
