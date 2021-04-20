import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import "./App.css";
import Authenticator from "./Authenticator";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseUrl: "api.bpaygroup.com.au",
      authDetails: null,
    };
  }

  handleAuthenticationSuccessful(accessToken){
    console.log("Authentication successful, accessToken: " + accessToken);
    this.setState({accessToken: accessToken});
  }

  render() {
    return (
      <Container fluid>
        <h1>BPAY Biller Manager</h1>

        <Authenticator 
          onAuthenticationSuccessful={(accessToken) => this.handleAuthenticationSuccessful(accessToken)}/>
      </Container>
    );
  }
}

export default App;
