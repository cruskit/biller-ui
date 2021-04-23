import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class BillerEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredCodes: "",
    };
  }

  handleBillerSubmission() {
    console.log("Handling user entered biller codes: " + this.state.enteredCodes);

    let billerCodes = this.state.enteredCodes.split(",");

    // TODO: Some error handling, strip spaces, etc

    this.props.onBillerEntry(billerCodes);
  }

  render() {
    return (
      <Container fluid>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group controlId="formBillerCodes">
            <Form.Label>Biller Codes</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Biller Codes (use comma for multiple)"
              value={this.state.enteredCodes}
              onChange={(e) => this.setState({ enteredCodes: e.target.value })}
            />
          </Form.Group>

          <Button variant="primary" onClick={() => this.handleBillerSubmission()}>
            Load Billers
          </Button>
        </Form>
      </Container>
    );
  }
}

export default BillerEntry;
