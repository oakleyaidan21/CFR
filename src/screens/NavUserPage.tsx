import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import Snoowrap from "snoowrap";
import CFRText from "../components/style/Text";
import { getUserByName } from "../util/snoowrap/snoowrapFunctions";


type Props = {
    userName: string
    snoowrap: Snoowrap; 
}

const NavUserPage: React.FC<Props> = (props)  => {

    const {snoowrap, userName} = props; 
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
       getUserByName(snoowrap, userName).then((user) => {
           setUserInfo(user);
       }).catch((error) => {
           setUserInfo(0);
       })
    }, [])
    
    return userInfo == null ? <ActivityIndicator color="white"/> : userInfo == 0 ? <View style={{flex: 1, justifyContent:"center", alignItems: "center"}}><CFRText style={{color: "white"}}>Error getting user</CFRText></View>
}

export default NavUserPage;