import { Alert } from "react-native";
import snoowrap, { Listing, RedditUser, Submission, Subreddit } from "snoowrap";
import snoowrapConfig from "./snoowrapConfig";

export const handleTokenChange = async (
  authCode: string,
  refreshToken: string,
  dispatch: any,
  existingUsers: any,
) => {
  // logging in an existing user
  if (refreshToken) {
    const snoowrap = tempinitializeUserSnoowrap(refreshToken);
    const user = snoowrap.getMe();
    try {
      const results = await Promise.all([
        snoowrap.getMe(),
        snoowrap.getUnreadMessages(),
        snoowrap.getSubscriptions(),
      ]);
      return {
        snoowrap: snoowrap,
        user: results[0],
        unreadMessages: results[1],
        subs: results[2],
      };
    } catch (error) {
      console.log("error initializing user snoowrap:", error);
    }
    // logging in default snoowrap
  } else if (!authCode) {
    const snoowrap = initializeDefaultSnoowrap();
    return { snoowrap: snoowrap, user: null, unreadMessages: [], subs: [] };
  }
  // logging in a new user with an auth code
  try {
    const snoowrap = await initializeSnoowrap(authCode);
    if (!snoowrap) {
      Alert.alert("Error logging in, please try again.");
      dispatch({ type: "SET_AUTH_CODE", code: null });
      return {
        snoowrap: initializeDefaultSnoowrap(),
        user: null,
        unreadMessages: [],
        subs: [],
      };
    }
    let newUsers = existingUsers;
    const results = await Promise.all([
      snoowrap.getMe(),
      snoowrap.getUnreadMessages(),
      snoowrap.getSubscriptions(),
    ]);
    const user = results[0];
    newUsers[user.name] = snoowrap.refreshToken;
    dispatch({ type: "SET_USERS", users: newUsers });
    dispatch({
      type: "SET_REFRESH_TOKEN",
      refreshToken: snoowrap.refreshToken,
    });
    return {
      snoowrap: snoowrap,
      user: user,
      unreadMessages: results[1],
      subs: results[2],
    };
  } catch (e) {
    console.log("error creating snoowrap from auth code:", e);
  }
  return { snoowrap: null, user: null, unreadMessages: [], subs: [] };
};

export const initializeSnoowrap = async (authCode: string) => {
  let r = null;
  if (authCode !== "none") {
    console.log("authCode", authCode);
    try {
      r = await snoowrap.fromAuthCode({
        code: authCode,
        userAgent: snoowrapConfig.userAgent,
        clientId: snoowrapConfig.clientId,
        redirectUri: "https://localhost:8080",
      });
    } catch (error) {
      console.log("error initializing user snoowrap instance", error);
      return false;
    }
  } else {
    try {
      r = await snoowrap.fromApplicationOnlyAuth({
        userAgent: snoowrapConfig.userAgent,
        clientId: snoowrapConfig.clientId,
        deviceId: "",
      });
    } catch (error) {
      console.log("error initializing default snoowrap instance", error);
      return false;
    }
  }
  r._nextRequestTimestamp = -1;
  r.config({ proxies: false });
  return r;
};

export const initializeDefaultSnoowrap = () => {
  const auth = {
    clientId: snoowrapConfig.clientId,
    userAgent: snoowrapConfig.userAgent,
    clientSecret: snoowrapConfig.clientSecret,
    refreshToken: snoowrapConfig.refreshToken,
  };
  const r = new snoowrap(auth);
  r._nextRequestTimestamp = -1;
  r.config({ proxies: false });
  return r;
};

