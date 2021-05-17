# Clear for Reddit

Clear is an open-sourced, cross-platform mobile application for browsing reddit.

So far, Clear is mostly contained to mass browsing, but features will be added as time goes on.

<p float="left">
  <img src="https://github.com/oakleyaidan21/clearForReddit/blob/master/screenshots/Simulator%20Screen%20Shot%20-%20iPhone%2011%20-%202020-10-12%20at%2017.05.57.png?raw=true"  width="45%"/>      
  <img src="https://github.com/oakleyaidan21/clearForReddit/blob/master/screenshots/Simulator%20Screen%20Shot%20-%20iPhone%2011%20-%202020-10-12%20at%2017.06.19.png?raw=true" width="45%"/> 
</p>

<img src="https://github.com/oakleyaidan21/clearForReddit/blob/master/screenshots/Simulator%20Screen%20Shot%20-%20iPad%20Pro%20(9.7-inch)%20-%202020-10-12%20at%2017.16.47.png?raw=true"  />

## Setup

In order to run Clear yourself, you'll need to set it up like any other react-native application.

### Android

Simply run `npm install` in the root directory

### iOS

run `npm install` in the root directory, then run `pod install` in the `ios` directory

### Creating a Reddit Application

For communicating with the reddit API, you'll need to create an application in your reddit account's preferences. [Here's](https://redditclient.readthedocs.io/en/latest/oauth/) a link to doing so.

Once you have your apps userAgent, clientID, and refreshToken (helper [here](https://github.com/not-an-aardvark/reddit-oauth-helper) for retrieving that), put them each in a file within `util/snoowrap` titled `snoowrapConfig.tsx`. It should look like:

```ts
type Config = {
  userAgent: string;
  clientId: string;
  refreshToken: string;
};

const snoowrapConfig: Config = {
  userAgent: "USERAGENT", //a unique name for your app; you create this yourself
  clientId: "CLIENTID", //your clients id, found underneath the name of your application in your reddit account's app preferences
  refreshToken: "REFRESHTOKEN", //a refreshToken for creating a default account that unauthed users will use when they use the app without an account
};

export default snoowrapConfig;
```

### Accessing imgur API

In order to get images from imgur in an album, you'll need to register for imgur api credentials. You can get those
[here](https://api.imgur.com/oauth2/addclient). Select `Anynymous usage without user authorization`. Place your
client id and client secret in `util/imgur/` in a file called `imgurConfig.tsx`. It should look like this:

```ts
const imgurConfig: any = {
  clientID: "CLIENTID",
  clientSecret: "CLIENT SECRET",
};

export default imgurConfig;
```

### Playing YouTube natively on Android

You'll need a google API key in order to play youtube videos in the app on android. You can find out how to get one [here](https://developers.google.com/youtube/android/player/register). Once you have a key, place it in `util/youtube` in a file titled `youtubeConfig.tsx`. It should look like this:

```ts
export const apiKey = "AIzaSyB56c605jONMlWRn0OzTTvLy6_p00Hgro4";
```

## Current Features

- sign users in
  - view subreddits and their posts
    - sort posts
  - view All/Popular posts
  - add/remove subscribed subreddits
  - view sub sidebars
  - save posts
  - view own user comments
- search for posts or subs
- view user pages
- themeing (just light and dark)
- imgur and gfycat integration
- youtube integration
- tablet version
- can vote on posts

## TO-DO (that I currently have thought of)

- add ability to retrieve other sections of a user's page
- add better UI
- add comment/reply functionality
- add report functionality
- optimize post rendering
- add swiper functionality to tablet version
- add dynamic header to posts
- improve styling
- combine the two sorting types into one type
