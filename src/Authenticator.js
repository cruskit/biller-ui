import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class Authenticator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseUrl: "https://st-api.bpaygroup.com.au",
      clientId: "",
      clientSecret: "",
    };
  }

  async handleAuthenticate() {
    console.log("Handling authentication attempt");

    console.log("ClientId: " + this.state.clientId + ", clientSecret: " + this.state.clientSecret);

    const bearerToken = btoa(this.state.clientId + ":" + this.state.clientSecret);
    console.log("Bearer token: " + bearerToken);

    //    const url = "https://api.bpaygroup.com.au/oauth/token";
    const url = this.state.baseUrl + "/oauth/token";
    const options = {
      method: "POST",
      headers: {
        Authorization: "Basic " + bearerToken,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: this.state.clientSecret,
        grant_type: "client_credentials",
      }),
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const token = await response.json();
        console.log("Response: " + JSON.stringify(token));
        let authDetails = {
            clientId: this.state.clientId,
            baseUrl: this.state.baseUrl,
            token: token,
        }
        this.props.onAuthenticationSuccessful(authDetails);
      } else {
        console.log("Failed auth response: " + response);
        throw new Error("Error response from auth, code: " + response.status + ", error: " + response.statusText);
      }
    } catch (error) {
      console.log("Failed auth attempt: " + error);
    }
  }

  render() {
    return (
      <Container>
        <Form onSubmit={e => e.preventDefault()}>
          <Form.Group controlId="formClientId">
            <Form.Label>Client Id</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Client Id"
              value={this.state.clientId}
              onChange={(e) => this.setState({ clientId: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formClientSecret">
            <Form.Label>Client Secret</Form.Label>
            <Form.Control
              type="password"
              placeholder="Client Secret"
              value={this.state.clientSecret}
              onChange={(e) => this.setState({ clientSecret: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={() => this.handleAuthenticate()}>
            Authenticate
          </Button>
        </Form>
      </Container>
    );
  }
}

export default Authenticator;
