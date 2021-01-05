import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import Text from "../components/style/Text";
import SnooContext from "../context/SnooContext";
import User from "./User";

type Props = {
  navigation: any;
};

const Profile: React.FC<Props> = (props) => {
  const { user } = useContext(SnooContext);
  const { users } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navToLogin = useCallback(() => {
    setShowUserDropdown(false);
    props.navigation.navigate("Login");
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={s.paddingContainer}>
        <View style={s.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {user && (
              <FastImage
                source={{ uri: user?.icon_img }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              />
            )}
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setShowUserDropdown(!showUserDropdown)}>
              <Text style={{ fontWeight: "bold" }}>
                {user ? user.name : "No user"}
              </Text>
              <Icon name="arrow-drop-down" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [user, showUserDropdown]);

  const renderDropdown = useCallback(() => {
    return (
      <View style={s.dropdown}>
        {Object.entries(users).map((u: any) => {
          return u[0] === user?.name ? null : (
            <TouchableOpacity
              key={u[1]}
              onPress={() => switchUser(u[1])}
              style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{u[0]}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={navToLogin}>
          <Icon name="add-box" color="grey" style={{ marginRight: 10 }} />
          <Text style={{ color: "grey" }}>Add new user</Text>
        </TouchableOpacity>
      </View>
    );
  }, [showUserDropdown, user, users]);

  const switchUser = (token: string) => {
    setShowUserDropdown(false);
    dispatch({
      type: "SET_REFRESH_TOKEN",
      refreshToken: token,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      {renderHeader()}
      {/* USER INFO */}
      {user && <User userData={user} />}

      {/* USER DROPDOWN */}
      {showUserDropdown && renderDropdown()}
    </View>
  );
};

const s = StyleSheet.create({
  header: {
    height: 50,

    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  dropdown: {
    position: "absolute",
    top: 80,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    minWidth: 200,
    borderRadius: 3,
  },
  paddingContainer: {
    height: 100,
    backgroundColor: "rgba(0,0,0,.8)",
    justifyContent: "flex-end",
  },
});

export default Profile;
