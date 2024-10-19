import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'

export default function RootLayout() {

  const tokenCache = {
    async getToken(key) {
      try {
        const item = await SecureStore.getItemAsync(key)
        return item
      } catch (error) {
        console.error('SecureStore get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    async saveToken(key, value) {
      try {
        return SecureStore.setItemAsync(key, value)
      } catch (err) {
        return
      }
    },
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key.',
    )
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name="index" />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
