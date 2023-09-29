import * as ScreenOrientation from "expo-screen-orientation";
import React, { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";
import { io } from "socket.io-client";
import TouchPad from "./components/TouchPad";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter()"]); // Ignore log notification by message

const serverAddress = "192.168.119.124";
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

  const onPanLeft = (event) => {
    console.log(
      "left",
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100
    );
    socket.emit(
      "cursor-set",
      true,
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100
    );
  };

  const onPanRight = (event) => {
    console.log(
      "right",
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100
    );
    socket.emit(
      "cursor-set",
      false,
      (event.nativeEvent.absoluteX / width) * 100,
      (event.nativeEvent.absoluteY / height) * 100
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
    if (touchMode) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {touchMode ? (
        <TouchPad
          style={styles.touchPadSingle}
          text={"CENTER"}
          onPan={onPanLeft}
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
