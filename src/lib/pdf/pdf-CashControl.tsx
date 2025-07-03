"use client";

import { StoreProvider, withStoreProvider } from "@/app/StoreProvider";
import RowTab from "@/components/dashboard/pdf/rowTab";
import { CashEntryApi } from "@/store/cashentry";
import { TurnoverApi } from "@/store/turnover";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useEffect } from "react";

const styles = StyleSheet.create({
  page: {
    border: "1px solid rgba(0, 0, 0, 0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    height: 250,
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
    height: "100%",
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
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderTop: "1px solid #000",
  },
});

function PDFCashControl() {
  // Get the store dispatch.
  const dispatch = useTypedDispatch();

  // Fetch the turnover data from the store.
  useEffect(
    function fetchTurnoverData() {
      dispatch(TurnoverApi.fetchData());
      dispatch(CashEntryApi.fetchCashEntries());
    },
    [dispatch],
  );

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
              <TestText />
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "" }}>JUIN 2025</Text>
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
                  <RowTab
                    firstCol="Libellé"
                    secCol="Total HT"
                    thirdCol="Taxe"
                    fourthCol="Total TTC"
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="dont TVA 5,5%"
                    secCol="160.95 "
                    thirdCol="8.85 "
                    fourthCol="169.80"
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="dont TVA 10%"
                    secCol="11073.45"
                    thirdCol="1107.35"
                    fourthCol="12180.80"
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="dont TVA 20%"
                    secCol="3009.04"
                    thirdCol="601.81"
                    fourthCol="3610.85"
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
              </View>
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}
              >
                Récapitulatif des dépenses caisses / règlements factures B2B
              </Text>
              <View style={styles.bodyView}>
                <View
                  style={{
                    ...styles.bodyHeader,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(1, 1, 1, 0.05)",
                  }}
                >
                  <RowTab
                    firstCol="Type de paiement"
                    secCol="Montant"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="Dépenses caisse"
                    secCol="100"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="Factures B2B"
                    secCol="100"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
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
                  <RowTab
                    firstCol="Type de paiement"
                    secCol="Montant"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="Cb "
                    secCol="100"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="Cb sans contact"
                    secCol="100"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="Virement"
                    secCol="100"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="Espèces "
                    secCol="100"
                    thirdCol=""
                    fourthCol=""
                    fiveCol=""
                    sixthCol=""
                    seventhCol=""
                    eighthCol=""
                    ninthCol=""
                    tenthCol=""
                  />
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
          <View style={styles.header} fixed>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
              Récapitulatif journalier du chiffre d'affaires et encaissement
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "" }}>JUIN 2025</Text>
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
                  <RowTab
                    firstCol="Date"
                    secCol="Total HT"
                    thirdCol="Taxe"
                    fourthCol="Total TTC"
                    fiveCol="Factures B2B"
                    sixthCol="Dépenses caisse"
                    seventhCol="Virement"
                    eighthCol="Cb classique"
                    ninthCol="Cb sans contact"
                    tenthCol="Espèces"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="03/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
                </View>
                <View style={styles.bodyHeader}>
                  <RowTab
                    firstCol="31/06/2025"
                    secCol="309.04"
                    thirdCol="601.81"
                    fourthCol="310.85"
                    fiveCol="601.81"
                    sixthCol="601.81"
                    seventhCol="601.81"
                    eighthCol="601.81"
                    ninthCol="601.81"
                    tenthCol="601.81"
                  />
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

function TestText() {
  const test = useTypedSelector((state) => state.turnover.data?.[500]);
  // console.log("TestText data:", test);

  return (
    <Text>
      {test?.date}
      {test?.HT}
    </Text>
  );
}
