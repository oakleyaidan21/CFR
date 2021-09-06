import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Icon } from "react-native-elements";
import CFRText from "./style/Text";
import Text from "./style/Text";
import VideoPlayer from "./VideoPlayer";

type Props = {
  url: String;
  red: boolean;
};

const GyfyPlayer: React.FC<Props> = (props) => {
  const { url, red } = props;

  const [gfyDetails, setGyfyDetails] = useState(null);
  const [errored, setErrored] = useState(false);

  const tokens = url.split("/");
  const gfyId = tokens[tokens.length - 1];

  useEffect(() => {
    getGfyInfo();
  }, []);

  const getGfyInfo = () => {
    setErrored(false);
    const apiUrl = red
      ? "https://api.redgifs.com/v1/gfycats/"
      : "https://api.gfycat.com/v1/gfycats/";
    fetch(apiUrl + gfyId, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        setErrored(true);
      })
      .then((json) => {
        if (json.errorMessage) {
          setErrored(true);
        }
        setGyfyDetails(json.gfyItem);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {errored ? (
        <TouchableOpacity
          onPress={getGfyInfo}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Icon name="close" color="grey" size={200} />
          <Text style={{ color: "grey", textAlign: "center" }}>
            An error occurred -- the gif might not exist anymore. Tap to retry
          </Text>
        </TouchableOpacity>
      ) : gfyDetails ? (
        <VideoPlayer
          source={gfyDetails.content_urls.mp4.url}
          navigation={props.navigation}
          hasControls={true}
          autoPlay={false}
          poster={""}
          title={"yeet"}
          canFullscreen={true}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <CFRText style={{ marginBottom: 10, fontWeight: "bold" }}>
            Getting gif...
          </CFRText>
          <ActivityIndicator color={"white"} size={"large"} />
        </View>
      )}
    </View>
  );
};

export default GyfyPlayer;
