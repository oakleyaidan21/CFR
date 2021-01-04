import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../components/style/Text";

const CreatePost: React.FC = (props) => {
  return (
    <View style={{ flex: 1, marginBottom: 50 }}>
      <View style={s.postType}>
        <Text style={s.postTypeText}>Self</Text>
      </View>
      <View style={s.postType}>
        <Text style={s.postTypeText}>Link</Text>
      </View>
      <View style={s.postType}>
        <Text style={s.postTypeText}>Image</Text>
      </View>
      <View style={s.postType}>
        <Text style={s.postTypeText}>Video</Text>
      </View>
      <View style={s.postType}>
        <Text style={s.postTypeText}>Poll</Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  postType: {
    flex: 1,
    margin: 10,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  postTypeText: {
    fontWeight: "bold",
    fontSize: 30,
    color: "white",
  },
});

export default CreatePost;
