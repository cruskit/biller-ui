import React from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCloseModal: false,
      showConfirmationModal: false,
      modalConfirmationMessage: "Confirm proceeding with the bulk operation.",
    };
  }

  hideConfirmationModal() {
    this.setState({ showConfirmationModal: false });
  }

  showConfirmationModal(message, action) {
    this.setState({
      modalConfirmationMessage: message,
      modalConfirmationAction: action,
      showConfirmationModal: true,
    });
  }

  handleDeletePendingChangeRequest() {
    console.log("User has requested to delete all pending changes");

    this.showConfirmationModal("Proceed with deleting pending changes?", () =>
      this.handleDeletePendingChangeConfirmation()
    );
  }
  handleDeletePendingChangeConfirmation() {
    console.log("User has confirmed deleting all pending changes");
    this.hideConfirmationModal();
    this.props.onDeletePendingChanges();
  }

  handleCloseBillersRequest() {
    console.log("User has requested to close all billers");

    this.setState({ showCloseModal: true });
  }
  handleCloseBillersConfirmation(closeDetails) {
    console.log("User has confirmed closing billers with details: " + JSON.stringify(closeDetails));
    this.setState({ showCloseModal: false });
    this.props.onCloseBillers(closeDetails);
  }

  handleConfirmationCancellation() {
    console.log("User cancelled requested action");
    this.hideConfirmationModal();
  }

  render() {
    return (
      <>
        <Row>
          <p className="align-middle">
            <strong>&nbsp; &nbsp; Actions</strong> &nbsp;
            <Button onClick={() => this.handleDeletePendingChangeRequest()}>Delete Pending Changes</Button>
            &nbsp; &nbsp;
            <Button onClick={() => this.handleCloseBillersRequest()}>Close Billers</Button>
          </p>
        </Row>

        <Modal show={this.state.showConfirmationModal} onHide={() => this.handleConfirmationCancellation()}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalConfirmationMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleConfirmationCancellation()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.state.modalConfirmationAction}>
              Proceed
            </Button>
          </Modal.Footer>
        </Modal>

        <CloseBillerConfirmationModal
          show={this.state.showCloseModal}
          onCancel={() => this.setState({ showCloseModal: false })}
          onConfirm={(closeDetails) => this.handleCloseBillersConfirmation(closeDetails)}
        />
      </>
    );
  }
}

class CloseBillerConfirmationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activationDate: "",
      closeReason: "003",
      comment: "",
    };
  }

  submitForm() {
    const closeDetails = {
      activationDate: this.state.activationDate,
      closeReason: this.state.closeReason,
      comment: this.state.comment,
    };
    this.props.onConfirm(closeDetails);
  }

  render() {
    return (
      <>
        <Modal show={this.props.show} onHide={() => this.props.onCancel()}>
          <Modal.Header closeButton>
            <Modal.Title>Close Billers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formActivationDate">
                <Form.Label>Activation Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="2021-08-22"
                  value={this.state.activationDate}
                  onChange={(e) => this.setState({ activationDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="formCloseReason">
                <Form.Label>Close Reason</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  value={this.state.closeReason}
                  onChange={(e) => this.setState({ closeReason: e.target.value })}
                >
                  <option value="000">Biller Agreement Terminated - Fraud</option>
                  <option value="001">Biller Agreement Terminated - Other</option>
                  <option value="002">Biller Agreement Suspended</option>
                  <option value="003">Biller Business Closed</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formActivationDate">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Comment on why the biller is being closed"
                  value={this.state.comment}
                  onChange={(e) => this.setState({ comment: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.onCancel()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => this.submitForm()}>
              Close Billers
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default UserActions;
