import React, { useContext } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import Text from "../components/style/Text";
import SnooContext from "../context/SnooContext";

type Props = {
  navigation: any;
};

const Profile: React.FC = (props: any) => {
  const { user } = useContext(SnooContext);

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View
        style={{
          height: 70,
          backgroundColor: "rgba(0,0,0,0.8)",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}>
        <Text>{user ? user.name : "No user"}</Text>
        <Icon
          name="add"
          color="white"
          size={40}
          onPress={() => props.navigation.navigate("Login")}
        />
      </View>
    </View>
  );
};

export default Profile;
