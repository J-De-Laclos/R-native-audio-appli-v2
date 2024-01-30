/////////////////:
// App.js

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrackPlayer from "react-native-track-player";

// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => require("./service"));

import HomeScreen from "./containers/HomeScreen";
import ProductScreen from "./containers/ProductScreen";
import Home from "./src/screens/Home";
import Music from "./src/screens/Music";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Music"
          component={Music}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="bisHome" component={HomeScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
