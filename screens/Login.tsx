import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { WebView } from "react-native-webview";
import Snoowrap from "snoowrap";
import snoowrapConfig from "../util/snoowrap/snoowrapConfig";
import { Icon } from "react-native-elements";

interface Props {
  navigation: any;
  close: any;
}

const url = Snoowrap.getAuthUrl({
  clientId: snoowrapConfig.clientId,
  scope: [
    "identity",
    "account",
    "flair",
    "edit",
    "history",
    "mysubreddits",
    "privatemessages",
    "read",
    "report",
    "save",
    "submit",
    "subscribe",
    "vote",
    "wikiread",
  ],
  redirectUri: "https://localhost:8080",
  permanent: true,
}).replace("https://www.", "https://i.");

const Login: React.FC<Props> = (props) => {
  /**
   * *********REDUX********
   */
  const dispatch = useDispatch();

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 10,
      }}>
      <View style={s.header}>
        <Icon
          name="arrow-back"
          color="white"
          onPress={props.navigation.goBack}
        />
      </View>
      <WebView
        source={{ uri: url }}
        style={{ backgroundColor: "black" }}
        renderLoading={() => <ActivityIndicator color="red" />}
        incognito={true}
        onNavigationStateChange={(newNavState) => {
          if (newNavState.url.includes("https://localhost:8080")) {
            const start_i = newNavState.url.indexOf("code");
            const code = newNavState.url.slice(start_i + 5);
            dispatch({ type: "SET_REFRESH_TOKEN", refreshToken: null });
            dispatch({ type: "SET_AUTH_CODE", authCode: code });
            props.navigation.goBack();
          }
        }}
        renderError={() => <ActivityIndicator />}
      />
    </View>
  );
};

const s = StyleSheet.create({
  header: {
    height: 70,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
  },
});

export default Login;
