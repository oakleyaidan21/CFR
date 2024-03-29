import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { WebView } from "react-native-webview";
import Snoowrap from "snoowrap";
import StandardHeader from "../components/StandardHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { SNOO_CLIENT_ID } from "react-native-dotenv";

interface Props {
  navigation: any;
  close: any;
}

const url = Snoowrap.getAuthUrl({
  clientId: SNOO_CLIENT_ID,
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
    <SafeAreaView style={s.container}>
      <StandardHeader
        navigation={props.navigation}
        relative
        safe
        label={"Reddit Login"}
      />
      <WebView
        source={{ uri: url }}
        style={s.webView}
        renderLoading={() => <ActivityIndicator color="red" />}
        incognito={true}
        onNavigationStateChange={(newNavState) => {
          if (newNavState.url.includes("https://localhost:8080")) {
            const start_i = newNavState.url.indexOf("code");
            const code = newNavState.url.slice(
              start_i + 5,
              newNavState.url.length - 2,
            );
            console.log(newNavState.url);
            dispatch({ type: "SET_REFRESH_TOKEN", refreshToken: null });
            dispatch({ type: "SET_AUTH_CODE", authCode: code });
            props.navigation.goBack();
          }
        }}
        renderError={() => <ActivityIndicator />}
      />
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  webView: {
    backgroundColor: "black",
  },
});

export default Login;
