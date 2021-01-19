import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Subreddit } from "snoowrap";
import SubmissionListingContext from "../context/SubmissionListingContext";
import HomePlaceholder from "./placeholders/HomePlaceholder";
import PostListItem from "./PostListItem";
import Text from "./style/Text";
import PostScrollerFooter from "./PostScrollerFooter";
import {
  POST_ITEM_HEIGHT,
  TAB_CONTENT_AREA_HEIGHT,
} from "../constants/constants";
import { Icon } from "react-native-elements";

type Props = {
  header: any;
  currentSubreddit: string | Subreddit;
  onPress: any;
};

const PostScroller: React.FC<Props> = (props) => {
  const scrollRef = useRef<FlatList>(null);
  const { listing, setListing, getPosts, subreddit, failed } = useContext(
    SubmissionListingContext,
  );

  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [flatlistHeight, setFlatlistHeight] = useState(0);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <PostListItem
          data={item}
          onPress={(index: number) => props.onPress(listing, index)}
          index={index}
        />
      );
    },
    [listing],
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
        style={{
          height: TAB_CONTENT_AREA_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text style={{ color: "grey", fontWeight: "bold" }}>No results...</Text>
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
        length: POST_ITEM_HEIGHT + 10,
        offset: (POST_ITEM_HEIGHT + 10) * index,
        index,
      };
    },
    [listing, flatlistHeight],
  );

  return (
    <View style={s.container}>
      {failed ? (
        <TouchableOpacity onPress={getPosts}>
          <Text style={s.errorText}>An error occurred. Try again?</Text>
          <Icon name="refresh" color="grey" size={50} />
        </TouchableOpacity>
      ) : (
        <FlatList
          ref={scrollRef}
          style={s.list}
          // onScroll={onScroll}
          renderItem={renderItem}
          data={listing}
          keyExtractor={(item, index) => item.id + index.toString()}
          getItemLayout={getItemLayout}
          ListEmptyComponent={renderListEmtpy}
          onEndReached={onEndReached}
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
          initialNumToRender={10}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { flex: 1, width: "100%" },
  refreshControl: { backgroundColor: "black" },
  errorText: {
    fontWeight: "bold",
    color: "grey",
    marginBottom: 20,
    fontSize: 20,
  },
});

export default PostScroller;
