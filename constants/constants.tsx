import { Dimensions, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const DETAILED_POST_HEIGHT = 370;
export const DETAILED_POST_CONTENT_HEIGHT = 200;
export const HEADER_HEIGHT = 60 + getStatusBarHeight();
export const INBOX_ITEM_HEIGHT = 110;
export const POST_ITEM_HEIGHT = 160;
export const SUB_ITEM_HEIGHT = 100;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;
export const WINDOW_WIDTH = Dimensions.get("window").width;
export const TAB_CONTAINER_HEIGHT = Platform.OS === "android" ? 75 : 70;
export const CONTENT_AREA_HEIGHT = WINDOW_HEIGHT - HEADER_HEIGHT; // the area beneath the header
export const TAB_CONTENT_AREA_HEIGHT =
  WINDOW_HEIGHT - HEADER_HEIGHT - TAB_CONTAINER_HEIGHT; // the area between the tab bar and header bar
