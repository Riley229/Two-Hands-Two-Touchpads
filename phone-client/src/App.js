import * as ScreenOrientation from "expo-screen-orientation";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TouchPad from "./components/TouchPad";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter()"]); // Ignore log notification by message

export default function App() {
  const [touchMode, setTouchMode] = useState(true);

  const onPanLeft = (event) => {
    console.log(
      "left",
      event.nativeEvent.absoluteX,
      event.nativeEvent.absoluteY
    );
  };

  const onPanRight = (event) => {
    console.log(
      "right",
      event.nativeEvent.absoluteX,
      event.nativeEvent.absoluteY
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
