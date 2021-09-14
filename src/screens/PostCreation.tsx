import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
} from "react-native";
import StandardHeader from "../components/StandardHeader";
import { OS } from "../constants/constants";
import SnooContext from "../context/SnooContext";
import Text from "../components/style/Text";
import { submitSelfPost } from "../util/snoowrap/snoowrapFunctions";
import { sub } from "react-native-reanimated";
import { Subreddit } from "snoowrap";
import SubBubble from "../components/SubBubble";
import { Icon } from "react-native-elements";

type Props = {
  navigation: any;
  route: { params: { postType: string } };
};

const PostCreation: React.FC<Props> = (props) => {
  const { userSubs, snoowrap } = useContext(SnooContext);

  const { postType } = props.route.params;

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [subToSubmitTo, setSubToSubmitTo] = useState<Subreddit>();
  const [repliesEnabled, setRepliesEnabled] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [showSubs, setShowSubs] = useState<boolean>(false);

  const submit = () => {
    setSubmitting(true);
    if (snoowrap) {
      submitSelfPost(
        snoowrap,
        subToSubmitTo?.display_name,
        title,
        body,
        repliesEnabled,
      )
        .then((post) => {
          setSubmitting(false);
          if (post) {
            props.navigation.navigate("LoadPost", { id: post.name });
          } else {
            Alert.alert("Error submitting post");
          }
        })
        .catch((error) => {
          setSubmitting(false);
          Alert.alert("Error submitting post");
        });
    }
  };

  const renderSubBubble = useCallback(({ item, index }) => {
    return (
      <SubBubble
        sub={item}
        size={30}
        onPress={() => {
          setSubToSubmitTo(item);
          setShowSubs(false);
        }}
      />
    );
  }, []);

  const renderPostTypeControls = () => {
    switch (postType) {
      case "text":
        return (
          <TextInput
            multiline={true}
            onChangeText={setBody}
            style={s.paragraphInput}
            placeholder={"Post text"}
            placeholderTextColor={"grey"}
          />
        );
      case "link":
        return (
          <View style={{ flex: 1, width: "100%" }}>
            <TextInput
              onChangeText={setLink}
              style={s.linkTextInput}
              placeholder={"Link"}
              placeholderTextColor="grey"
            />
          </View>
        );
      default:
        return (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>impl</Text>
          </View>
        );
    }
  };

  const disableSubmitting =
    submitting ||
    title.length == 0 ||
    title.length > 300 ||
    subToSubmitTo == null;

  return (
    <KeyboardAvoidingView
      style={s.screenContainer}
      behavior={OS == "ios" ? "padding" : "height"}>
      <StandardHeader
        navigation={props.navigation}
        relative
        label={"Submit a " + postType + " post"}
      />
      <View style={s.contentContainer}>
        <View style={s.topBar}>
          {showSubs ? (
            <FlatList
              style={{ flex: 1 }}
              horizontal={true}
              data={userSubs}
              renderItem={renderSubBubble}
            />
          ) : (
            <>
              {!subToSubmitTo ? (
                <TouchableOpacity
                  style={s.initialSubTitle}
                  onPress={() => setShowSubs(true)}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Choose a subreddit
                  </Text>
                  <Icon name="more-horiz" color="white" />
                </TouchableOpacity>
              ) : (
                <SubBubble
                  sub={subToSubmitTo}
                  size={40}
                  row
                  onPress={() => setShowSubs(true)}
                />
              )}
              {/* ENABLE REPLIES */}
              <TouchableOpacity
                onPress={() => setRepliesEnabled(!repliesEnabled)}
                style={s.enableReplyButton}>
                <Text>Get inbox replies</Text>
                <View style={s.enableReplyBox}>
                  {repliesEnabled && <View style={s.enableReplyDot} />}
                </View>
              </TouchableOpacity>
            </>
          )}
          {/* SUB */}
        </View>
        <TextInput
          style={s.titleInput}
          onChangeText={setTitle}
          placeholder={"Title"}
          placeholderTextColor={"grey"}
        />
        {renderPostTypeControls()}
        <TouchableOpacity
          style={[
            s.submitButton,
            { backgroundColor: disableSubmitting ? "grey" : "#00af64" },
          ]}
          onPress={submit}
          disabled={disableSubmitting}>
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ fontWeight: "bold" }}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  screenContainer: { flex: 1 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  enableReplyButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  enableReplyBox: {
    borderRadius: 3,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: "white",
    width: 17,
    height: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  enableReplyDot: {
    width: 9,
    height: 9,
    backgroundColor: "#00af64",
    borderRadius: 6,
  },
  titleInput: {
    padding: 10,
    color: "white",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  linkTextInput: {
    padding: 10,
    color: "white",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  paragraphInput: {
    padding: 10,
    color: "white",
    width: "100%",
    flex: 1,
    alignItems: "flex-start",
    marginVertical: 10,
  },
  submitButton: {
    padding: 10,
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00af64",
    borderRadius: 3,
    marginBottom: 20,
    margin: 10,
  },
  initialSubTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PostCreation;
