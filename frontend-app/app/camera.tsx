import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useRef, useState } from "react";
import {
	Button,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function App() {
	const { age, q1, q2, q3, q4, q5, q6, q7, q8 } = useLocalSearchParams<{
		age: string;
		q1: string;
		q2: string;
		q3: string;
		q4: string;
		q5: string;
		q6: string;
		q7: string;
		q8: string;
	}>();
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	async function takePicture() {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync();

				// Calculate the scale factor between screen and actual photo
				const scaleFactor = photo.width / WINDOW_WIDTH;
				
				// Scale up our mask size to match the actual photo dimensions
				const actualCropSize = MASK_SIZE * scaleFactor;
				const cropX = (photo.width - actualCropSize) / 2;
				const cropY = (photo.height - actualCropSize) / 2;

				const manipulateResult = await manipulateAsync(
					photo.uri,
					[
						{
							crop: {
								originX: cropX,
								originY: cropY,
								width: actualCropSize,
								height: actualCropSize,
							},
						},
						{
							resize: {
								width: 1120,
								height: 1120,
							},
						},
					],
					{ compress: 1, format: SaveFormat.JPEG }
				);

				const filename = `mole-scan-${Date.now()}.jpg`;
				const localUri = `${FileSystem.documentDirectory}${filename}`;

				await FileSystem.copyAsync({
					from: manipulateResult.uri,
					to: localUri,
				});

				router.push({
					pathname: "/picture-preview",
					params: {
						photoUri: localUri,
						age: age.toString(),
						q1: q1,
						q2: q2,
						q3: q3,
						q4: q4,
						q5: q5,
						q6: q6,
						q7: q7,
						q8: q8,
					},
				});
			} catch (error) {
				console.error("Failed to take picture:", error);
			}
		}
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} facing={facing} ref={cameraRef}>
				<View style={styles.maskOuter}>
					<View style={styles.maskInner} />
				</View>
				<Text style={styles.instructionText}>
					Position the mole to analyze within the square
				</Text>
				<TouchableOpacity
					style={styles.flipButton}
					onPress={toggleCameraFacing}
				>
					<MaterialIcons name="flip-camera-ios" size={36} color="white" />
				</TouchableOpacity>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={takePicture}>
						<Text style={styles.text}>Take Picture</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const WINDOW_WIDTH = Dimensions.get("window").width;
const MASK_SIZE = WINDOW_WIDTH * 0.6;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
		justifyContent: "center",
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	// New styles for the mask
	maskOuter: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	maskInner: {
		width: MASK_SIZE,
		height: MASK_SIZE,
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "white",
		borderRadius: 8,
	},
	instructionText: {
		position: "absolute",
		top: "25%",
		left: 0,
		right: 0,
		textAlign: "center",
		color: "white",
		fontSize: 14,
		paddingHorizontal: 18,
	},
	flipButton: {
		position: "absolute",
		top: 32,
		right: 32,
		width: 44,
		height: 44,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
});
