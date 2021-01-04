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
import { searchPosts } from "../util/snoowrap/snoowrapFunctions";
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
  const [searching, setSearching] = useState(false);
  const { snoowrap } = useContext(SnooContext);

  const expand = useCallback((value, callback) => {
    Animated.timing(expandAnimation, {
      toValue: value,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.elastic(0.9),
    }).start((e) => {
      if (e.finished) {
        callback();
      }
    });
  }, []);

  useEffect(() => {
    expand(1, () => setShowContent(true));
  }, []);

  const searchForPosts = useCallback(() => {
    setSearching(true);
    if (snoowrap) {
      searchPosts(
        snoowrap,
        typeof sub === "string" ? sub : sub.display_name,
        query,
      ).then((r) => {
        setSearching(false);
        props.onSearch(r, query);
      });
    }
  }, [query, sub]);

  const close = useCallback(() => {
    setShowContent(false);
    expand(0, props.close);
  }, []);

  return (
    <Animated.View
      style={[s.container, { transform: [{ scaleX: expandAnimation }] }]}>
      {showContent && (
        <Fade
          show={showContent}
          style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",

              width: 50,
            }}>
            {searching ? (
              <ActivityIndicator color="grey" />
            ) : (
              <Icon name="search" color="grey" />
            )}
          </View>
          <TextInput
            style={{ flex: 1, color: "white" }}
            placeholder={
              "Search posts in " +
              (typeof sub == "string" ? sub : sub.display_name_prefixed)
            }
            placeholderTextColor={"rgb(200,200,200)"}
            onChangeText={setQuery}
            onSubmitEditing={searchForPosts}
          />
          <TouchableOpacity onPress={close}>
            <Icon name="close" color="grey" style={{ width: 50 }} />
          </TouchableOpacity>
        </Fade>
      )}
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 3,
    borderColor: "grey",
    height: 50,
  },
});

export default SubSearchBar;
