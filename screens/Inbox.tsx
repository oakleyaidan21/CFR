import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, StyleSheet, View } from "react-native";
import SnooContext from "../context/SnooContext";
import Text from "../components/style/Text";
import InboxItem from "../components/InboxItem";
import { HEADER_HEIGHT, INBOX_ITEM_HEIGHT } from "../constants/constants";

const Inbox: React.FC = (props) => {
  const { unreadInbox, setUnreadInbox, snoowrap, user } = useContext(
    SnooContext,
  );

  const [showUnread, setShowUnread] = useState(true);
  const [unread, setUnread] = useState(unreadInbox);
  const [read, setRead] = useState([]);

  useEffect(() => {
    if (user) {
      snoowrap?.getInbox().then((r: any) => {
        setRead(r);
      });
    }
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={s.headerContainer}>
        <View style={s.inboxTypeContainer}>
          <TouchableOpacity onPress={() => setShowUnread(true)}>
            <Text
              style={{
                fontWeight: "bold",
                color: showUnread ? "green" : "white",
              }}>
              Unread
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowUnread(false)}>
            <Text
              style={{
                fontWeight: "bold",
                color: !showUnread ? "green" : "white",
              }}>
              Read
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [showUnread]);

  const renderItem = useCallback(
    ({ item, index }) => {
      return <InboxItem messageData={item} read={!showUnread} />;
    },
    [showUnread],
  );

  const getItemLayout = useCallback((data, index) => {
    return {
      length: INBOX_ITEM_HEIGHT + 10,
      offset: (INBOX_ITEM_HEIGHT + 10) * index,
      index,
    };
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}>
      {user ? (
        <>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 5 }}
            data={showUnread ? unread : read}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            ListHeaderComponent={<View style={{ marginTop: HEADER_HEIGHT }} />}
          />
          <View style={{ position: "absolute", top: 0, width: "100%" }}>
            {renderHeader()}
          </View>
        </>
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Text>No user</Text>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 5,
    height: HEADER_HEIGHT,
    justifyContent: "flex-end",
  },
  inboxTypeContainer: {
    width: "50%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    flexDirection: "row",
    alignSelf: "center",
  },
});

export default Inbox;
