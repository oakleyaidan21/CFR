import React, { useCallback, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

type Props = {
  isVisible: boolean;
  close: any;
  setCategory: any;
  setTimeframe: any;
};

const categories = ["Hot", "New", "Top", "Cont."];
const times = ["hour", "day", "week", "month", "year", "all"];

const CategoryPicker: React.FC<Props> = (props) => {
  const [showTimes, setShowTimes] = useState<null | string>(null);

  const renderCategory = useCallback(
    (cat, index) => {
      return (
        <TouchableOpacity
          key={cat}
          disabled={showTimes !== null}
          style={s.categoryItem}
          onPress={() => {
            if (cat === "Top" || cat === "Cont.") {
              setShowTimes(cat);
            } else {
              setShowTimes(null);
              props.setCategory(cat);
              props.close();
            }
          }}>
          {showTimes && cat === showTimes ? (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}>
              {times.map((time) => {
                return (
                  <TouchableOpacity
                    key={time}
                    onPress={() => {
                      setShowTimes(null);
                      props.setCategory(cat);
                      props.setTimeframe(time);
                      props.close();
                    }}>
                    <Text style={{ color: "grey", fontWeight: "bold" }}>
                      {time[0].toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={{ color: "grey", fontWeight: "bold" }}>{cat}</Text>
          )}
        </TouchableOpacity>
      );
    },
    [showTimes],
  );

  return (
    <Modal visible={props.isVisible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowTimes(null);
          props.close();
        }}>
        <View style={{ width: "100%", height: "100%" }}>
          <TouchableWithoutFeedback>
            <View style={s.container}>{categories.map(renderCategory)}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 80,
    right: 10,
    width: 200,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 3,
  },
  categoryItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default CategoryPicker;
