import React, { useCallback, useContext, useEffect, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import SnooContext from "../context/SnooContext";
import Text from "../components/style/Text";
import InboxItem from "../components/InboxItem";
import { HEADER_HEIGHT } from "../constants/constants";

const Inbox: React.FC = (props) => {
  const { unreadInbox, setUnreadInbox, snoowrap, user } = useContext(
    SnooContext,
  );

  const [unread, setUnread] = useState(unreadInbox);
  const [read, setRead] = useState([]);

  useEffect(() => {
    if (user) {
      snoowrap?.getInbox().then((r: any) => {
        setRead(r);
      });
    }
  }, []);

  const sections = [
    {
      data: unread ? unread : [],
      renderItem: ({ item }: any) => <InboxItem messageData={item} />,
      keyExtractor: (item: any) => item.id,
      title: "Unread Messages",
    },
    {
      data: read,
      renderItem: ({ item }: any) => <InboxItem messageData={item} read />,
      keyExtractor: (item: any) => item.id,
      title: "Read Messages",
    },
  ];

  const renderSectionHeader = useCallback((info) => {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {info.section.title}
        </Text>
      </View>
    );
  }, []);

  const renderHeader = useCallback(() => {
    return <View style={s.headerContainer}></View>;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}>
      {user ? (
        <SectionList
          style={{ flex: 1 }}
          sections={sections}
          contentContainerStyle={{ padding: 10 }}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={<View style={{ marginTop: HEADER_HEIGHT }} />}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Text>No user</Text>
        </View>
      )}
      <View style={{ position: "absolute", top: 0, width: "100%" }}>
        {renderHeader()}
      </View>
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
});

export default Inbox;
