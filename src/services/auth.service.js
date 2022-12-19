import * as Msal from "msal";

export default class AuthService {
  constructor() {
    let PROD_REDIRECT_URI = "http://localhost:8080"; //"https://sunilbandla.github.io/vue-msal-sample/"; //"https://stage-devopsworkflowgenerator.azurewebsites.net/";
    let redirectUri = window.location.origin;
    if (window.location.hostname !== "127.0.0.1") {
      redirectUri = PROD_REDIRECT_URI;
    }
    this.applicationConfig = {
      clientID: "0c9993fb-5e05-4782-9c57-751b8e06a4bd", //"9d86c8dc-bf7d-4573-bc3c-4df2f2c32b93", //"08d7f8a6-473b-4659-9b6f-5cf74fb0b3dc",
      graphScopes: ["user.read"]
    };
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      "",
      () => {
        // callback for login redirect
      },
      {
        redirectUri
      }
    );
  }
  login() {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  }
  logout() {
    this.app.logout();
  }
  getToken() {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      error => {
        return this.app.getUser
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              console.error(err);
            }
          );
      }
    );
  }
}
