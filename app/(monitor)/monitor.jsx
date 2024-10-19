import { Camera, CameraType } from "expo-camera/legacy";
import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Monitor() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (isDetecting) {
      const interval = setInterval(() => {
        captureAndDetectEmotion();
      }, 3000); // Capture and send a frame every 3 seconds

      return () => clearInterval(interval); // Cleanup on component unmount or when detecting stops
    }
  }, [isDetecting]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
        }}
      >
        <Text style={{ textAlign: "center", width: "50%" }}>
          We need your permission to Monitor
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#7CB9E8",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
          onPress={requestPermission}
        >
          <Text style={{ textAlign: "center" }}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const captureAndDetectEmotion = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
        console.log('got photo')
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      try {
        const response = await fetch("http:// 192.168.1.4:5000/detect_emotion", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setEmotion(response.data); // Update the emotion state with the detected emotion
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View>
          <TouchableOpacity
            style={styles.backButtonWrapper2}
            onPress={() => {
              router.replace("/home");
            }}
          >
            <Ionicons name={"arrow-back-outline"} color={"#45484A"} size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <View
        style={{
          paddingVertical: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={styles.backButtonWrapper}
          onPress={toggleDetection}
        >
          <Text style={{ color: "white" }}>Start</Text>
        </TouchableOpacity>
      </View>
      {emotion && (
        <View style={styles.emotionView}>
          <Text style={styles.emotionText}>
            Detected Emotion: {JSON.stringify(emotion)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  backButtonWrapper: {
    height: 50,
    width: 50,
    backgroundColor: "red",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  backButtonWrapper2: {
    height: 40,
    width: 40,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
    marginTop: 40,
    marginLeft: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
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
  emotionView: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  emotionText: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});
