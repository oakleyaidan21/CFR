import { useRef, useEffect } from "react";
import { RedditContent } from "snoowrap";

export function useDidUpdateEffect(fn: any, inputs: any) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

export const getTimeSincePosted = (utc: number) => {
  let milliseconds = Math.round(new Date().getTime()) - utc * 1000;
  let time = Math.floor(milliseconds / 60000); //starts in minutes
  let timeType = "m";
  if (time > 60) {
    //hours
    time = Math.floor(time / 60);
    timeType = "h";
    if (time > 24) {
      //days
      time = Math.floor(time / 24);
      timeType = "d";
      if (time > 7) {
        //weeks
        time = Math.floor(time / 7);
        timeType = "w";
        if (time > 4) {
          //months
          time = Math.floor(time / 4);
          timeType = "mo";
        }
        if (time > 12) {
          //years
          time = Math.floor(time / 12);
          timeType = "y";
        }
      }
    }
  }
  return time + "" + timeType;
};
