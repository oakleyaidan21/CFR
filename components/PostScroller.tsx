import React, { useContext } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import SubmissionListingContext from "../context/SubmissionListingContext";
import PostListItem from "./PostListItem";
import Text from "./style/Text";

type Props = {
  header: any;
  scrollRef: any;
};

const PostScroller: React.FC<Props> = (props) => {
  const { listing } = useContext(SubmissionListingContext);

  const renderItem = (data: any) => {
    return <PostListItem data={data.item} />;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {listing ? (
        listing.length > 0 ? (
          <FlatList
            ref={props.scrollRef}
            style={{ flex: 1, width: "100%" }}
            renderItem={renderItem}
            data={listing}
            keyExtractor={(item) => item.id}
            getItemLayout={(data, index) => ({
              length: 120,
              offset: 120 * index,
              index,
            })}
          />
        ) : (
          <Text>No results!</Text>
        )
      ) : (
        <ActivityIndicator color="white" />
      )}
    </View>
  );
};

// use basic components
// use light components
// use should component update
// use react-native-fast-image
// use getItemLayout

export default PostScroller;
