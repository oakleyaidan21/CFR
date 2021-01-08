import React, { memo } from "react";
import { View } from "react-native";
import { Comment, PrivateMessage } from "snoowrap";
import { INBOX_ITEM_HEIGHT } from "../constants/constants";
import { getTimeSincePosted } from "../util/util";
import Text from "./style/Text";

type Props = {
  messageData: PrivateMessage | Comment;
  read?: boolean;
};

const InboxItem: React.FC<Props> = (props) => {
  const { messageData } = props;
  const sub = messageData.subreddit;

  return (
    <View
      style={{
        width: "100%",
        height: INBOX_ITEM_HEIGHT,
        backgroundColor: "rgb(30,30,30)",
        marginVertical: 5,
        justifyContent: "space-between",
        borderRadius: 3,
        padding: 5,
      }}>
      <Text
        style={{ fontWeight: !props.read ? "bold" : "normal" }}
        numberOfLines={1}>
        {sub
          ? messageData.author.name +
            " replied to your post in " +
            sub.display_name
          : messageData.author.name}
      </Text>
      <Text style={{ color: "grey", marginVertical: 10 }} numberOfLines={2}>
        {messageData.body}
      </Text>
      <Text style={{ color: "grey" }}>
        {getTimeSincePosted(messageData.created_utc)}
      </Text>
    </View>
  );
};

function itemsAreEqual(prevItem: Props, nextItem: Props) {
  return prevItem.messageData.id === nextItem.messageData.id;
}

export default memo(InboxItem, itemsAreEqual);
