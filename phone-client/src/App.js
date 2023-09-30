import * as ScreenOrientation from "expo-screen-orientation";
import React, { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";
import { io } from "socket.io-client";
import TouchPad from "./components/TouchPad";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter()"]); // Ignore log notification by message

const serverAddress = "192.168.137.215";
const socket = io("http://" + serverAddress + ":10942", {
  extraHeaders: {
    ["client-type"]: "remote",
  },
  transports: ["websocket"],
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error.message);
});

export default function App() {
  const { height, width } = useWindowDimensions();
  const [touchMode, setTouchMode] = useState(true);

  const horizontalMultiplier = 175;
  const verticalMultiplier = 125;

  const onPanSingle = (event) => {
    console.log(
      "single",
      (event.nativeEvent.translationX / width) * 100,
      (event.nativeEvent.translationY / height) * 100
    );
    socket.emit(
      "cursor-set",
      true,
      50 + (event.nativeEvent.translationX / width) * horizontalMultiplier,
      50 + (event.nativeEvent.translationY / height) * verticalMultiplier
    );
  };

  const onPanLeft = (event) => {
    console.log(
      "left",
      (event.nativeEvent.translationX / width) * 100,
      (event.nativeEvent.translationY / height) * 100
    );
    socket.emit(
      "cursor-set",
      true,
      33 + (event.nativeEvent.translationX / width) * horizontalMultiplier,
      50 + (event.nativeEvent.translationY / height) * verticalMultiplier
    );
  };

  const onPanRight = (event) => {
    console.log(
      "right",
      (event.nativeEvent.translationX / width) * 100,
      (event.nativeEvent.translationY / height) * 100
    );
    socket.emit(
      "cursor-set",
      false,
      66 + (event.nativeEvent.translationX / width) * horizontalMultiplier,
      50 + (event.nativeEvent.translationY / height) * verticalMultiplier
    );
  };

  const onReleaseLeft = (event) => {
    if (event.nativeEvent.state === State.END) {
      console.log("click");
      socket.emit("click", true);
    }
  };

  const onReleaseRight = (event) => {
    if (event.nativeEvent.state === State.END) {
      socket.emit("click", false);
    }
  };

  socket.on("set-mode", async function (single) {
    setTouchMode(single);
  });

  if (touchMode) {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  } else {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {touchMode ? (
        <TouchPad
          style={styles.touchPadSingle}
          text={"CENTER"}
          onPan={onPanSingle}
          onRelease={onReleaseLeft}
        />
      ) : (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchPad
            style={styles.touchPadLeft}
            text={"LEFT"}
            onPan={onPanLeft}
            onRelease={onReleaseLeft}
          />
          <TouchPad
            style={styles.touchPadRight}
            text={"RIGHT"}
            onPan={onPanRight}
            onRelease={onReleaseRight}
          />
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  touchPadSingle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightcyan",
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
