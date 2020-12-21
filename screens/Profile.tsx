import React from "react";
import { TouchableOpacity, View } from "react-native";
import Text from "../components/style/Text";

const Profile: React.FC = (props: any) => {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
