import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { RedditUser } from "snoowrap";
import { WINDOW_WIDTH } from "../constants/constants";
import UserPostList from "./UserPostList";
import UserCommentList from "./UserCommentList";

const routes = [
  { key: "posts", title: "Posts" },
  { key: "comments", title: "Comments" },
  { key: "awards", title: "Awards" },
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

  const AwardRoute = useCallback(() => <View style={{ flex: 1 }}></View>, [
    user,
  ]);

  const renderScene = SceneMap({
    posts: PostRoute,
    comments: CommentRoute,
    awards: AwardRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
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
