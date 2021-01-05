import React, { useRef } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import TabBar from "../components/TabBar";
import Explore from "../screens/Explore";
import CreatePost from "../screens/CreatePost";
import Profile from "../screens/Profile";
import Inbox from "../screens/Inbox";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: "rgb(20,20,20)" }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="CreatePost" component={CreatePost} />
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
