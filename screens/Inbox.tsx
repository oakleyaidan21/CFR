import React, { useCallback, useContext, useEffect, useState } from "react";
import { SectionList, View } from "react-native";
import SnooContext from "../context/SnooContext";
import Text from "../components/style/Text";

const Inbox: React.FC = (props) => {
  const { unreadInbox, setUnreadInbox, snoowrap, user } = useContext(
    SnooContext,
  );

  const [unread, setUnread] = useState(unreadInbox);
  const [read, setRead] = useState([]);

  console.log(read);

  useEffect(() => {
    if (user) {
      snoowrap?.getInbox().then((r: any) => {
        setRead(r);
      });
    }
  }, []);

  const sections = [
    {
      data: unread,
      renderItem: ({ item }: any) => <Text>{item.author.name}</Text>,
      keyExtractor: (item: any) => item.id,
      title: "Unread Mesages",
    },
    {
      data: read,
      renderItem: ({ item }: any) => <Text>{item.author.name}</Text>,
      keyExtractor: (item: any) => item.id,
      title: "Read Mesages",
    },
  ];

  const renderSectionHeader = useCallback((info) => {
    return (
      <View style={{ paddingHorizontal: 10, paddingTop: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {info.section.title}
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}>
      {user ? (
        <SectionList
          style={{ flex: 1 }}
          sections={sections}
          renderSectionHeader={renderSectionHeader}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Text>No user</Text>
        </View>
      )}
    </View>
  );
};

export default Inbox;
