import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function StartScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>AI Skin Analysis</Text>

			<View style={styles.contentContainer}>
				<Text style={styles.description}>
					This application uses artificial intelligence to analyze skin lesions
					and moles for potential cancer indicators.
				</Text>

				<View style={styles.disclaimerContainer}>
					<Text style={styles.disclaimerTitle}>IMPORTANT NOTICE:</Text>
					<Text style={styles.disclaimerText}>
						This application is not intended to diagnose cancer or replace
						professional medical advice. Consult a qualified healthcare provider
						for proper diagnosis and treatment.
					</Text>
				</View>

				{/* Start Button */}
				<Pressable
					style={styles.startButton}
					onPress={() => router.push("/questionnaire")}
				>
					<Text style={styles.buttonText}>Start Analysis</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f0f5ff",
		paddingHorizontal: 20,
		paddingVertical: 40,
		justifyContent: 'center',
	},

	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#2c5282",
		marginBottom: 30,
		textAlign: "center",
	},

	contentContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		padding: 24,
		marginVertical: 20,
	},

	description: {
		fontSize: 16,
		lineHeight: 24,
		color: "#4a5568",
		marginBottom: 24,
		textAlign: "center",
	},

	disclaimerContainer: {
		backgroundColor: "#fff5f5",
		borderRadius: 8,
		padding: 16,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#feb2b2",
	},

	disclaimerTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#e53e3e",
		marginBottom: 8,
	},

	disclaimerText: {
		fontSize: 14,
		lineHeight: 20,
		color: "#4a5568",
	},

	startButton: {
		backgroundColor: "#4299e1",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 16,
	},

	buttonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#ffffff",
	},
});
