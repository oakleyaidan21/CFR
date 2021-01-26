import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { RedditUser } from "snoowrap";
import { WINDOW_WIDTH } from "../../constants/constants";
import UserPostList from "./UserPostList";
import UserCommentList from "./UserCommentList";
import UserUpvotedList from "./UserUpvotedList";
import UserDownvotedList from "./UserDownvotedList";
import UserTrophyList from "./UserTrophyList";

const routes = [
  { key: "posts", title: "Posts" },
  { key: "comments", title: "Comments" },
  { key: "upvoted", title: "Upvoted" },
  { key: "downvoted", title: "Downvoted" },
  { key: "trophies", title: "Trophies" },
  { key: "hidden", title: "Hidden" },
];

const initialLayout = { width: WINDOW_WIDTH };

type Props = {
  user: RedditUser;
  navigation: any;
};

const UserTabs: React.FC<Props> = (props) => {
  const { user } = props;
  const [index, setIndex] = useState<number>(0);

  const PostRoute = useCallback(
    () => <UserPostList user={user} navigation={props.navigation} />,
    [user],
  );

  const CommentRoute = useCallback(
    () => <UserCommentList user={user} navigation={props.navigation} />,
    [user],
  );

  const UpvoteRoute = useCallback(
    () => <UserUpvotedList user={user} navigation={props.navigation} />,
    [user],
  );

  const DownvoteRoute = useCallback(
    () => <UserDownvotedList user={user} navigation={props.navigation} />,
    [user],
  );

  const TrophyRoute = useCallback(
    () => <UserTrophyList user={user} navigation={props.navigation} />,
    [user],
  );

  const HiddenRoute = useCallback(() => <View></View>, [user]);

  const renderScene = SceneMap({
    posts: PostRoute,
    comments: CommentRoute,
    upvoted: UpvoteRoute,
    downvoted: DownvoteRoute,
    trophies: TrophyRoute,
    hidden: HiddenRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled={true}
      tabStyle={{ width: 130 }}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "rgb(10,10,10)" }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        lazy
      />
    </View>
  );
};

export default UserTabs;
