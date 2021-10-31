import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import TabBar from "../components/TabBar";
import Explore from "../screens/Explore";
import CreatePost from "../screens/CreatePost";
import Profile from "../screens/Profile";
import Inbox from "../screens/Inbox";
import DeviceInfo from "react-native-device-info";
import TabletHome from "../screens/TabletHome";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: "black" }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={DeviceInfo.isTablet() ? TabletHome : Home}
      />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="CreatePost" component={CreatePost} />
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
