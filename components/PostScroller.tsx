import React, { useContext } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import SubmissionListingContext from "../context/SubmissionListingContext";
import SubmissionListingProvider from "../providers/ListingProvider";
import PostListItem from "./PostListItem";
import Text from "./style/Text";

type Props = {};

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
            style={{ flex: 1 }}
            renderItem={renderItem}
            data={listing}
            keyExtractor={(item) => item.id}
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
