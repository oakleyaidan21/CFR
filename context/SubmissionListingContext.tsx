import { createContext } from "react";
import { Listing, Subreddit } from "snoowrap";

interface SubmissionListingContextInterface {
  listing: null | Listing<any>;
  setListing: any;
  getPosts: any;
  category: string;
  setCategory: any;
  timeframe: string;
  setTimeframe: any;
  subreddit: string | Subreddit;
  setSubreddit: any;
}

const SubmissionListingContext = createContext<SubmissionListingContextInterface>(
  {
    listing: null,
    setListing: null,
    getPosts: null,
    category: "Hot",
    setCategory: null,
    timeframe: "Hour",
    setTimeframe: null,
    subreddit: "Front Page",
    setSubreddit: null,
  },
);

export default SubmissionListingContext;
