import React from "react";

import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function TouchPad({ style, text, onPan, onRelease }) {
  const touchPadGestures = Gesture.Race(
    Gesture.Pan().onUpdate(onPan).onEnd(onRelease),
    Gesture.Tap().onBegin(onPan).onEnd(onRelease)
  );
  return (
    <GestureDetector gesture={touchPadGestures}>
      <View style={[style]}>
        <Text>{text}</Text>
      </View>
    </GestureDetector>
  );
}
