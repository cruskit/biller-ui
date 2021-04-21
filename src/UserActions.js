import React from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
  }

  handleCloseBillersRequest() {
    console.log("User has requested to close all billers");

    this.showConfirmationModal("Proceed with closing billers?", () => this.handleCloseBillersConfirmation());
  }
  handleCloseBillersConfirmation() {
    console.log("User has confirmed closing billers");
    this.hideConfirmationModal();
  }

  handleConfirmationCancellation() {
    console.log("User cancelled requested action");
    this.hideConfirmationModal();
  }

  render() {
    return (
      <>
        <Row>
            <p className="align-middle"><strong>&nbsp; &nbsp; Actions</strong> &nbsp;
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
      </>
    );
  }
}
export default UserActions;
