// import { PublicClientApplication } from "@azure/msal-browser";

// const MSAL_CONFIG = {
//     auth: {
//         clientId: "0954303b-dff1-4dd5-bd18-1bcb0623c6c4",
//         authority: "https://login.microsoftonline.com/marketingsys1.onmicrosoft.com",
//         redirectUri: "http://localhost:3000",
//     },
//     cache: {
//         cacheLocation: "localStorage",
//         storeAuthStateInCookie: false,
//     },
// };

// const LOGIN_REQUEST = {
//     scopes: ["openid", "offline_access"]
// };

// const TOKEN_REQUEST = {
//     scopes: ["User.ReadWrite.All"]
// };

// const GRAPH_CONFIG = {
//     graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users"
// };

// const PUBLIC_CLIENT_APPLICATION = new PublicClientApplication(MSAL_CONFIG);
// async function initializeMsal() {
//     await PUBLIC_CLIENT_APPLICATION.initialize();
// }
// initializeMsal();

// export {
//     MSAL_CONFIG,
//     LOGIN_REQUEST,
//     TOKEN_REQUEST,
//     GRAPH_CONFIG,
//     PUBLIC_CLIENT_APPLICATION
// };