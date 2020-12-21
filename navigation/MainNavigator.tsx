import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import Login from "../screens/Login";

const Stack = createStackNavigator();

export type MainStackParamList = {
  Tabs: undefined;
};

const MainNavigator: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            cardStyle: { backgroundColor: "black" },
          })}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default MainNavigator;