export const initializeUserSnoowrap = async (token: string) => {
  const auth = {
    clientId: snoowrapConfig.clientId,
    clientSecret: snoowrapConfig.clientSecret,
    refreshToken: token,
    userAgent: snoowrapConfig.userAgent,
  };
  let r = new snoowrap(auth);
  r._nextRequestTimestamp = -1;
  r.config({ proxies: false });
  return r;
};
export const tempinitializeUserSnoowrap = (token: string) => {
  const auth = {
    clientId: snoowrapConfig.clientId,
    clientSecret: snoowrapConfig.clientSecret,
    refreshToken: token,
    userAgent: snoowrapConfig.userAgent,
  };
  let r = new snoowrap(auth);
  r._nextRequestTimestamp = -1;
  r.config({ proxies: false });
  return r;
};

export const getGeneralPosts = async (
  snoowrap: snoowrap | undefined | null,
  subName: any,
  category: string,
  timeFrame: string,
) => {
  if (!snoowrap) return [];
  const name = subName.display_name ? subName.display_name : subName;
  if (name === "Saved") {
    /**
     * TO-DO: saved posts function
     */
    return getSaved(snoowrap);
  } else {
    switch (category) {
      case "Hot": {
        return getHot(snoowrap, name);
      }
      case "Top": {
        /**
         * TO-DO: top posts function
         */
        return getTop(snoowrap, name, timeFrame);
      }
      case "Cont.": {
        /**
         * TO-DO: cont. posts function
         */
        return getControversial(snoowrap, name, timeFrame);
      }
      case "New": {
        /**
         * TO-DO: new posts function
         */
        return getNew(snoowrap, name);
      }
      case "Rising": {
        return getRising(snoowrap, name);
      }
    }
  }
};

export const getControversial = async (
  snoowrap: snoowrap | undefined | null,
  subName: string,
  timeframe: any,
) => {
  if (!snoowrap) return [];
  switch (subName) {
    case "Front Page": {
      return snoowrap
        .getControversial("", { time: timeframe })
        .then((posts: Listing<Submission>) => {
          return posts;
        });
    }
    default: {
      return snoowrap
        .getControversial(subName, { time: timeframe })
        .then((posts: Listing<Submission>) => {
          return posts;
        });
    }
  }
};

export const getTop = async (
  snoowrap: snoowrap | undefined | null,
  subName: string,
  timeframe: any,
) => {
  if (!snoowrap) return [];
  switch (subName) {
    case "Front Page": {
      return snoowrap
        .getTop("", { time: timeframe })
        .then((posts: Listing<Submission>) => {
          return posts;
        });
    }
    default: {
      return snoowrap
        .getTop(subName, { time: timeframe })
        .then((posts: Listing<Submission>) => {
          return posts;
        });
    }
  }
};

export const getNew = async (
  snoowrap: snoowrap | undefined | null,
  subName: string,
) => {
  if (!snoowrap) return [];
  switch (subName) {
    case "Front Page": {
      return snoowrap.getNew().then((posts: Listing<Submission>) => {
        return posts;
      });
    }
    default: {
      return snoowrap.getNew(subName).then((posts: Listing<Submission>) => {
        return posts;
      });
    }
  }
};

export const getHot = async (
  snoowrap: snoowrap | undefined | null,
  subName: string,
) => {
  if (!snoowrap) return [];
  switch (subName) {
    case "Front Page": {
      return snoowrap
        .getHot()
        .then((posts: Listing<Submission>) => {
          return posts;
        })
        .catch((error: Error) => console.log("error getting posts", error));
    }
    default: {
      return snoowrap
        .getHot(subName)
        .then((posts: Listing<Submission>) => {
          return posts;
        })
        .catch((error: Error) => console.log("error getting posts", error));
    }
  }
};

export const getRising = async (
  snoowrap: snoowrap | undefined | null,
  subName: string,
) => {
  if (!snoowrap) return [];
  switch (subName) {
    case "Front Page": {
      return snoowrap
        .getRising()
        .then((posts: Listing<Submission>) => {
          return posts;
        })
        .catch((error: Error) => console.log("error getting posts", error));
    }
    default: {
      return snoowrap
        .getRising(subName)
        .then((posts: Listing<Submission>) => {
          return posts;
        })
        .catch((error: Error) => console.log("error getting posts", error));
    }
  }
};

