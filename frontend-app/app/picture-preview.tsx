import {
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	Text,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useCheckMutation } from './hooks/useCheckMutation';

const WINDOW_WIDTH = Dimensions.get("window").width;
const IMAGE_SIZE = WINDOW_WIDTH * 0.9; // 90% of screen width

interface CheckResponse {
	prediction: 'positive' | 'negative' | 'unsure';
	sensitive_response: string;
}

export default function PicturePreview() {
	const {
		photoUri,
		age,
		q1,
		q2,
		q3,
		q4,
		q5,
		q6,
		q7,
		q8,
	} = useLocalSearchParams();
	const checkMutation = useCheckMutation();

	const handleRetake = () => {
		router.back();
	};

	const handleConfirm = async () => {
		try {
			const result = await checkMutation.mutateAsync({
				photoUri: photoUri as string,
				age: age as string,
				q1: q1 as string,
				q2: q2 as string,
				q3: q3 as string,
				q4: q4 as string,
				q5: q5 as string,
				q6: q6 as string,
				q7: q7 as string,
				q8: q8 as string,
			}) as CheckResponse;

			router.push({
				pathname: `/results/${result.prediction}`,
				params: { message: result.sensitive_response }
			});
			
		} catch (error) {
			console.error('Upload failed:', error);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: photoUri as string }}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={handleRetake}>
					<MaterialIcons name="replay" size={32} color="white" />
					<Text style={styles.buttonText}>Retake</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.confirmButton]}
					onPress={handleConfirm}
				>
					<MaterialIcons name="check" size={32} color="white" />
					<Text style={styles.buttonText}>Confirm</Text>
				</TouchableOpacity>
			</View>
			{checkMutation.isLoading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color="#ffffff" />
					<Text style={styles.loadingText}>Uploading...</Text>
				</View>
			)}
			{checkMutation.isError && (
				<Text style={styles.errorText}>
					Error: {checkMutation.error?.message}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
		justifyContent: "space-between",
	},
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
		borderRadius: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 20,
		paddingBottom: 40,
		backgroundColor: "rgba(0,0,0,0.7)",
	},
	button: {
		alignItems: "center",
		padding: 15,
		borderRadius: 8,
		minWidth: 100,
	},
	confirmButton: {
		backgroundColor: "rgba(0,128,0,0.5)",
	},
	buttonText: {
		color: "white",
		marginTop: 5,
		fontSize: 16,
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 20,
	},
	errorText: {
		color: "red",
		fontSize: 16,
		textAlign: "center",
		marginTop: 20,
	},
});
