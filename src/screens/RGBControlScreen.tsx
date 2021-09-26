import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Layout, Text, Button, Input, Icon } from "@ui-kitten/components";
import shallow from "zustand/shallow";
import { useDevicesStore } from "../BluetoothManager";
import { isDeviceSupported, sendCommandTo } from "../BluetoothDevice";
import ColorPicker from "../components/picker/Hue";
import { RGB } from "colorsys";

export default function RGBControlScreen() {
  const [isConnected, device] = useDevicesStore(
    (state) => [state.connectedDevice != null, state.connectedDevice],
    shallow
  );

  const [command, setCommand] = React.useState("");

  const sendCommand = async () => {
    if (await isDeviceSupported(device)) {
      await sendCommandTo(device, command);
    }

    setCommand("");
  };

  const sendRgb = async ({ r, g, b }: RGB) => {
    if (await isDeviceSupported(device)) {
      await sendCommandTo(device, `RGB ${r} ${g} ${b}`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Layout style={styles.container} level="2">
        {isConnected ? (
          <Text status="success" category="s2">
            Connected to {device.name ?? "[no name]"}
          </Text>
        ) : (
          <Text status="danger" category="s2">
            Connect to a Bluetooth device first!
          </Text>
        )}
        <ColorPicker onColorChange={sendRgb} />

        <Layout level="3" style={styles.formGroup}>
          <Input
            style={styles.input}
            placeholder="Enter command here"
            // value={command}
            onChangeText={setCommand}
            onSubmitEditing={sendCommand}
            disabled={!isConnected}
          />
          <Button
            size="small"
            style={{ margin: 3 }}
            onPress={sendCommand}
            disabled={!isConnected}
            accessoryRight={<Icon name="corner-down-right-outline" />}
          >
            Send
          </Button>
        </Layout>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  formGroup: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    margin: 2,
  },
});
