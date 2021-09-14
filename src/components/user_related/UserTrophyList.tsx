import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";
import { RedditUser, Trophy } from "snoowrap";
import { TAB_CONTAINER_HEIGHT } from "../../constants/constants";
import { getUsersTrophies } from "../../util/snoowrap/snoowrapFunctions";
import Text from "../style/Text";
import CFRTrophy from "../CFRTrophy";

type Props = {
  user: RedditUser;
  navigation: any;
};

const UserTrophyList: React.FC<Props> = (props) => {
  const { user } = props;
  const [trophies, setTrophies] = useState<Array<Trophy> | null>();

  useEffect(() => {
    setTrophies(null);
    getTrophies();
  }, [user.id]);

  const getTrophies = useCallback(() => {
    getUsersTrophies(user).then((results) => {
      setTrophies(results);
    });
  }, [user.id]);

  const renderListEmpty = () => {
    return (
      <View style={s.listEmptyContainer}>
        <Text style={s.listEmptyText}>No trophies</Text>
      </View>
    );
  };

  const renderItem = useCallback(({ item, index }) => {
    return <CFRTrophy trophyData={item} />;
  }, []);

  return trophies ? (
    <FlatList
      style={s.listContainer}
      contentContainerStyle={s.listContentContainer}
      data={trophies}
      keyExtractor={(item, index) => item.name}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={s.columnStyle}
      ListEmptyComponent={renderListEmpty}
    />
  ) : (
    <View style={s.placeholderContainer}>
      <ActivityIndicator color="white" size="large" />
    </View>
  );
};

const s = StyleSheet.create({
  listContainer: { flex: 1 },
  listContentContainer: { marginTop: 5, alignItems: "center" },
  listEmptyContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  listEmptyText: {
    fontWeight: "bold",
    color: "grey",
  },
  columnStyle: {
    justifyContent: "space-between",
    width: 300,
  },

  placeholderContainer: {
    flex: 1,
    marginBottom: TAB_CONTAINER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserTrophyList;
