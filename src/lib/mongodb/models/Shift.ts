import mongoose, { Document, Schema } from "mongoose";

export interface IShift extends Document {
  staffId: mongoose.Types.ObjectId; // Référence à l'identifiant du staff
  firstName: string; // Prénom du Staff
  lastName: string; // Nom du Staff
  date: string; // Date du pointage
  startTime: string; // Heure de début
  endTime: string; // Heure de fin
}

const ShiftSchema: Schema = new Schema({
  staffId: {
    type: mongoose.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Shift ||
  mongoose.model<IShift>("Shift", ShiftSchema);
