// models/Staff.ts
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  // _id: { type: String, required: true }, // Champ pour l'UUID unique
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ajout du champ email avec unicité
  tel: { type: String, required: true },
  numberSecu: { type: String, required: true },
  adresse: { type: String, required: true },
  zipcode: { type: String, required: true },
  city: { type: String, required: true },
  framework: { type: String, required: false },
  times: { type: String, required: false },
  hourlyRate: { type: Number, required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  contract: { type: String, required: false },
  active: { type: Boolean, default: true }, // Champ pour l'état actif/inactif
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
