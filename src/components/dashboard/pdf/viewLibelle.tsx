import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "40%",
    paddingLeft: 10,
    display: "flex",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

interface ViewLibelleProps {
  value: string;
}

export default function ViewLibelle({ value }: ViewLibelleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{value}</Text>
    </View>
  );
}
