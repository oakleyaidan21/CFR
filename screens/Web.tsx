import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Linking,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Text from "../components/style/Text";
import { WebView } from "react-native-webview";
import { Icon } from "react-native-elements";

type Props = {
  navigation: any;
  route: { params: { url: string } };
};

const width = Dimensions.get("window").width;

const Web: React.FC<Props> = (props) => {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [currUrl, setCurrUrl] = useState(props.route.params.url);

  const onNavigationStateChange = useCallback((navState) => {
    if (currUrl !== navState.url) {
      setCurrUrl(navState.url);
    }
  }, []);

  const goBack = () => {
    if (webRef.current) webRef.current.goBack();
  };

  const goForward = () => {
    if (webRef.current) webRef.current.goForward();
  };

  const refresh = () => {
    if (webRef.current) webRef.current.reload();
  };

  const onLoadEnd = () => setLoading(false);
  const onLoadStart = () => setLoading(true);

  return (
    <View style={{ flex: 1 }}>
      {/* URL AND PROGRESS */}
      <View style={{ width: "100%", justifyContent: "center" }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 50 }}>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={props.navigation.goBack}>
            <Icon name="close" color="white" size={30} />
          </TouchableOpacity>
          <Text style={{ color: "grey", flex: 1 }} numberOfLines={1}>
            {currUrl}
          </Text>
          <View style={{ width: 50 }}>
            {loading && <ActivityIndicator color="grey" />}
          </View>
        </View>
      </View>
      {/* WEB FUNCTIONS */}
      <View style={s.webFunctions}>
        <Icon name="arrow-back" color="white" onPress={goBack} size={30} />
        <Icon
          name="arrow-forward"
          color="white"
          onPress={goForward}
          size={30}
        />
        <Icon name="refresh" color="white" onPress={refresh} size={30} />
        <Icon
          name="link"
          color="white"
          onPress={() => Linking.openURL(props.route.params.url)}
          size={30}
        />
      </View>

      <WebView
        javaScriptCanOpenWindowsAutomatically={false}
        style={{ flex: 1, opacity: 0.99 }} // Opacity set to 0.99 to fix completely random bug: https://github.com/react-native-webview/react-native-webview/issues/811
        onNavigationStateChange={onNavigationStateChange}
        source={{ uri: props.route.params.url }}
        ref={webRef}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
      />
    </View>
  );
};

const s = StyleSheet.create({
  webFunctions: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default Web;
