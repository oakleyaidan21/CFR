import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import Login from "../screens/Login";
import Post from "../screens/Post";
import Web from "../screens/Web";
import PostSwiper from "../screens/PostSwiper";
import Subreddit from "../screens/Subreddit";
import SubmissionSearchResults from "../screens/SubmissionSearchResults";
import LoadPost from "../screens/LoadPost";

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
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
          })}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="PostSwiper" component={PostSwiper} />
          <Stack.Screen name="Post" component={Post} />
          <Stack.Screen name="Web" component={Web} />
          <Stack.Screen name="LoadPost" component={LoadPost} />
          <Stack.Screen name="Subreddit" component={Subreddit} />
          <Stack.Screen
            name="SearchResults"
            component={SubmissionSearchResults}
          />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default MainNavigator;
