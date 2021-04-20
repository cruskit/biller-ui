import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class Authenticator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseUrl: "api.bpaygroup.com.au/oauth/token",
      clientId: "",
      clientSecret: "",
    };
  }

  handleAuthenticate() {
    console.log("Handling authentication attempt");

    console.log(
      "ClientId: " +
        this.state.clientId +
        ", clientSecret: " +
        this.state.clientSecret
    );

    const bearerToken = btoa(this.state.clientId + ":" + this.state.clientSecret);
    console.log("Bearer token: " + bearerToken);

    const url = "https://api.bpaygroup.com.au/oauth/token";
    const options = {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + bearerToken,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: this.state.clientSecret,
        grant_type: "client_credentials",
      }),
    };
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        return response.text().then((err) => {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            errorMessage: err,
          });
        });
      })
      .then((data) => {
        console.log(data);
        this.props.onAuthenticationSuccessful(JSON.parse(data).access_token);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <Container>
        <Form>
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
