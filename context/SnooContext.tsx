import { createContext } from "react";
import Snoowrap, { Subreddit } from "snoowrap";

interface SnooContextInterface {
  snoowrap: null | Snoowrap;
  setSnoowrap: any;
  user: any;
  setUser: any;
  userSubs: Array<Subreddit>;
  setUserSubs: any;
}

const SnooContext = createContext<SnooContextInterface>({
  snoowrap: null,
  setSnoowrap: null,
  user: null,
  setUser: null,
  userSubs: [],
  setUserSubs: null,
});

export default SnooContext;
