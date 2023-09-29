import React from "react";

import { Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

export default function TouchPad({ style, text, onPan }) {
  return (
    <PanGestureHandler onGestureEvent={onPan} onHandlerStateChange={onPan}>
      <View style={[style]}>
        <Text>{text}</Text>
      </View>
    </PanGestureHandler>
  );
}
