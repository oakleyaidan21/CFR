import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import StandardHeader from "../components/StandardHeader";
import Text from "../components/style/Text";

type Props = {
  navigation: any;
};

const Settings: React.FC<Props> = (props) => {
  const { postItemView } = useSelector((state: any) => state);

  const dispatch = useDispatch();

  const changePostItemView = useCallback(() => {
    dispatch({
      type: "SET_POST_ITEM_VIEW",
      postItemView: postItemView === "simple" ? "content" : "simple",
    });
  }, [postItemView]);

  return (
    <View style={{ flex: 1 }}>
      <StandardHeader navigation={props.navigation} relative={true} />
      <View style={{ flex: 1, padding: 10 }}>
        <TouchableOpacity onPress={changePostItemView}>
          <Text>Post item appearance: {postItemView}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