export const getSaved = (snoowrap: snoowrap | undefined | null) => {
  if (!snoowrap) return [];
  return snoowrap.getMe().then((me) => {
    return me.getSavedContent().then((content) => {
      return content;
    });
  });
};

export const getUserData = (snoowrap: snoowrap | undefined | null) => {
  if (!snoowrap) return null;

  return snoowrap.getMe().then((me) => {
    return me;
  });
};

export const getPostById = (snoowrap: snoowrap, id: string) => {
  if (!snoowrap) return null;
  const post = snoowrap.getSubmission(id);
  return post;
};

export const searchFrontPage = async (
  snoowrap: snoowrap,
  query: string,
  subs: [Subreddit],
) => {
  const promises = subs.map((s) => {
    return snoowrap.search({
      query,
      time: "all",
      subreddit: s.display_name,
      sort: "relevance",
    });
  });

  return Promise.all(promises).then((posts) => {
    const p = [];
    posts.map((s) => {
      s.map((yee) => {
        p.push(yee);
      });
    });
    return p;
  });
};

export const searchPosts = async (
  snoowrap: snoowrap,
  subName: string,
  query: string,
) => {
  console.log(subName, query);
  return snoowrap
    .search({ query, time: "all", subreddit: subName, sort: "relevance" })
    .then((results) => {
      console.log(results.length);
      return results;
    })
    .catch((error) => {
      console.log("error getting posts", error);
      return [];
    });
};

export const searchForSubsNames = (snoowrap: snoowrap, query: string) => {
  return snoowrap
    .searchSubredditNames({ query })
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.log("error getting sub names", error);
      return [];
    });
};

export const searchForSubs = (snoowrap: snoowrap, query: string) => {
  return snoowrap
    .searchSubreddits({ query: query })
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.log("error getting searched subs", error);
      return [];
    });
};

export const getUserByName = (snoowrap: snoowrap, name: string) => {
  return snoowrap
    .getUser(name)
    .fetch()
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.log("error getting user", error);
      return null;
    });
};

export const getUsersPosts = (user: RedditUser) => {
  return user
    .getSubmissions()
    .then((submissions) => {
      return submissions;
    })
    .catch((error) => {
      console.log("error getting user's submissions", error);
      return null;
    });
};

export const getUsersComments = (user: RedditUser) => {
  return user
    .getComments()
    .then((comments) => {
      return comments;
    })
    .catch((error) => {
      console.log("error getting user's comments", error);
      return null;
    });
};

export const getUsersUpvotedContent = (user: RedditUser) => {
  return user
    .getUpvotedContent()
    .then((content) => {
      return content;
    })
    .catch((error) => {
      console.log("error getting user's upvoted content", error);
      return null;
    });
};

export const getUsersDownvotedContent = (user: RedditUser) => {
  return user
    .getDownvotedContent()
    .then((content) => {
      return content;
    })
    .catch((error) => {
      console.log("error getting user's downvoted content", error);
      return null;
    });
};

export const getUsersTrophies = (user: RedditUser) => {
  return user
    .getTrophies()
    .then((trophies) => {
      return trophies.trophies;
    })
    .catch((error) => {
      console.log("error getting user's trophies", error);
      return null;
    });
};

export const submitSelfPost = (
  snoowrap: snoowrap,
  subName: string,
  title: string,
  body: string,
  sendReplies: boolean,
) => {
  return snoowrap
    .submitSelfpost({
      subredditName: subName,
      title: title,
      text: body,
      sendReplies: sendReplies,
    })
    .then((post) => {
      return post;
    })
    .catch((error) => {
      console.log("error submitting self post", error);
      return null;
    });
};

export const sortSubs = (subs: Array<Subreddit>) => {
  subs.sort((a: Subreddit, b: Subreddit) =>
    a.display_name.localeCompare(b.display_name, undefined, {
      sensitivity: "base",
    }),
  );
};
