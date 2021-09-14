import { Dimensions, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const OS = Platform.OS;

export const DETAILED_POST_CONTENT_HEIGHT = 400;

export const STATUS_BAR_HEIGHT = getStatusBarHeight();
export const DETAILED_POST_HEIGHT = DETAILED_POST_CONTENT_HEIGHT + 170;
export const HEADER_HEIGHT = 60 + STATUS_BAR_HEIGHT;
export const INBOX_ITEM_HEIGHT = 110;
export const POST_ITEM_HEIGHT = 160;
export const SUB_ITEM_HEIGHT = 100;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;
export const WINDOW_WIDTH = Dimensions.get("window").width;
export const ANDROID_NAVBAR_HEIGHT = SCREEN_HEIGHT - WINDOW_HEIGHT;
export const TAB_CONTAINER_HEIGHT =
  OS == "android" ? (ANDROID_NAVBAR_HEIGHT > 70 ? 100 : 75) : 70;
export const CONTENT_AREA_HEIGHT = WINDOW_HEIGHT - HEADER_HEIGHT; // the area beneath the header
export const TAB_CONTENT_AREA_HEIGHT =
  WINDOW_HEIGHT - HEADER_HEIGHT - TAB_CONTAINER_HEIGHT; // the area between the tab bar and header bar
export const POST_INFO_CONTAINER_HEIGHT = 130;
export const POST_FOOTER_HEIGHT = 84;
export const POST_CONTENT_HEIGHT =
  CONTENT_AREA_HEIGHT -
  POST_INFO_CONTAINER_HEIGHT -
  POST_FOOTER_HEIGHT +
  (OS == "android" ? ANDROID_NAVBAR_HEIGHT : 0) -
  15;
