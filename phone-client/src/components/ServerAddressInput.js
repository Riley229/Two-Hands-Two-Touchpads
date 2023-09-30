import React, { useState } from "react";
import Dialog from "react-native-dialog";

export default function ServerAddressInput({ isVisible, onSave }) {
  const [address, setAddress] = useState("");

  const handleSave = () => {
    onSave(address);
  };

  return (
    <Dialog.Container visible={isVisible}>
      <Dialog.Title>Enter Server Address</Dialog.Title>
      <Dialog.Input
        placeholder="Server Address"
        onChangeText={setAddress}
        value={address}
      />
      <Dialog.Button label="Save" onPress={handleSave} />
    </Dialog.Container>
  );
}
