# Clear for Reddit

Clear is an open-sourced, cross-platform mobile application for browsing reddit.

So far, Clear is mostly contained to mass browsing, but features will be added as time goes on.

<p float="left">
  <img src="https://raw.githubusercontent.com/oakleyaidan21/CFR/master/Screenshot_20210517-173247.png"  width="45%"/>      
  <img src="https://github.com/oakleyaidan21/CFR/blob/master/Screenshot_20210517-173307.png" width="45%"/> 
</p>

<img src="https://raw.githubusercontent.com/oakleyaidan21/CFR/master/Screenshot_20210517-173334.png"  />

(screenshots have large head and footer due to them being taken on the pixel 5, which has no bezel. The app detects if a bezel is present and changes the header and footer size accordingly)

## Setup

In order to run Clear yourself, you'll need to set it up like any other react-native application.

### Android

Simply run `npm install` in the root directory

### iOS

run `npm install` in the root directory, then run `pod install` in the `ios` directory

### Creating a Reddit Application

For communicating with the reddit API, you'll need to create an application in your reddit account's preferences. [Here's](https://redditclient.readthedocs.io/en/latest/oauth/) a link to doing so.

Once you have your app's userAgent, clientID, and refreshToken (helper [here](https://github.com/not-an-aardvark/reddit-oauth-helper) for retrieving that), put them in a file titled `.env` in the root of the project, like so:

```
SNOO_USER_AGENT=youruseragent
SNOO_CLIENT_ID=yourclientid
SNOO_CLIENT_SECRET=yourclientsecret
SNOO_REFRESH_TOKEN=yourrefreshtoken
```

### Accessing imgur API

In order to get images from imgur in an album, you'll need to register for imgur api credentials. You can get those
[here](https://api.imgur.com/oauth2/addclient). Select `Anynymous usage without user authorization`. Place your
client id and client secret in the `.env` file as well, like so:

```
IMGUR_CLIENT_ID=yourclientid
IMGUR_CLIENT_SECRET=yourclientsecret
```
