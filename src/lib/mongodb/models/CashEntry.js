import mongoose from "mongoose";

/**
 * Schema used to validate cash entries in the database.
 */
const CashEntrySchema = new mongoose.Schema({
  _id: {
    type: String,
    match: /^\d{4}\/\d{2}\/\d{2}$/,
    required: true,
  },
  prestaB2B: {
    type: [
      {
        label: { type: String },
        value: { type: Number },
      },
    ],
    default: undefined,
    required: false,
  },
  depenses: {
    type: [
      {
        label: { type: String },
        value: { type: Number },
      },
    ],
    default: undefined,
    required: false,
  },
  virement: { type: Number, required: false, default: 0 },
  especes: { type: Number, required: false, default: 0 },
  cbClassique: { type: Number, required: false, default: 0 },
  cbSansContact: { type: Number, required: false, default: 0 },
});

delete mongoose.models.CashEntry;
export default mongoose.models.CashEntry ||
  mongoose.model("CashEntry", CashEntrySchema);
