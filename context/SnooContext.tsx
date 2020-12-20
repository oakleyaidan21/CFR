import { createContext } from "react";
import Snoowrap from "snoowrap";

interface SnooContextInterface {
  snoowrap: null | Snoowrap;
  setSnoowrap: any;
  user: any;
  setUser: any;
}

const SnooContext = createContext<SnooContextInterface>({
  snoowrap: null,
  setSnoowrap: null,
  user: null,
  setUser: null,
});

export default SnooContext;
