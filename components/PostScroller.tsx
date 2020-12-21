import React, { useContext } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";
import HomeHeader from "./HomeHeader";
import HomePlaceholder from "./placeholders/HomePlaceholder";
import PostListItem from "./PostListItem";
import Text from "./style/Text";

type Props = {
  header: any;
  scrollRef: any;
  currentSubreddit: string | Subreddit;
};

const PostScroller: React.FC<Props> = (props) => {
  const { listing } = useContext(SubmissionListingContext);

  const renderItem = (data: any) => {
    if (!listing) {
      return <HomePlaceholder />;
    }
    return <PostListItem data={data.item} />;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        ref={props.scrollRef}
        style={{ flex: 1, width: "100%" }}
        renderItem={renderItem}
        data={listing ? listing : [1]}
        keyExtractor={(item) => (listing ? item.id : item.toString())}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={props.header}
      />
    </View>
  );
};

// use basic components
// use light components

export default PostScroller;
