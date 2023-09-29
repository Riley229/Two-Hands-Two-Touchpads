import * as ScreenOrientation from "expo-screen-orientation";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { io } from "socket.io-client";
import TouchPad from "./components/TouchPad";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter()"]); // Ignore log notification by message

export default function App() {
  const serverAddress = "";
  const socket = io("http://" + serverAddress + ":10942", {
    extraHeaders: {
      ["client-type"]: "remote",
    },
    transports: ["websocket"],
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error.message);
  });

  const {height, width} = useWindowDimensions();
  const [touchMode, setTouchMode] = useState(true);

  const onPanLeft = (event) => {
    console.log(
      "left",
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100,
    );
    socket.emit(
      "cursor-set",
      true,
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100,
    );
  };

  const onPanRight = (event) => {
    console.log(
      "right",
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100,
    );
    socket.emit(
      "cursor-set",
      false,
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100,
    );
  };

  const toggleTouchMode = async () => {
    setTouchMode((prev) => !prev);
    if (touchMode) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {touchMode ? (
        <TouchPad
          style={styles.touchPadSingle}
          text={"CENTER"}
          onPan={onPanLeft}
        />
      ) : (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchPad
            style={styles.touchPadLeft}
            text={"LEFT"}
            onPan={onPanLeft}
          />
          <TouchPad
            style={styles.touchPadRight}
            text={"RIGHT"}
            onPan={onPanRight}
          />
        </View>
      )}
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={toggleTouchMode}
      >
        <Text>TOGGLE TOUCHPAD</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  touchPadSingle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
  },
  touchPadLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightcyan",
  },
  touchPadRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightpink",
  },
});
