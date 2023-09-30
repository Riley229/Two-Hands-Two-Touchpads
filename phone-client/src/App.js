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

  const horizontalMultiplier = 175;
  const verticalMultiplier = 150;

  useEffect(() => {
    if (socket) {
      socket.close;
    }
    const newSocket = io("http://" + serverAddress + ":10942", {
      extraHeaders: {
        ["client-type"]: "remote",
      },
      transports: ["websocket"],
    });
    newSocket.on("set-mode", async function (single) {
      setTouchMode(single);
    });
    setSocket(newSocket);
  }, [serverAddress]);

  const onPan = (event, left, offsetx, offsety) => {
    console.log(
      left,
      (event.nativeEvent.x / width) * 100,
      (event.nativeEvent.y / height) * 100
    );
    socket.emit(
      "cursor-set",
      left,
      (event.nativeEvent.x / width) * horizontalMultiplier + offsetx,
      (event.nativeEvent.y / height) * verticalMultiplier + offsety
    );
  };

  const onPanSingle = (event) => {
    onPan(event, true, -40, -20);
  };

  const onPanLeft = (event) => {
    onPan(event, true, -10, -20);
  };

  const onPanRight = (event) => {
    onPan(event, false, 23, -20);
  };

  const onReleaseLeft = (event) => {
    if (event.nativeEvent.state === State.END) {
      socket.emit("click", true);
    }
  };

  const onReleaseRight = (event) => {
    if (event.nativeEvent.state === State.END) {
      socket.emit("click", false);
    }
  };

  if (touchMode) {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  } else {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!serverAddress && (
        <ServerAddressInput
          isVisible={!serverAddress}
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
