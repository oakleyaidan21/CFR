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
} from "react-native";
import { Icon } from "react-native-elements";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Subreddit } from "snoowrap";
import Text from "../components/style/Text";
import SubredditItem from "../components/SubredditItem";
import SnooContext from "../context/SnooContext";
import { searchForSubs, searchPosts } from "../util/snoowrap/snoowrapFunctions";

const headerHeight = 60 + getStatusBarHeight();

type Props = {
  navigation: any;
};

const Explore: React.FC<Props> = (props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<Subreddit>>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchingSubs, setSearchingSubs] = useState(false);
  const [searchingSubmissions, setSearchingSubmissions] = useState(false);

  const searchRef = useRef<TextInput>(null);

  const { snoowrap } = useContext(SnooContext);

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
      setSearchingSubs(true);
      searchForSubs(snoowrap, query).then((r: any) => {
        setResults(r);
        setSearchingSubs(false);
      });
    }
  }, [query]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      //get popular subreddits
      getPopularSubs();
    });
  }, []);

  const getPopularSubs = useCallback(() => {
    snoowrap?.getPopularSubreddits().then((subs) => {
      setResults(subs);
    });
  }, []);

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
      <View style={s.searchTypeContainer}>
        <TouchableOpacity
          style={s.searchType}
          onPress={searchSubs}
          disabled={query.length === 0 || searchingSubs}>
          {searchingSubs ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
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
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={s.searchType}
          onPress={() =>
            props.navigation.navigate("SearchResults", { query: query })
          }
          disabled={query.length === 0 || searchingSubmissions}>
          {searchingSubmissions ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
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
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [query, searchingSubs, searchingSubmissions]);

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}>
      {searchFocused ? (
        renderListEmpty()
      ) : results.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={results}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={<View style={{ marginTop: headerHeight }} />}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color="white" />
        </View>
      )}

      <View style={{ position: "absolute", top: 0, width: "100%" }}>
        {renderHeader()}
      </View>
    </View>
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
    marginBottom: 50,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 5,
    height: headerHeight,
    justifyContent: "flex-end",
  },
});

export default Explore;
