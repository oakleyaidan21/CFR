import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

import { Subreddit } from "snoowrap";
import SnooContext from "../context/SnooContext";
import Fade from "./animations/Fade";

type Props = {
  sub: Subreddit | string;
  close: any;
  onSearch: any;
};

const SubSearchBar: React.FC<Props> = (props) => {
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const { sub } = props;
  const [showContent, setShowContent] = useState(false);
  const [query, setQuery] = useState("");
  const { snoowrap } = useContext(SnooContext);

  const expand = useCallback((value, callback) => {
    Animated.timing(expandAnimation, {
      toValue: value,
      duration: 150,
      useNativeDriver: false,
    }).start((e) => {
      if (e.finished) {
        callback();
      }
    });
  }, []);

  useEffect(() => {
    expand(1, () => setShowContent(true));
  }, []);

  const close = useCallback(() => {
    setShowContent(false);
    expand(0, props.close);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[s.container, { transform: [{ scaleX: expandAnimation }] }]}>
        {showContent && (
          <Fade
            show={showContent}
            style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <TextInput
              style={{ flex: 1, color: "white" }}
              placeholder={
                "Search posts in " +
                (typeof sub == "string" ? sub : sub.display_name_prefixed)
              }
              placeholderTextColor={"rgb(200,200,200)"}
              onChangeText={setQuery}
              onSubmitEditing={() => props.onSearch(sub, query)}
            />
            <TouchableOpacity
              onPress={close}
              style={{
                width: 40,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Icon name="close" color="grey" />
            </TouchableOpacity>
          </Fade>
        )}
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 3,
    borderColor: "grey",
    height: 40,
    paddingLeft: 10,
  },
});

export default SubSearchBar;
