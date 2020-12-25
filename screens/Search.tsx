import React, { useCallback, useContext, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { Subreddit } from "snoowrap";
import Text from "../components/style/Text";
import SubredditItem from "../components/SubredditItem";
import SnooContext from "../context/SnooContext";
import { searchForSubs } from "../util/snoowrap/snoowrapFunctions";

type Props = {
  navigation: any;
};

const Search: React.FC<Props> = (props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchingSubs, setSearchingSubs] = useState(false);
  const [searchingSubmissions, setSearchingSubmissions] = useState(false);

  const { snoowrap } = useContext(SnooContext);

  const onValueChange = useCallback(
    (text) => {
      setQuery(text);
    },
    [query],
  );

  const onFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    setSearchFocused(false);
  }, []);

  const searchSubs = useCallback(() => {
    if (snoowrap) {
      setSearchingSubs(true);
      searchForSubs(snoowrap, query).then((r: any) => {
        setResults(r);
        setSearchingSubs(false);
      });
    }
  }, [query]);

  const renderHeader = useCallback(() => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.8)",
          paddingVertical: 10,
        }}>
        <View style={s.searchInput}>
          <Icon name="search" color="white" />
          <TextInput
            onChangeText={onValueChange}
            placeholder={"Search..."}
            placeholderTextColor={"rgb(200,200,200)"}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{ color: "white", flex: 1 }}
            value={query}
          />
          {results.length > 0 && (
            <Icon
              name="close"
              color="white"
              onPress={() => {
                setResults([]);
                setQuery("");
              }}
            />
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
  }, [query, searchingSubs]);

  return (
    <View style={{ flex: 1 }}>
      {results.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={results}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={<View style={{ marginTop: 60 }} />}
        />
      ) : (
        renderListEmpty()
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
    backgroundColor: "grey",
    borderRadius: 3,
    paddingHorizontal: 10,
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
});

export default Search;
