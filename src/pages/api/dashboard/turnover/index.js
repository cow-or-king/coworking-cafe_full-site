//pages/api/turnover/index.js
import Turnover from "../../../../lib/mongodb/models/Turnover";
import dbConnect from "../../../../lib/mongodb/mongodb";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const turnovers = await Turnover.aggregate([
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $project: {
              date: "$_id",
              TTC: {
                $round: [
                  {
                    $add: [
                      {
                        $ifNull: ["$vat-20.total-ttc", 0],
                      },
                      {
                        $ifNull: ["$vat-10.total-ttc", 0],
                      },
                      {
                        $ifNull: ["$vat-55.total-ttc", 0],
                      },
                      {
                        $ifNull: ["$vat-0.total-ttc", 0],
                      },
                    ],
                  },
                  2,
                ],
              },
              HT: {
                $round: [
                  {
                    $add: [
                      {
                        $ifNull: ["$vat-20.total-ht", 0],
                      },
                      {
                        $ifNull: ["$vat-10.total-ht", 0],
                      },
                      {
                        $ifNull: ["$vat-55.total-ht", 0],
                      },
                      {
                        $ifNull: ["$vat-0.total-ht", 0],
                      },
                    ],
                  },
                  2,
                ],
              },
              TVA: {
                $round: [
                  {
                    $add: [
                      {
                        $ifNull: ["$vat-20.total-taxes", 0],
                      },
                      {
                        $ifNull: ["$vat-10.total-taxes", 0],
                      },
                      {
                        $ifNull: ["$vat-55.total-taxes", 0],
                      },
                      {
                        $ifNull: ["$vat-0.total-taxes", 0],
                      },
                    ],
                  },
                  2,
                ],
              },
              "ca-ttc": {
                20: {
                  $cond: [
                    { $ne: ["$vat-20.total-ttc", null] },
                    { $round: ["$vat-20.total-ttc", 2] },
                    undefined,
                  ],
                },
                10: {
                  $cond: [
                    { $ne: ["$vat-10.total-ttc", null] },
                    { $round: ["$vat-10.total-ttc", 2] },
                    undefined,
                  ],
                },
                "5,5": {
                  $cond: [
                    { $ne: ["$vat-55.total-ttc", null] },
                    { $round: ["$vat-55.total-ttc", 2] },
                    undefined,
                  ],
                },
                0: {
                  $cond: [
                    { $ne: ["$vat-0.total-ttc", null] },
                    { $round: ["$vat-0.total-ttc", 2] },
                    undefined,
                  ],
                },
              },
              "ca-ht": {
                20: {
                  $cond: [
                    { $ne: ["$vat-20.total-ht", null] },
                    { $round: ["$vat-20.total-ht", 2] },
                    undefined,
                  ],
                },
                10: {
                  $cond: [
                    { $ne: ["$vat-10.total-ht", null] },
                    { $round: ["$vat-10.total-ht", 2] },
                    undefined,
                  ],
                },
                "5,5": {
                  $cond: [
                    { $ne: ["$vat-55.total-ht", null] },
                    { $round: ["$vat-55.total-ht", 2] },
                    undefined,
                  ],
                },
                0: {
                  $cond: [
                    { $ne: ["$vat-0.total-ht", null] },
                    { $round: ["$vat-0.total-ht", 2] },
                    undefined,
                  ],
                },
              },
              "ca-tva": {
                20: {
                  $cond: [
                    { $ne: ["$vat-20.total-taxes", null] },
                    { $round: ["$vat-20.total-taxes", 2] },
                    undefined,
                  ],
                },
                10: {
                  $cond: [
                    { $ne: ["$vat-10.total-taxes", null] },
                    { $round: ["$vat-10.total-taxes", 2] },
                    undefined,
                  ],
                },
                "5,5": {
                  $cond: [
                    { $ne: ["$vat-55.total-taxes", null] },
                    { $round: ["$vat-55.total-taxes", 2] },
                    undefined,
                  ],
                },
                0: {
                  $cond: [
                    { $ne: ["$vat-0.total-taxes", null] },
                    { $round: ["$vat-0.total-taxes", 2] },
                    undefined,
                  ],
                },
              },
            },
          },
        ]);
        res.status(200).json({ success: true, data: turnovers });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
  }
}
