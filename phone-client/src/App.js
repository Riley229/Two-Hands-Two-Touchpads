import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";
import { io } from "socket.io-client";
import TouchPad from "./components/TouchPad";

import { LogBox } from "react-native";
import ServerAddressInput from "./components/ServerAddressInput";
LogBox.ignoreLogs(["new NativeEventEmitter()"]); // Ignore log notification by message

export default function App() {
  const { height, width } = useWindowDimensions();
  const [touchMode, setTouchMode] = useState(true);
  const [serverAddress, setServerAddress] = useState("");
  const [socket, setSocket] = useState(null);

  const singleHorizontalMultiplier = 150;
  const singleVerticalMultiplier = 300;

  const doubleHorizontalMultiplier = 175;
  const doubleVerticalMultipler = 200;

  useEffect(() => {
    if (socket) socket.close;

    const newSocket = io("http://" + serverAddress + ":10942", {
      extraHeaders: {
        ["client-type"]: "remote",
      },
      transports: ["websocket"],
    });
    newSocket.on("set-mode", async function (single) {
      setTouchMode(single);
    });
    newSocket.on("connect", () => {
      setSocket(newSocket);
    });
  }, [serverAddress]);

  const onPan = (event, left, offsetx, offsety) => {
    console.log(left, (event.x / width) * 100, (event.y / height) * 100);
    const xMultiplier = touchMode
      ? singleHorizontalMultiplier
      : doubleHorizontalMultiplier;
    const yMultiplier = touchMode
      ? singleVerticalMultiplier
      : doubleVerticalMultipler;
    socket.emit(
      "cursor-set",
      left,
      (event.x / width) * xMultiplier + offsetx,
      (event.y / height) * yMultiplier + offsety
    );
  };

  const onPanSingle = (event) => {
    onPan(event, true, -30, -105);
  };

  const onPanLeft = (event) => {
    onPan(event, true, -10, -40);
  };

  const onPanRight = (event) => {
    onPan(event, false, 23, -40);
  };

  const onReleaseLeft = (event) => {
    if (event.state === State.END) {
      socket.emit("click", true);
    }
  };

  const onReleaseRight = (event) => {
    if (event.state === State.END) {
      socket.emit("click", false);
    }
  };

  if (touchMode) {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  } else {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }

  return (
    <GestureHandlerRootView style={styles.view}>
      {!socket && (
        <ServerAddressInput
          style={styles.dialogContainer}
          isVisible={!socket}
          onSave={(address) => setServerAddress(address)}
        />
      )}
      {socket &&
        (touchMode ? (
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
        ))}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#363636",
    flex: 1,
  },
  touchPadSingle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(116, 246, 246, 0.7)",
  },
  touchPadLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(116, 246, 246, 0.7)",
  },
  touchPadRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(235, 107, 126, 0.7)",
  },
  dialogContainer: {
    color: "#FFFFFF",
    backgroundColor: "#363636",
  },
});
