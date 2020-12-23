import React, { useRef } from "react";
import { View, Linking, TouchableOpacity } from "react-native";
import Text from "../components/style/Text";
import { WebView } from "react-native-webview";
import { Icon } from "react-native-elements";

type Props = {
  navigation: any;
  route: { params: { url: string } };
};

const Web: React.FC<Props> = (props) => {
  const webRef = useRef<WebView>(null);

  const goBack = () => {
    if (webRef.current) webRef.current.goBack();
  };

  const goForward = () => {
    if (webRef.current) webRef.current.goForward();
  };

  const refresh = () => {
    if (webRef.current) webRef.current.reload();
  };
  return (
    <View style={{ flex: 1 }}>
      {/* SEARCH FUNCTIONS */}
      <View
        style={{
          width: "100%",
          height: 70,
          backgroundColor: "black",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}>
        <TouchableOpacity onPress={props.navigation.goBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Icon name="arrow-back" color="white" onPress={goBack} />
        <Icon name="arrow-forward" color="white" onPress={goForward} />
        <Icon name="refresh" color="white" onPress={refresh} />
        <Icon
          name="link"
          color="white"
          onPress={() => Linking.openURL(props.route.params.url)}
        />
      </View>
      <WebView
        javaScriptCanOpenWindowsAutomatically={false}
        style={{ flex: 1 }}
        source={{ uri: props.route.params.url }}
        ref={webRef}
      />
    </View>
  );
};

export default Web;
