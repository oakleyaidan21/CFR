import { createContext } from "react";
import Snoowrap, {
  Comment,
  Listing,
  PrivateMessage,
  RedditUser,
  Subreddit,
} from "snoowrap";

interface SnooContextInterface {
  snoowrap: null | Snoowrap;
  setSnoowrap: any;
  user: RedditUser | null;
  setUser: any;
  userSubs: Array<Subreddit>;
  setUserSubs: any;
  unreadInbox: Listing<PrivateMessage | Comment> | null;
  setUnreadInbox: any;
}

const SnooContext = createContext<SnooContextInterface>({
  snoowrap: null,
  setSnoowrap: null,
  user: null,
  setUser: null,
  userSubs: [],
  setUserSubs: null,
  unreadInbox: null,
  setUnreadInbox: null,
});

export default SnooContext;
