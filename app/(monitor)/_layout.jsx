import { Stack } from "expo-router";

export default function MonitorLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="monitor" />
    </Stack>
  );
}
