

export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
// process.env.REACT_APP_CLIENT_ID;
export const clientId = "e204bacf8e4f4c3496f9a2ddd7664a7e"
// export const redirectUri = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_REDIRECT : "http://localhost:3000/callback/";
// process.env.REACT_APP_REDIRECT;
export const redirectUri = "http://localhost:3000/callback"
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];
