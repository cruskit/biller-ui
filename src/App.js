import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import "./App.css";
import Authenticator from "./Authenticator";
import AuthenticationDetails from "./AuthenticationDetails";
import BillerEntry from "./BillerEntry";
import BillerDisplay from "./BillerDisplay";
import UserActions from "./UserActions";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseUrl: "api.bpaygroup.com.au",
      authDetails: null,
    };
  }

  handleAuthenticationSuccessful(authDetails) {
    console.log("Authentication successful, accessToken: " + authDetails.token.access_token);
    this.setState({ authDetails: authDetails });
  }

  handleBillerSelection(billerCodes) {
    console.log("Loading billers entered by user, billerCodes: " + billerCodes);
    this.loadBillers(billerCodes);
  }

  getRequestHeaders() {
    return {
      Authorization: "Bearer " + this.state.authDetails.token.access_token,
      Accept: "application/json",
    };
  }

  async loadBillers(billerCodes) {
    // Clear out any previous biller details that are being rendered
    this.setState({ billerCodes: billerCodes, billerDetails: null });

    console.log("Starting to load biller details, num to load: " + this.state);

    const billerDetails = [];

    for (let billerCode of billerCodes) {
      console.log("Loading biller details for: " + billerCode);

      const url = this.state.authDetails.baseUrl + "/bpay/v1/billerchanges/" + billerCode;
      const options = {
        method: "GET",
        headers: this.getRequestHeaders(),
      };
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const billerDetail = await response.json();
          console.log("Response biller Detail: " + JSON.stringify(billerDetail));
          billerDetails.push(billerDetail);
        } else {
          console.log("Failed to retrieve biller details, code " + response.status + ", error: " + response.statusText);
          throw new Error("Error response from auth, code: " + response.status + ", error: " + response.statusText);
        }
      } catch (error) {
        console.log("Failed biller retrieval attempt: " + error);
      }
    }

    this.setState({ billerCodes: billerCodes, billerDetails: billerDetails });
  }

  render() {
    return (
      <Container fluid>
        <h1>Biller Update Tool</h1>

        {!this.state.authDetails && (
          <Authenticator
            onAuthenticationSuccessful={(authDetails) => this.handleAuthenticationSuccessful(authDetails)}
          />
        )}

        {this.state.authDetails && (
          <AuthenticationDetails clientId={this.state.authDetails.clientId} baseUrl={this.state.authDetails.baseUrl} />
        )}

        {this.state.authDetails && (
          <BillerEntry onBillerEntry={(billerCodes) => this.handleBillerSelection(billerCodes)} />
        )}

        <br />

        {this.state.billerDetails && <UserActions />}

        {this.state.billerDetails && <BillerDisplay billerDetails={this.state.billerDetails} />}
      </Container>
    );
  }
}

export default App;
