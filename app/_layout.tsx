import { Stack } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from "react";

export default function RootLayout() {

  useEffect(()=>{
    const unlockScreenOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    unlockScreenOrientation();
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown:false
      }}
    >
     <Stack.Screen name="index"/>
     <Stack.Screen name="game"/>
    </Stack>
  )
}
