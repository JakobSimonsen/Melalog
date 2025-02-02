import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function NegativeResult() {
    const { message } = useLocalSearchParams<{ message: string }>();

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <MaterialIcons name="check-circle" size={64} color="#48bb78" />
                <Text style={styles.title}>Good News</Text>
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.disclaimer}>
                    While this result is encouraging, remember to maintain regular
                    skin checks and consult a healthcare provider if you notice any
                    changes in the future.
                </Text>
            </View>
            
            <TouchableOpacity 
                style={styles.button}
                onPress={() => router.push("/")}
            >
                <Text style={styles.buttonText}>Start New Analysis</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0fff4",
        padding: 20,
        justifyContent: "space-between",
    },
    contentContainer: {
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#48bb78",
        marginVertical: 20,
        textAlign: "center",
    },
    message: {
        fontSize: 18,
        color: "#4a5568",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 24,
    },
    disclaimer: {
        fontSize: 16,
        color: "#4a5568",
        textAlign: "center",
        marginTop: 20,
        fontStyle: "italic",
    },
    button: {
        backgroundColor: "#48bb78",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
});
