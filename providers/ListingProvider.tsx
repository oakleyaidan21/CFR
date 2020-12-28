import React, { useContext, useEffect, useState } from "react";
import { Listing, Submission, Subreddit } from "snoowrap";
import SnooContext from "../context/SnooContext";
import SubmissionListingContext from "../context/SubmissionListingContext";
import { getGeneralPosts } from "../util/snoowrap/snoowrapFunctions";

type Props = {
  initialSubreddit: string;
  initialCategory: string;
  initialTimeframe: string;
  listing?: Listing<Submission>;
};

const SubmissionListingProvider: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);
  const [listing, setListing] = useState<Listing<Submission> | null>(
    props.listing ? props.listing : null,
  );
  const [category, setCategory] = useState<string>(props.initialCategory);
  const [timeframe, setTimeframe] = useState<string>(props.initialTimeframe);
  const [subreddit, setSubreddit] = useState<string | Subreddit>(
    props.initialSubreddit,
  );

  useEffect(() => {
    if (!props.listing) {
      setListing(null);
      getPosts();
    }
  }, [subreddit, category, timeframe]);

  const getPosts = () => {
    return getGeneralPosts(snoowrap, subreddit, category, timeframe)
      .then((posts: any) => {
        console.log("got posts!", posts.length);
        setListing(posts);
        return true;
      })
      .catch((error) => {
        return false;
      });
  };

  return (
    <SubmissionListingContext.Provider
      value={{
        listing: listing,
        setListing: setListing,
        getPosts: getPosts,
        timeframe: timeframe,
        setTimeframe: setTimeframe,
        category: category,
        setCategory: setCategory,
        subreddit: subreddit,
        setSubreddit: setSubreddit,
      }}>
      {props.children}
    </SubmissionListingContext.Provider>
  );
};

export default SubmissionListingProvider;
