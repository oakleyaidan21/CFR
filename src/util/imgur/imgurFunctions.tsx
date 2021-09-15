import { IMGUR_CLIENT_ID } from "react-native-dotenv";

export const getAlbum = (hash: string): any => {
  let myHeaders = new Headers();
  const client = "Client-ID " + IMGUR_CLIENT_ID;
  myHeaders.append("Authorization", client);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const fetchString = "https://api.imgur.com/3/album/" + hash;
  return fetch(fetchString, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error", error));
};
