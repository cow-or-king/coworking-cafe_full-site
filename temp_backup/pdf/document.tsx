"use client";

import { StoreProvider } from "@/app/StoreProvider";
import { useTypedSelector } from "@/store/types";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ff0",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function TestDocument() {
  return (
    <Document>
      <StoreProvider>
        <Page style={styles.page}>
          <View>
            <TestText />
          </View>
        </Page>
      </StoreProvider>
    </Document>
  );
}

function TestText() {
  const test = useTypedSelector((state) => state.turnover);

  return <Text>{JSON.stringify(test)}</Text>;
}
