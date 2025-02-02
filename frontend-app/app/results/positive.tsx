import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function PositiveResult() {
    const { message } = useLocalSearchParams<{ message: string }>();

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <MaterialIcons name="warning" size={64} color="#e53e3e" />
                <Text style={styles.title}>Important Notice</Text>
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.disclaimer}>
                    Please consult a healthcare professional as soon as possible.
                    This is not a definitive diagnosis, but your case requires
                    immediate medical attention.
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
        backgroundColor: "#fff5f5",
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
        color: "#e53e3e",
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
        backgroundColor: "#e53e3e",
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
