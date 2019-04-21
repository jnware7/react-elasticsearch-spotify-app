

export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = process.env.REACT_APP_CLIENT_ID;
// export const redirectUri = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_REDIRECT : "http://localhost:3000/callback/";
export const redirectUri = process.env.REACT_APP_REDIRECT;
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];
