import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import HTMLView from "react-native-htmlview";
import SpoilerText from "./SpoilerText";

type Props = {
  data: string;
  onLinkPress: any;
};

const MDRenderer: React.FC<Props> = (props) => {
  const { data, onLinkPress } = props;

  const renderSpecificNodes = useCallback(
    (node, index, siblings, parent, defaultRenderer) => {
      if (node.attribs) {
        if (node.attribs.class) {
          if (node.attribs.class === "md-spoiler-text") {
            return (
              <View style={{ alignSelf: "center" }}>
                <SpoilerText node={node} />
              </View>
            );
          }
        }
      }

      return undefined;
    },
    [],
  );

  return (
    <HTMLView
      value={"<cfr>" + data + "<cfr>"}
      stylesheet={htmlstyles}
      renderNode={renderSpecificNodes}
      addLineBreaks={false}
      onLinkPress={onLinkPress}
    />
  );
};

const htmlstyles = StyleSheet.create({
  div: {
    color: "white",
  },
  cfr: {},
  blockquote: {
    paddingLeft: 10,
    fontStyle: "italic",
    marginLeft: 50,
    color: "grey",
  },
});

export default MDRenderer;
