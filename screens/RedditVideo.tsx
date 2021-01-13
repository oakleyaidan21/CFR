import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StandardHeader from "../components/StandardHeader";
import VideoPlayer from "../components/VideoPlayer";
import Text from "../components/style/Text";
import FastImage from "react-native-fast-image";
import { Icon } from "react-native-elements";

type Props = {
  navigation: any;
  route: { params: { source: string; poster: string; title: string } };
};

const RedditVideo: React.FC<Props> = (props) => {
  const { params } = props.route;

  const renderHeaderContent = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}>
        <FastImage
          style={{
            width: 30,
            height: 30,
            borderRadius: 3,
            marginHorizontal: 10,
          }}
          source={{ uri: params.poster }}
        />
        <Text style={{ fontWeight: "bold", flex: 1 }} numberOfLines={1}>
          {params.title}
        </Text>
        <TouchableOpacity>
          <Icon name="share" color="white" />
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1, marginBottom: 30 }}>
      <StandardHeader
        navigation={props.navigation}
        relative={true}
        content={renderHeaderContent()}
      />
      <VideoPlayer
        source={params.source}
        poster={params.poster}
        navigation={props.navigation}
        hasControls={true}
        canFullscreen={false}
      />
    </View>
  );
};

export default RedditVideo;
