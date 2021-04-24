import React from "react";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";

class ProgressDialog extends React.Component {
  render() {

    let progressText = this.props.now + "/" + this.props.max;

    return (
      <>
        <Modal show={this.props.show} keyboard="false" backdrop="static">
          <Modal.Header>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProgressBar now={this.props.now} label={progressText} min={this.props.min} max={this.props.max}></ProgressBar>
            <br />
            <p>Updating Biller: {this.props.currentBillerText}</p>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default ProgressDialog;
