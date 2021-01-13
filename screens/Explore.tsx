import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  LayoutAnimation,
  KeyboardAvoidingView,
  Platform,
  SectionList,
} from "react-native";
import { Icon } from "react-native-elements";
import { Listing, Subreddit } from "snoowrap";
import SearchSubsPlaceholder from "../components/placeholders/SearchSubsPlaceholder";
import Text from "../components/style/Text";
import SubredditItem from "../components/SubredditItem";
import { HEADER_HEIGHT } from "../constants/constants";
import SnooContext from "../context/SnooContext";
import { searchForSubs, searchPosts } from "../util/snoowrap/snoowrapFunctions";

type Props = {
  navigation: any;
};

const Explore: React.FC<Props> = (props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<Subreddit>>([]);
  const [popularSubs, setPopularSubs] = useState<Listing<Subreddit>>();
  const [newSubs, setNewSubs] = useState<Listing<Subreddit>>();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<TextInput>(null);

  const { snoowrap } = useContext(SnooContext);

  const sections = [
    {
      data: popularSubs,
      renderItem: ({ item }: any) => renderItem({ item: item }),
      keyExtractor: (item: Subreddit) => item.display_name + "Sl",
      title: "Popular Subs",
    },
    // newSubs && {
    //   data: newSubs,
    //   renderItem: ({ item }: any) => renderItem({ item: item }),
    //   keyExtractor: (item: Subreddit) => item.display_name + "SlN",
    //   title: "New Subs",
    // },
  ];

  const onValueChange = useCallback(
    (text) => {
      setQuery(text);
    },
    [query],
  );

  const onFocus = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchFocused(false);
  }, []);

  const searchSubs = useCallback(() => {
    searchRef.current?.blur();
    setResults([]);
    if (snoowrap) {
      setSearching(true);
      searchForSubs(snoowrap, query).then((r: any) => {
        setResults(r);
        setSearching(false);
      });
    }
  }, [query]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      //get popular subreddits
      getPopularSubs();
      getNewSubs();
    });
  }, []);

  const getPopularSubs = useCallback(() => {
    if (!popularSubs) {
      snoowrap?.getPopularSubreddits({ limit: 6 }).then((subs: any) => {
        setPopularSubs(subs.slice(1));
      });
    } else {
      // popularSubs.fetchMore({ amount: 5, append: true }).then((r) => {
      //   console.log("ARRRR:", r.length);
      // });
    }
  }, [popularSubs]);

  const getNewSubs = useCallback(() => {
    if (!newSubs) {
      snoowrap?.getNewSubreddits({ limit: 6 }).then((subs: any) => {
        setNewSubs(subs.slice(1));
      });
    } else {
      // popularSubs.fetchMore({ amount: 5, append: true }).then((r) => {
      //   console.log("ARRRR:", r.length);
      // });
    }
  }, [newSubs]);

  const renderHeader = useCallback(() => {
    return (
      <View style={s.headerContainer}>
        <View style={s.searchInput}>
          <Icon name="search" color="white" style={{ width: 50 }} />
          <TextInput
            ref={searchRef}
            onChangeText={onValueChange}
            placeholderTextColor={"rgb(200,200,200)"}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={"Search..."}
            style={{ color: "white", flex: 1 }}
            value={query}
            selectionColor={"#00af64"}
          />
          {results.length > 0 && (
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Icon name="close" color="white" onPress={() => setResults([])} />
            </View>
          )}
        </View>
      </View>
    );
  }, [query, results]);

  const renderItem = useCallback(
    (data) => (
      <SubredditItem
        data={data.item}
        onPress={() => {
          props.navigation.navigate("Subreddit", { data: data.item });
        }}
      />
    ),
    [results],
  );

  const renderFooter = useCallback(() => <View style={{ height: 50 }} />, []);

  const renderListEmpty = useCallback(() => {
    return (
      <View
        style={[
          s.searchTypeContainer,
          { marginBottom: searchFocused ? 0 : 50 },
        ]}>
        {!searching ? (
          <>
            <TouchableOpacity
              style={s.searchType}
              onPress={searchSubs}
              disabled={query.length === 0}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="class"
                  color={query.length == 0 ? "grey" : "white"}
                  style={{ marginRight: 10 }}
                  size={50}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    color: query.length == 0 ? "grey" : "white",
                  }}>
                  Subreddit
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: query.length == 0 ? "grey" : "white",
                }}>
                Search for subreddits by name or topic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.searchType}
              onPress={() =>
                props.navigation.navigate("SearchResults", {
                  query: query,
                  sub: "all",
                })
              }
              disabled={query.length === 0}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="group-work"
                  color={query.length == 0 ? "grey" : "white"}
                  style={{ marginRight: 10 }}
                  size={50}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    color: query.length == 0 ? "grey" : "white",
                  }}>
                  All Submissions
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: query.length == 0 ? "grey" : "white",
                }}>
                Search all of reddit
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <SearchSubsPlaceholder />
        )}
      </View>
    );
  }, [query, searching, searchFocused]);

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {searchFocused || searching ? (
        renderListEmpty()
      ) : results.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.display_name}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={<View style={{ marginTop: HEADER_HEIGHT }} />}
        />
      ) : popularSubs ? (
        <SectionList
          style={{ flex: 1 }}
          sections={sections as any}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={<View style={{ marginTop: HEADER_HEIGHT }} />}
          renderSectionHeader={renderSectionHeader}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color="white" />
        </View>
      )}

      <View style={{ position: "absolute", top: 0, width: "100%" }}>
        {renderHeader()}
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  searchInput: {
    height: 50,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 3,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchType: {
    flex: 1,
    margin: 10,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  searchTypeContainer: {
    width: "100%",
    flex: 1,
    marginTop: 70,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 5,
    height: HEADER_HEIGHT,
    justifyContent: "flex-end",
  },
});

export default Explore;
