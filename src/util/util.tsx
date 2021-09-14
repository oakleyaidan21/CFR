import { useRef, useEffect } from "react";
import { RedditContent, Submission } from "snoowrap";

export const postRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)$/;

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
  const toReturn = time + "" + timeType;
  return toReturn == "0m" ? "Just now" : toReturn;
};

export const getUriImage = (uri: string) => {
  return uri !== null &&
    uri !== undefined &&
    uri.includes("/") &&
    uri.includes(".")
    ? uri
    : "";
};

export const determinePostType = (data: Submission) => {
  if (data.is_self) {
    return { code: "SLF" };
  }
  if (data.crosspost_parent_list) {
    return { code: "XPT", xpst: data.crosspost_parent_list[0] };
  }
  if (!data.url) return { code: "IDK" };
  const matches = data.url.match(postRegex);
  if (!matches) {
    return { code: "IDK" };
  }
  const isGallery = data.is_gallery;
  const isImgur = data.domain == "imgur.com";
  const isImgurGallery = isImgur
    ? matches[4]
      ? matches[4].substring(0, 3) == "/a/"
      : false
    : false;

  const threeExt = matches[4]
    ? matches[4].substring(matches[4].length - 4, matches[4].length)
    : false;
  const fourExt = matches[4]
    ? matches[4].substring(matches[4].length - 5, matches[4].length)
    : false;

  if (data.domain == "redgifs.com") {
    return { code: "RED" };
  }

  if (data.domain == "gfycat.com") {
    return { code: "GFY" };
  }
  if (
    threeExt == ".jpg" ||
    threeExt == ".png" ||
    threeExt == ".jpeg" ||
    threeExt == ".webp"
  ) {
    return { code: "IMG" };
  }

  if (threeExt == ".gif") {
    return { code: "GIF" };
  }

  if (fourExt == ".gifv" || data.is_video) {
    return { code: "VID", fourExt: fourExt };
  }

  if (isGallery) {
    return { code: "GAL" };
  }

  if (isImgurGallery) {
    return { code: "IGL", hash: matches[4] ? matches[4].substring(3) : "" };
  }

  return { code: "WEB" };
};

export const parseLink = (url: string) => {
  const tokens = url.split("/");
  let id = null;
  if (tokens.length < 3) {
    return { type: "web" };
  }
  switch (tokens[2]) {
    case "redd.it":
      id = tokens[3];
      break;
    case "www.reddit.com":
      id = tokens[6];
      break;
    case "old.reddit.com":
      id = tokens[6];
    default:
      break;
  }
  if (id) {
    return { type: "post", id: id };
  } else {
    if (tokens[1] == "r") {
      return { type: "sub", sub: tokens[2] };
    }
  }
  return { type: "web" };
};
