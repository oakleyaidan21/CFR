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
  InteractionManager,
  LayoutAnimation,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { Listing, Subreddit } from "snoowrap";
import SearchSubsPlaceholder from "../components/placeholders/SearchSubsPlaceholder";
import Text from "../components/style/Text";
import SubredditItem from "../components/SubredditItem";
import {
  HEADER_HEIGHT,
  TAB_CONTAINER_HEIGHT,
  TAB_CONTENT_AREA_HEIGHT,
} from "../constants/constants";
import SnooContext from "../context/SnooContext";
import {
  getUserByName,
  searchForSubs,
} from "../util/snoowrap/snoowrapFunctions";

type Props = {
  navigation: any;
};

const Explore: React.FC<Props> = (props) => {
  const { userSubs } = useContext(SnooContext);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<Subreddit>>([]);
  const [popularSubs, setPopularSubs] = useState<Listing<Subreddit>>();
  const [newSubs, setNewSubs] = useState<Listing<Subreddit>>();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<TextInput>(null);

  const { snoowrap } = useContext(SnooContext);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      //get popular subreddits
      getPopularSubs();
      getNewSubs();
    });
  }, []);

  const sections = [
    {
      data: popularSubs,
      renderItem: ({ item }: any) => renderItem({ item: item }),
      keyExtractor: (item: Subreddit) => item.display_name + "Sl",
      title: "Popular Subs",
    },
    {
      data: userSubs,
      renderItem: ({ item }: any) => renderItem({ item: item }),
      keyExtractor: (item: Subreddit) => item.display_name + "Us",
      title: "Your Subs",
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

  const searchAllSubmissions = useCallback(() => {
    props.navigation.navigate("SearchResults", {
      query: query,
      sub: "all",
    });
  }, [query]);

  const searchUsers = useCallback(() => {
    if (snoowrap) {
      getUserByName(snoowrap, query)
        .then((user) => {
          props.navigation.navigate("UserPage", { userData: user });
        })
        .catch((error) => {
          console.log("error getting user:", error);
          Alert.alert("No user with name: " + query);
        });
    }
  }, [query]);

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

  const renderFooter = useCallback(
    () => <View style={{ height: TAB_CONTAINER_HEIGHT + 10 }} />,
    [],
  );

  const renderListEmpty = useCallback(() => {
    return (
      <KeyboardAvoidingView
        style={s.searchTypeContainer}
        behavior={Platform.OS == "ios" ? "padding" : "height"}>
        {!searching ? (
          <>
            <SearchType
              title="Subreddit"
              subtitle="Search for subreddits by name or topic"
              icon="class"
              onPress={searchSubs}
              enabled={query.length > 0}
            />
            <SearchType
              title="All Submissions"
              subtitle="Search all of Reddit"
              icon="group-work"
              onPress={searchAllSubmissions}
              enabled={query.length > 0}
            />
            <SearchType
              title="Users"
              subtitle="Enter a user's name"
              icon="account-box"
              onPress={searchUsers}
              enabled={query.length > 0}
            />
          </>
        ) : (
          <SearchSubsPlaceholder />
        )}
      </KeyboardAvoidingView>
    );
  }, [query, searching, searchFocused]);

  const renderSectionHeader = useCallback(({ section }) => {
    return (
      <View style={{ paddingHorizontal: 10, paddingTop: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {section.title}
        </Text>
      </View>
    );
  }, []);

  const renderSectionFooter = useCallback(
    ({ section }) => {
      return section.data.length > 0 ? null : (
        <View
          style={{
            width: "100%",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
            <Text style={{ fontWeight: "bold", color: "#00af64" }}>Log in</Text>
          </TouchableOpacity>
          <Text> to view your subs!</Text>
        </View>
      );
    },
    [userSubs],
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgb(20,20,20)" }}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}>
    >
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
          renderSectionFooter={renderSectionFooter}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={{ flex: 1, marginTop: HEADER_HEIGHT }}>
          <SearchSubsPlaceholder />
        </View>
      )}

      <View style={{ position: "absolute", top: 0, width: "100%" }}>
        {renderHeader()}
      </View>
    </View>
  );
};

const SearchType = (props: {
  title: string;
  subtitle: string;
  icon: string;
  onPress: any;
  enabled: boolean;
}) => {
  const { title, subtitle, icon, onPress, enabled } = props;
  return (
    <TouchableOpacity
      style={s.searchType}
      onPress={onPress}
      disabled={!enabled}>
      <View style={s.searchTypeTitleContainer}>
        <Icon
          name={icon}
          color={enabled ? "white" : "grey"}
          style={s.searchTypeIcon}
          size={50}
        />
        <Text
          style={{
            ...s.searchTypeTitleText,
            color: enabled ? "white" : "grey",
          }}>
          {title}
        </Text>
      </View>
      <Text
        style={{
          ...s.searchTypeSubtitleText,
          color: enabled ? "white" : "grey",
        }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
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
    marginTop: HEADER_HEIGHT,
    height: TAB_CONTENT_AREA_HEIGHT,
  },
  searchTypeTitleContainer: { flexDirection: "row", alignItems: "center" },
  searchTypeIcon: { marginRight: 10 },
  searchTypeTitleText: {
    fontWeight: "bold",
    fontSize: 30,
    color: "white",
  },
  searchTypeSubtitleText: {
    marginTop: 10,
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
