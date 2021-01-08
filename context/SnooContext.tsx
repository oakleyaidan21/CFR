import { createContext } from "react";
import Snoowrap, { Listing, RedditUser, Subreddit } from "snoowrap";

interface SnooContextInterface {
  snoowrap: null | Snoowrap;
  setSnoowrap: any;
  user: RedditUser | null;
  setUser: any;
  userSubs: Array<Subreddit>;
  setUserSubs: any;
  unreadInbox: Array<any>;
  setUnreadInbox: any;
}

const SnooContext = createContext<SnooContextInterface>({
  snoowrap: null,
  setSnoowrap: null,
  user: null,
  setUser: null,
  userSubs: [],
  setUserSubs: null,
  unreadInbox: [],
  setUnreadInbox: null,
});

export default SnooContext;
