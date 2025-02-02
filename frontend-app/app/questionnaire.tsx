import {
	View,
	Text,
	Pressable,
	StyleSheet,
	TextInput,
	ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";

type Answer = "yes" | "no" | "unsure";

export default function Questionnaire() {
	const [age, setAge] = useState("");
	const [answers, setAnswers] = useState<Record<string, Answer>>({
		question1: "unsure",
		question2: "unsure",
		question3: "unsure",
		question4: "unsure",
		question5: "unsure",
		question6: "unsure",
		question7: "unsure",
		question8: "unsure",
	});

	const handleAnswer = (question: string, answer: Answer) => {
		setAnswers((prev) => ({ ...prev, [question]: answer }));
	};

	const renderQuestion = (questionKey: string, questionText: string) => (
		<View style={styles.questionContainer}>
			<Text style={styles.questionText}>{questionText}</Text>
			<View style={styles.answersContainer}>
				<Pressable
					style={[
						styles.answerButton,
						answers[questionKey] === "yes" && styles.selectedAnswer,
					]}
					onPress={() => handleAnswer(questionKey, "yes")}
				>
					<Text
						style={[
							styles.answerText,
							answers[questionKey] === "yes" && styles.selectedAnswerText,
						]}
					>
						Yes
					</Text>
				</Pressable>
				<Pressable
					style={[
						styles.answerButton,
						answers[questionKey] === "no" && styles.selectedAnswer,
					]}
					onPress={() => handleAnswer(questionKey, "no")}
				>
					<Text
						style={[
							styles.answerText,
							answers[questionKey] === "no" && styles.selectedAnswerText,
						]}
					>
						No
					</Text>
				</Pressable>
				<Pressable
					style={[
						styles.answerButton,
						answers[questionKey] === "unsure" && styles.selectedAnswer,
					]}
					onPress={() => handleAnswer(questionKey, "unsure")}
				>
					<Text
						style={[
							styles.answerText,
							answers[questionKey] === "unsure" && styles.selectedAnswerText,
						]}
					>
						Unsure
					</Text>
				</Pressable>
			</View>
		</View>
	);

	return (
		<ScrollView style={styles.container}>
			<View style={styles.innerContainer}>
				<Text style={styles.title}>Questionnaire</Text>

				<View style={styles.contentContainer}>
					<View style={styles.ageContainer}>
						<Text style={styles.label}>Age</Text>
						<TextInput
							style={styles.ageInput}
							value={age}
							onChangeText={setAge}
							keyboardType="numeric"
							placeholder="Enter your age"
						/>
					</View>

					{renderQuestion(
						"question1",
						"Have you previously been diagnosed with invasive melanoma or melanoma in situ?",
					)}
					{renderQuestion(
						"question2",
						"Have you previously been diagnosed with basal cell or squamous cell carcinoma?",
					)}
					{renderQuestion(
						"question3",
						"Would you say you have a lot of moles on your body?",
					)}
					{renderQuestion(
						"question4",
						"Does your family have a history of skin cancer?",
					)}
					{renderQuestion("question5", "Are you a fair-skinned person?")}
					{renderQuestion("question6", "Do you have a history of sunburns?")}
					{renderQuestion(
						"question7",
						"Have you previously been diagnosed with Parkinson's disease?",
					)}
					{renderQuestion("question8", "Is your immune system compromised?")}

					<Pressable
						style={styles.nextButton}
						onPress={() =>
							router.push({
								pathname: "/camera",
								params: {
									age: age.toString(),
									q1: answers.question1,
									q2: answers.question2,
									q3: answers.question3,
									q4: answers.question4,
									q5: answers.question5,
									q6: answers.question6,
									q7: answers.question7,
									q8: answers.question8,
								},
							})
						}
					>
						<Text style={styles.buttonText}>Next</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f0f5ff",
	},
	innerContainer: {
		padding: 20,
		paddingVertical: 40,
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
	},
	ageContainer: {
		marginBottom: 24,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4a5568",
		marginBottom: 8,
	},
	ageInput: {
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	questionContainer: {
		marginBottom: 20,
	},
	questionText: {
		fontSize: 16,
		color: "#4a5568",
		marginBottom: 12,
	},
	answersContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
	},
	answerButton: {
		flex: 1,
		backgroundColor: "#f7fafc",
		borderRadius: 8,
		padding: 12,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	selectedAnswer: {
		backgroundColor: "#4299e1",
		borderColor: "#4299e1",
	},
	answerText: {
		fontSize: 14,
		color: "#4a5568",
		fontWeight: "500",
	},
	selectedAnswerText: {
		color: "#ffffff",
	},
	nextButton: {
		backgroundColor: "#4299e1",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 24,
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#ffffff",
	},
});
