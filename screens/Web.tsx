import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Linking,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StyleSheet,
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
  const loadAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0.5)).current;
  const webRef = useRef<WebView>(null);
  const [currUrl, setCurrUrl] = useState(props.route.params.url);
  const [progress, setProgress] = useState(0);

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

  const onLoadProgress = (e) => {
    setProgress(e.nativeEvent.progress);
  };

  useEffect(() => {
    Animated.timing(loadAnimation, {
      toValue: progress,
      duration: 200,
      useNativeDriver: true,
    }).start((e) => {
      if (e.finished) {
        if (progress === 1) {
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start((e2) => {
            if (e2.finished) {
              Animated.timing(opacityAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }
          });
        }
      }
    });
  }, [progress]);

  const interp = loadAnimation.interpolate({
    inputRange: [0.0, 1.0],
    outputRange: [0.0, width],
  });

  return (
    <View style={{ flex: 1 }}>
      {/* URL AND PROGRESS */}
      <View style={{ width: "100%", justifyContent: "center" }}>
        <Animated.View
          style={[
            s.loadingIndicator,
            {
              opacity: opacityAnimation,
              transform: [{ translateX: interp }],
            },
          ]}
        />
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 50 }}>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={props.navigation.goBack}>
            <Icon name="close" color="white" size={30} />
          </TouchableOpacity>
          <Text style={{ color: "grey" }} numberOfLines={1}>
            {currUrl}
          </Text>
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
        style={{ flex: 1 }}
        onNavigationStateChange={onNavigationStateChange}
        source={{ uri: props.route.params.url }}
        ref={webRef}
        onLoadProgress={onLoadProgress}
      />
    </View>
  );
};

const s = StyleSheet.create({
  loadingIndicator: {
    backgroundColor: "rgb(200,200,200)",
    height: 50,
    width: width,
    position: "absolute",
    bottom: 0,
    left: -width,
  },

  webFunctions: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default Web;
