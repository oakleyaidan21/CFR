import React, { useContext, useEffect, useState } from "react";
import { Listing, Submission } from "snoowrap";
import SnooContext from "../context/SnooContext";
import SubmissionListingContext from "../context/SubmissionListingContext";
import { getGeneralPosts } from "../util/snoowrap/snoowrapFunctions";

type Props = {
  subreddit: string;
  category: string;
  timeframe: string;
};

const SubmissionListingProvider: React.FC<Props> = (props) => {
  const { snoowrap } = useContext(SnooContext);
  const [listing, setListing] = useState<Listing<Submission> | null>(null);

  const { subreddit, category, timeframe } = props;

  useEffect(() => {
    // getGeneralPosts(snoowrap, subreddit, category, timeframe).then(
    //   (posts: any) => {
    //     console.log("got posts!", posts.length);
    //     setListing(posts);
    //   },
    // );
  }, [subreddit, category, timeframe]);

  return (
    <SubmissionListingContext.Provider
      value={{ listing: listing, setListing: setListing }}>
      {props.children}
    </SubmissionListingContext.Provider>
  );
};

export default SubmissionListingProvider;
