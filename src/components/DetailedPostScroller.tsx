import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Submission, Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";
import HomePlaceholder from "./placeholders/HomePlaceholder";
import DetailedPostListItem from "./DetailedPostListItem";
import Text from "./style/Text";
import PostScrollerFooter from "./PostScrollerFooter";
import { DETAILED_POST_HEIGHT } from "../constants/constants";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  header: any;
  currentSubreddit: string | Subreddit;
  onPress: any;
};

const DetailedPostScroller: React.FC<Props> = (props) => {
  const scrollRef = useRef<FlatList>(null);

  const { listing, setListing, getPosts, subreddit } = useContext(
    SubmissionListingContext,
  );

  const scrollerIsFocused = useIsFocused();

  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [flatlistHeight, setFlatlistHeight] = useState(0);
  const [viewableItems, setViewableItems] = useState<any>([]);

  const itemIsViewable = useCallback((items, index) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].index == index) {
        return true;
      }
    }
    return false;
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <DetailedPostListItem
          data={item}
          onPress={(index: number) => props.onPress(listing, index)}
          index={index}
          viewable={scrollerIsFocused && itemIsViewable(viewableItems, index)}
        />
      );
    },
    [listing, viewableItems, scrollerIsFocused],
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
      <View style={s.noResultsContainer}>
        <Text style={s.noResultsText}>No results...</Text>
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
      return {
        length: DETAILED_POST_HEIGHT + 10,
        offset: (DETAILED_POST_HEIGHT + 10) * index,
        index,
      };
    },
    [listing, flatlistHeight],
  );

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setViewableItems(viewableItems);
  }, []);

  return (
    <View style={s.container}>
      <FlatList
        ref={scrollRef}
        style={s.flatlist}
        renderItem={renderItem}
        data={listing}
        keyExtractor={(item, index) => item.id + index.toString()}
        // getItemLayout={getItemLayout}
        ListEmptyComponent={renderListEmtpy}
        onEndReached={onEndReached}
        windowSize={15}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
        }}
        removeClippedSubviews={true}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor={"white"}
            style={s.refreshControl}
            progressBackgroundColor={"black"}
            colors={["white", "#00af64"]}
          />
        }
        stickyHeaderIndices={[0]}
        initialNumToRender={5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  flatlist: { flex: 1, width: "100%" },
  refreshControl: { backgroundColor: "black" },
  noResultsContainer: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: { color: "grey", fontWeight: "bold" },
});

export default DetailedPostScroller;
