import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import "./App.css";
import Authenticator from "./Authenticator";
import AuthenticationDetails from "./AuthenticationDetails";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseUrl: "api.bpaygroup.com.au",
      authDetails: null,
      showAuthenticator: true,
      showAuthenticationDetails: false,
    };
  }

  handleAuthenticationSuccessful(authDetails) {
    console.log("Authentication successful, accessToken: " + authDetails.token.access_token);
    this.setState({
      authDetails: authDetails,
      showAuthenticator: false,
      showAuthenticationDetails: true,
    });
  }

  render() {
    return (
      <Container fluid>
        <h1>BPAY Biller Manager</h1>

        {this.state.showAuthenticator && (
          <Authenticator
            onAuthenticationSuccessful={(authDetails) => this.handleAuthenticationSuccessful(authDetails)}
          />
        )}

        {this.state.showAuthenticationDetails && (
          <AuthenticationDetails clientId={this.state.authDetails.clientId} baseUrl={this.state.authDetails.baseUrl} />
        )}
      </Container>
    );
  }
}

export default App;
