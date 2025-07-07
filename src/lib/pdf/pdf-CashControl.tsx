"use client";

import { StoreProvider, withStoreProvider } from "@/app/StoreProvider";
import RowTabTurnover from "@/components/dashboard/pdf/rowTabTurnover";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

const styles = StyleSheet.create({
  page: {
    border: "1px solid rgba(0, 0, 0, 0.3)",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    margin: "auto",
    padding: 20,
    minWidth: 600,
    maxWidth: 600,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    gap: 30,
  },
  bodyView: {
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderColor: "rgba(1, 1, 1, 1)",
  },
  bodyHeader: {
    height: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lastRow: {
    backgroundColor: "rgba(1, 1, 1, 0.05)",
  },

  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderTop: "1px solid #000",
  },
});

function getMonthName(month: number | null): string {
  const months = [
    "JANVIER",
    "FÉVRIER",
    "MARS",
    "AVRIL",
    "MAI",
    "JUIN",
    "JUILLET",
    "AOÛT",
    "SEPTEMBRE",
    "OCTOBRE",
    "NOVEMBRE",
    "DÉCEMBRE",
  ];
  return month !== null && month >= 0 && month < 12 ? months[month] : "";
}

function formatDateDDMMYYYY(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

type RowData = {
  prestaB2B?: { value: number }[];
  depenses?: { value: number }[];
  cbClassique?: number | string;
  cbSansContact?: number | string;
  virement?: number | string;
  especes?: number | string;
  [key: string]: any;
};

function PDFCashControl({
  data,
  selectedMonth,
  selectedYear,
}: {
  data: RowData[];
  selectedMonth: number | null;
  selectedYear: number | null;
}) {
  const columns = useMemo(
    () => [
      {
        // 0
        accessorKey: "libellé",
        header: "Libellé",
      },
      {
        // 1
        accessorKey: "montant",
        header: "Montant",
      },
      {
        // 2
        accessorKey: "TVA55",
        header: "Dont TVA 5,5%",
      },
      {
        // 3
        accessorKey: "TVA10",
        header: "Dont TVA 10%",
      },
      {
        // 4
        accessorKey: "TVA20",
        header: "Dont TVA 20%",
      },
      {
        // 5
        accessorKey: "total",
        header: "Total",
      },
      {
        // 6
        accessorKey: "date",
        header: "Date",
      },
      {
        // 7
        accessorKey: "TTC",
        header: "Total TTC",
      },
      {
        // 8
        accessorKey: "HT",
        header: "Total HT",
      },
      {
        // 9
        accessorKey: "TVA",
        header: "Taxe",
      },
      {
        // 10
        accessorKey: "prestaB2B",
        header: "Factures B2B",
      },
      {
        // 11
        accessorKey: "depenses",
        header: "Dépenses caisse",
      },
      {
        // 12
        accessorKey: "cbClassique",
        header: "Cb classique",
      },
      {
        // 13
        accessorKey: "cbSansContact",
        header: "Cb sans contact",
      },
      {
        // 14
        accessorKey: "virement",
        header: "Virement",
      },
      {
        // 15
        accessorKey: "especes",
        header: "Espèces",
      },
      // Add more columns as needed
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Document pageMode="fullScreen">
      <StoreProvider>
        <Page style={styles.page} size="A4">
          <View style={styles.header} fixed>
            <Image
              src={"/ai-noir.png"}
              style={{
                width: 100,
                height: 100,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Journal de bord
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "" }}>
              {getMonthName(selectedMonth)} {selectedYear}
            </Text>
          </View>
          <View style={styles.body} wrap={false}>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}
              >
                Récapitulatif du chiffre d'affaires
              </Text>
              <View style={styles.bodyView}>
                <View
                  style={{
                    ...styles.bodyHeader,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(1, 1, 1, 0.05)",
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <RowTabTurnover
                      key={headerGroup.id}
                      firstCell={
                        typeof headerGroup.headers[0].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[0].column.columnDef.header(
                              headerGroup.headers[0].getContext(),
                            )
                          : headerGroup.headers[0].column.columnDef.header
                      }
                      secCell={
                        typeof headerGroup.headers[8].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[8].column.columnDef.header(
                              headerGroup.headers[8].getContext(),
                            )
                          : headerGroup.headers[8].column.columnDef.header
                      }
                      thirdCell={
                        typeof headerGroup.headers[9].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[9].column.columnDef.header(
                              headerGroup.headers[9].getContext(),
                            )
                          : headerGroup.headers[9].column.columnDef.header
                      }
                      fourthCell={
                        typeof headerGroup.headers[7].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[7].column.columnDef.header(
                              headerGroup.headers[7].getContext(),
                            )
                          : headerGroup.headers[7].column.columnDef.header
                      }
                    />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    fontSize: 10,
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.slice(2, 6).map((header, idx) => (
                      <View
                        style={{
                          ...styles.bodyHeader,
                          ...(idx === 3 ? styles.lastRow : {}),
                        }}
                        key={header.id || idx}
                      >
                        <RowTabTurnover
                          firstCell={
                            typeof header.column.columnDef.header === "function"
                              ? header.column.columnDef.header(
                                  header.getContext(),
                                )
                              : header.column.columnDef.header
                          }
                          secCell={data.reduce(
                            (
                              sum: number,
                              row: { [x: string]: { [x: string]: any } },
                            ) => {
                              return header.id === "total"
                                ? sum +
                                    Number(
                                      row["ca-ht"]["5,5"] +
                                        row["ca-ht"]["10"] +
                                        row["ca-ht"]["20"] || 0,
                                    )
                                : sum +
                                    Number(
                                      row["ca-ht"][
                                        header.id === "TVA55"
                                          ? "5,5"
                                          : header.id === "TVA10"
                                            ? "10"
                                            : "20"
                                      ] || 0,
                                    );
                            },
                            0,
                          )}
                          thirdCell={data.reduce(
                            (
                              sum: number,
                              row: { [x: string]: { [x: string]: any } },
                            ) => {
                              return header.id === "total"
                                ? sum +
                                    Number(
                                      row["ca-tva"]["5,5"] +
                                        row["ca-tva"]["10"] +
                                        row["ca-tva"]["20"] || 0,
                                    )
                                : sum +
                                    Number(
                                      row["ca-tva"][
                                        header.id === "TVA55"
                                          ? "5,5"
                                          : header.id === "TVA10"
                                            ? "10"
                                            : "20"
                                      ] || 0,
                                    );
                            },
                            0,
                          )}
                          fourthCell={data.reduce(
                            (
                              sum: number,
                              row: { [x: string]: { [x: string]: any } },
                            ) => {
                              return header.id === "total"
                                ? sum +
                                    Number(
                                      row["ca-ttc"]["5,5"] +
                                        row["ca-ttc"]["10"] +
                                        row["ca-ttc"]["20"] || 0,
                                    )
                                : sum +
                                    Number(
                                      row["ca-ttc"][
                                        header.id === "TVA55"
                                          ? "5,5"
                                          : header.id === "TVA10"
                                            ? "10"
                                            : "20"
                                      ] || 0,
                                    );
                            },
                            0,
                          )}
                        />
                      </View>
                    )),
                  )}
                </View>
              </View>
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}
              >
                Récapitulatif des règlements factures B2B /dépenses caisses
              </Text>
              <View style={styles.bodyView}>
                <View
                  style={{
                    ...styles.bodyHeader,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(1, 1, 1, 0.05)",
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <RowTabTurnover
                      key={headerGroup.id}
                      firstCell={
                        typeof headerGroup.headers[0].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[0].column.columnDef.header(
                              headerGroup.headers[0].getContext(),
                            )
                          : headerGroup.headers[0].column.columnDef.header
                      }
                      secCell={
                        typeof headerGroup.headers[1].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[1].column.columnDef.header(
                              headerGroup.headers[1].getContext(),
                            )
                          : headerGroup.headers[1].column.columnDef.header
                      }
                      thirdCell={""}
                      fourthCell={""}
                    />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    fontSize: 10,
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.slice(10, 12).map((header, idx) => (
                      <View style={styles.bodyHeader} key={header.id || idx}>
                        <RowTabTurnover
                          firstCell={
                            typeof header.column.columnDef.header === "function"
                              ? header.column.columnDef.header(
                                  header.getContext(),
                                )
                              : header.column.columnDef.header
                          }
                          secCell={
                            data.reduce(
                              (
                                acc: { [x: string]: any },
                                row: { [x: string]: any },
                              ) => {
                                if (Array.isArray(row[header.id])) {
                                  acc[header.id] += row[header.id].reduce(
                                    (s: number, p: any) =>
                                      s + (Number(p.value) || 0),
                                    0,
                                  );
                                } else {
                                  acc[header.id] += row[header.id] || 0;
                                }

                                return acc;
                              },
                              { [header.id]: 0 },
                            )[header.id]
                          }
                          thirdCell={""}
                          fourthCell={""}
                        />
                      </View>
                    )),
                  )}
                </View>
              </View>
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}
              >
                Récapitulatif des modes de paiement
              </Text>
              <View style={styles.bodyView}>
                <View
                  style={{
                    ...styles.bodyHeader,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(1, 1, 1, 0.05)",
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <RowTabTurnover
                      key={headerGroup.id}
                      firstCell={
                        typeof headerGroup.headers[0].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[0].column.columnDef.header(
                              headerGroup.headers[0].getContext(),
                            )
                          : headerGroup.headers[0].column.columnDef.header
                      }
                      secCell={
                        typeof headerGroup.headers[1].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[1].column.columnDef.header(
                              headerGroup.headers[1].getContext(),
                            )
                          : headerGroup.headers[1].column.columnDef.header
                      }
                      thirdCell={""}
                      fourthCell={""}
                    />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    fontSize: 10,
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.slice(12, 16).map((header, idx) => (
                      <View style={styles.bodyHeader} key={header.id || idx}>
                        <RowTabTurnover
                          firstCell={
                            typeof header.column.columnDef.header === "function"
                              ? header.column.columnDef.header(
                                  header.getContext(),
                                )
                              : header.column.columnDef.header
                          }
                          secCell={
                            data.reduce(
                              (
                                acc: { [x: string]: any },
                                row: { [x: string]: any },
                              ) => {
                                if (Array.isArray(row[header.id])) {
                                  acc[header.id] += row[header.id].reduce(
                                    (s: number, p: any) =>
                                      s + (Number(p.value) || 0),
                                    0,
                                  );
                                } else {
                                  acc[header.id] += row[header.id] || 0;
                                }

                                return acc;
                              },
                              { [header.id]: 0 },
                            )[header.id]
                          }
                          thirdCell={""}
                          fourthCell={""}
                        />
                      </View>
                    )),
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.footer} fixed>
            <Text style={{ fontSize: 10 }}>
              Généré le: {new Date().toLocaleDateString()} à{" "}
              {new Date().toLocaleTimeString()} par Cow-or-King Cafe
            </Text>
          </View>
        </Page>
        <Page style={styles.page} size="A4">
          <View style={{ ...styles.header, height: 100 }} fixed>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
              Récapitulatif journalier du chiffre d'affaires et encaissement
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "" }}>
              {getMonthName(selectedMonth)} {selectedYear}
            </Text>
          </View>

          <View style={styles.body} wrap={false}>
            <View>
              <View style={styles.bodyView}>
                <View
                  style={{
                    ...styles.bodyHeader,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(3, 1, 1, 0.05)",
                    height: 40,
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <RowTabTurnover
                      key={headerGroup.id}
                      firstCell={
                        typeof headerGroup.headers[6].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[6].column.columnDef.header(
                              headerGroup.headers[6].getContext(),
                            )
                          : headerGroup.headers[6].column.columnDef.header
                      }
                      secCell={
                        typeof headerGroup.headers[7].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[7].column.columnDef.header(
                              headerGroup.headers[7].getContext(),
                            )
                          : headerGroup.headers[7].column.columnDef.header
                      }
                      thirdCell={
                        typeof headerGroup.headers[8].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[8].column.columnDef.header(
                              headerGroup.headers[8].getContext(),
                            )
                          : headerGroup.headers[8].column.columnDef.header
                      }
                      fourthCell={
                        typeof headerGroup.headers[9].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[9].column.columnDef.header(
                              headerGroup.headers[9].getContext(),
                            )
                          : headerGroup.headers[9].column.columnDef.header
                      }
                      fifthCell={
                        typeof headerGroup.headers[10].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[10].column.columnDef.header(
                              headerGroup.headers[10].getContext(),
                            )
                          : headerGroup.headers[10].column.columnDef.header
                      }
                      sixthCell={
                        typeof headerGroup.headers[11].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[11].column.columnDef.header(
                              headerGroup.headers[11].getContext(),
                            )
                          : headerGroup.headers[11].column.columnDef.header
                      }
                      seventhCell={
                        typeof headerGroup.headers[12].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[12].column.columnDef.header(
                              headerGroup.headers[12].getContext(),
                            )
                          : headerGroup.headers[12].column.columnDef.header
                      }
                      eighthCell={
                        typeof headerGroup.headers[13].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[13].column.columnDef.header(
                              headerGroup.headers[13].getContext(),
                            )
                          : headerGroup.headers[13].column.columnDef.header
                      }
                      ninthCell={
                        typeof headerGroup.headers[14].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[14].column.columnDef.header(
                              headerGroup.headers[14].getContext(),
                            )
                          : headerGroup.headers[14].column.columnDef.header
                      }
                      tenthCell={
                        typeof headerGroup.headers[15].column.columnDef
                          .header === "function"
                          ? headerGroup.headers[15].column.columnDef.header(
                              headerGroup.headers[15].getContext(),
                            )
                          : headerGroup.headers[15].column.columnDef.header
                      }
                    />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    fontSize: 10,
                  }}
                >
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      // console.log("PDFCashControl row:", row),
                      <View
                        style={{
                          ...styles.bodyHeader,
                        }}
                        key={row.id}
                      >
                        <RowTabTurnover
                          firstCell={
                            formatDateDDMMYYYY(row.getValue("date")) ||
                            "Aucune date"
                          }
                          secCell={row.getValue("TTC") || "0,00 €"}
                          thirdCell={row.getValue("HT") || "0,00 €"}
                          fourthCell={row.getValue("TVA") || "0,00 €"}
                          fifthCell={
                            row.original.prestaB2B?.length
                              ? row.original.prestaB2B
                                  .reduce(
                                    (acc: number, presta: { value: number }) =>
                                      acc +
                                      (typeof presta.value === "number"
                                        ? presta.value
                                        : 0),
                                    0,
                                  )
                                  .toLocaleString("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                    minimumFractionDigits: 2,
                                  })
                              : " "
                          }
                          sixthCell={
                            row.original.depenses?.length
                              ? row.original.depenses
                                  .reduce(
                                    (acc: number, presta: { value: number }) =>
                                      acc +
                                      (typeof presta.value === "number"
                                        ? presta.value
                                        : 0),
                                    0,
                                  )
                                  .toLocaleString("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                    minimumFractionDigits: 2,
                                  })
                              : " "
                          }
                          seventhCell={row.getValue("cbClassique") || "0,00 €"}
                          eighthCell={row.getValue("cbSansContact") || "0,00 €"}
                          ninthCell={row.getValue("virement") || "0,00 €"}
                          tenthCell={row.getValue("especes") || "0,00 €"}
                        />
                      </View>
                    ))
                  ) : (
                    <Text>Aucune donnée disponible</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer} fixed>
            <Text style={{ fontSize: 10 }}>
              Généré le: {new Date().toLocaleDateString()} à{" "}
              {new Date().toLocaleTimeString()} par Cow-or-King Cafe
            </Text>
          </View>
        </Page>
      </StoreProvider>
    </Document>
  );
}

export default withStoreProvider(PDFCashControl);
