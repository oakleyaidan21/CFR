import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import Login from "../screens/Login";
import Post from "../screens/Post";
import Web from "../screens/Web";
import PostSwiper from "../screens/PostSwiper";
import Subreddit from "../screens/Subreddit";
import SubmissionSearchResults from "../screens/SubmissionSearchResults";
import LoadPost from "../screens/LoadPost";
import Settings from "../screens/Settings";
import RedditVideo from "../screens/RedditVideo";
import UserPage from "../screens/UserPage";
import { enableScreens } from "react-native-screens";
import { OS } from "../constants/constants";

enableScreens();
const Stack = createNativeStackNavigator();

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
            contentStyle: { backgroundColor: "black" },
            stackAnimation:
              route.name == "RedditVideo" ? "fade" : "slide_from_right",
          })}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="PostSwiper" component={PostSwiper} />
          <Stack.Screen name="Post" component={Post} />
          <Stack.Screen name="Web" component={Web} />
          <Stack.Screen name="LoadPost" component={LoadPost} />
          <Stack.Screen name="Subreddit" component={Subreddit} />
          <Stack.Screen name="RedditVideo" component={RedditVideo} />
          <Stack.Screen
            name="SearchResults"
            component={SubmissionSearchResults}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="UserPage" component={UserPage} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default MainNavigator;
