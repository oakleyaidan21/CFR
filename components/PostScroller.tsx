import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Submission, Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";
import HomePlaceholder from "./placeholders/HomePlaceholder";
import PostListItem from "./PostListItem";
import DetailedPostListItem from "./DetailedPostListItem";
import Text from "./style/Text";
import PostScrollerFooter from "./PostScrollerFooter";
import SnooContext from "../context/SnooContext";
import { useSelector } from "react-redux";
import { determinePostType } from "../util/util";
import { DETAILED_POST_HEIGHT } from "../constants/constants";

type Props = {
  header: any;
  currentSubreddit: string | Subreddit;
  onPress: any;
};

const PostScroller: React.FC<Props> = (props) => {
  const scrollRef = useRef<FlatList>(null);

  const { postItemView } = useSelector((state: any) => state);

  const { listing, setListing, getPosts, subreddit } = useContext(
    SubmissionListingContext,
  );

  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [flatlistHeight, setFlatlistHeight] = useState(0);

  const renderItem = useCallback(
    ({ item, index }) => {
      return postItemView == "simple" ? (
        <PostListItem
          data={item}
          onPress={(index: number) => props.onPress(listing, index)}
          index={index}
        />
      ) : (
        <DetailedPostListItem
          data={item}
          onPress={(index: number) => props.onPress(listing, index)}
          index={index}
        />
      );
    },
    [listing, postItemView],
  );

  const onScroll = (e: any) => {
    console.log(e.nativeEvent.contentOffset.y);
  };

  const renderHeader = useCallback(() => props.header, [subreddit]);

  const renderFooter = () => {
    return <PostScrollerFooter fetchingMore={fetchingMore} />;
  };

  const renderListEmtpy = useCallback(() => {
    return !listing ? (
      <HomePlaceholder />
    ) : (
      <View
        style={{ height: 500, justifyContent: "center", alignItems: "center" }}>
        <Text>No results...</Text>
      </View>
    );
  }, [listing]);

  useEffect(() => {
    // when listing changes, scroll to the top
    if (listing == null) {
      scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [listing]);

  const onEndReached = useCallback(() => {
    if (listing) {
      setFetchingMore(true);
      (listing as any)
        .fetchMore({ amount: 25, append: true })
        .then((result: any) => {
          setListing(result);
          setFetchingMore(false);
        });
    }
  }, [listing]);

  const refreshPosts = () => {
    setRefreshing(true);
    getPosts().then(() => setRefreshing(false));
  };

  const getItemLayout = useCallback(
    (data: any, index) => {
      if (postItemView == "simple") {
        return {
          length: 170,
          offset: 170 * index,
          index,
        };
      } else {
        // DOESNT WORK SINCE POST HEIGHTS CAN VARY
        const postType = determinePostType(data[index]);
        let l = 170;
        if (
          postType.code == "IMG" ||
          postType.code == "GIF" ||
          postType.code == "VID"
        ) {
          l = 170 + DETAILED_POST_HEIGHT + 10;
        }
        return {
          length: l,
          offset: l + flatlistHeight,
          index,
        };
      }
    },
    [postItemView, listing, flatlistHeight],
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        ref={scrollRef}
        style={{ flex: 1, width: "100%" }}
        // onScroll={onScroll}
        renderItem={renderItem}
        data={listing}
        keyExtractor={(item, index) => item.id + index.toString()}
        getItemLayout={postItemView == "simple" ? getItemLayout : undefined}
        ListEmptyComponent={renderListEmtpy}
        onEndReached={onEndReached}
        removeClippedSubviews={postItemView != "simple"}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor={"white"}
            style={{ backgroundColor: "black" }}
            progressBackgroundColor={"black"}
            colors={["white", "#00af64"]}
          />
        }
        stickyHeaderIndices={[0]}
        initialNumToRender={postItemView === "simple" ? 10 : 5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

// use basic components
// use light components

export default PostScroller;
