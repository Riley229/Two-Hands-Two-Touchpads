import React from "react";

import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function TouchPad({ style, text, onBegin, onPan, onRelease }) {
  const touchPadGestures = Gesture.Race(
    Gesture.Pan().onBegin(onBegin).onUpdate(onPan).onEnd(onRelease),
    Gesture.Tap().onBegin(onBegin).onEnd(onRelease)
  );
  return (
    <GestureDetector gesture={touchPadGestures}>
      <View style={[style]}>
        <Text>{text}</Text>
      </View>
    </GestureDetector>
  );
}
