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
import SubSidebar from "../screens/SubSidebar";
import PostCreation from "../screens/PostCreation";

enableScreens();
const Stack = createNativeStackNavigator();

export type MainStackParamList = {
  Tabs: undefined;
};

const routeAnimationHandler = (routeName: string) => {
  switch (routeName) {
    case "RedditVideo":
    case "SubSidebar":
    case "Login":
    case "Web":
    case "SelfPostCreation":
      return "fade";

    default:
      return "slide_from_right";
  }
};

const routeTransitionHandler = (routeName: string) => {
  switch (routeName) {
    default:
      return "push";
  }
};

const linking = {
  prefixes: [
    "https://reddit.com/",
    "reddit.com/",
    "http://reddit.com/",
    "www.reddit.com/",
    "https://www.reddit.com/",
  ],
  config: {
    screens: {
      LoadPost: {
        path: "r/:subreddit/comments/:id/:title",
        parse: {
          id: (id: string) => id,
          screenTitle: (subreddit: string) => subreddit,
        },
      },
    },
  },
};

const MainNavigator: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            contentStyle: { backgroundColor: "black" },
            stackAnimation: routeAnimationHandler(route.name),
            // stackPresentation: routeTransitionHandler(route.name),
          })}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="PostSwiper" component={PostSwiper} />
          <Stack.Screen name="Post" component={Post} />
          <Stack.Screen name="Web" component={Web} />
          <Stack.Screen name="LoadPost" component={LoadPost} />
          <Stack.Screen name="Subreddit" component={Subreddit} />
          <Stack.Screen name="SubSidebar" component={SubSidebar} />
          <Stack.Screen name="RedditVideo" component={RedditVideo} />
          <Stack.Screen
            name="SearchResults"
            component={SubmissionSearchResults}
          />
          <Stack.Screen name="PostCreation" component={PostCreation} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="UserPage" component={UserPage} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default MainNavigator;
