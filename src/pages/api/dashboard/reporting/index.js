//pages/api/turnover/index.js
import Turnover from "../../../../lib/mongodb/models/Turnover";
import dbConnect from "../../../../lib/mongodb/mongodb";

/**
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
export default async function handler(req, res) {
  await dbConnect();
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        // Prepare the date range.
        let range;
        const startDate = new Date();
        const endDate = new Date();
        switch (query.range) {
          case "week":
            range = "week";
            startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
            break;
          case "month":
            range = "month";
            startDate.setDate(1);
            break;
          case "year":
            range = "year";
            startDate.setMonth(0, 1);
            break;
          default:
            range = "yesterday";
            startDate.setDate(startDate.getDate() - 1);
            break;
        }

        // Move the time to midnight.
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Convert the dates to match the id format.
        const startDateString = `${startDate.getFullYear()}/${(startDate.getMonth() + 1).toString().padStart(2, "0")}/${startDate.getDate().toString().padStart(2, "0")}`;
        const endDateString = `${endDate.getFullYear()}/${(endDate.getMonth() + 1).toString().padStart(2, "0")}/${endDate.getDate().toString().padStart(2, "0")}`;

        // Aggregate the turnover data.
        const reporting = await Turnover.aggregate([
          [
            {
              $match: {
                _id: {
                  $gte: startDateString,
                  $lt: endDateString,
                },
              },
            },
            {
              $project: {
                date: "$_id",
                TTC: {
                  $round: [
                    {
                      $sum: [
                        "$vat-20.total-ttc",
                        "$vat-10.total-ttc",
                        "$vat-55.total-ttc",
                        "$vat-0.total-ttc",
                      ],
                    },
                    2,
                  ],
                },

                HT: {
                  $round: [
                    {
                      $sum: [
                        "$vat-20.total-ht",
                        "$vat-10.total-ht",
                        "$vat-55.total-ht",
                        "$vat-0.total-ht",
                      ],
                    },
                    2,
                  ],
                },
              },
            },
            {
              $group: {
                _id: range,
                TTC: { $sum: "$TTC" },
                HT: { $sum: "$HT" },
              },
            },
            {
              $sort: {
                _id: -1,
              },
            },
          ],
        ]);
        res.status(200).json({ success: true, data: reporting[0] });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
  }
}
