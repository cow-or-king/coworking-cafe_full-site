// models/Turnover.js
import mongoose from 'mongoose';

const TurnoverSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  'vat-20': {
    'total-ht': { type: Number, required: true },
    'total-ttc': { type: Number, required: true },
    'total-taxes': { type: Number, required: true },
  },
  'vat-10': {
    'total-ht': { type: Number, required: true },
    'total-ttc': { type: Number, required: true },
    'total-taxes': { type: Number, required: true },
  },
  'vat-55': {
    'total-ht': { type: Number, required: true },
    'total-ttc': { type: Number, required: true },
    'total-taxes': { type: Number, required: true },
  },
  'vat-0': {
    'total-ht': { type: Number, required: true },
    'total-ttc': { type: Number, required: true },
    'total-taxes': { type: Number, required: true },
  },
});

export default mongoose.models.Turnover || mongoose.model('Turnover', TurnoverSchema);
