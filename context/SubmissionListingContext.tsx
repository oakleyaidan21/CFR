import { createContext } from "react";
import { Listing } from "snoowrap";

interface SubmissionListingContextInterface {
  listing: null | Listing<any>;
  setListing: any;
}

const SubmissionListingContext = createContext<SubmissionListingContextInterface>(
  {
    listing: null,
    setListing: null,
  },
);

export default SubmissionListingContext;
