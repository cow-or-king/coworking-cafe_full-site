import dbConnect from '../../../lib/mongodb';
import CashEntry from '../../../models/CashEntry';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { date, depenses, especes, cbClassique, cbSansContact } = req.body;
      const entry = await CashEntry.create({
        date,
        depenses, // attend un tableau [{label, value}]
        especes,
        cbClassique,
        cbSansContact,
      });
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
