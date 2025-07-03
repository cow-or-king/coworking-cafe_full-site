import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    textAlign: "center",
  },
});

interface ViewValueProps {
  value: string;
}

export default function ViewValue({ value }: ViewValueProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{value}</Text>
    </View>
  );
}
