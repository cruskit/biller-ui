import React from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";

class BillerDisplay extends React.Component {
  renderCurrentBiller(currentBiller) {
    if (currentBiller == null) {
      return (
        <tr>
          <td colSpan="5">Biller is not currently in BMF</td>
        </tr>
      );
    }
    const billerState = currentBiller.billerState;
    return (
      <tr>
        <td>Current</td>
        <td>{billerState.billerCode}</td>
        <td>{billerState.shortName}</td>
        <td>{billerState.longName}</td>
        <td>{currentBiller.activationDate}</td>
      </tr>
    );
  }

  renderProposedBiller(proposedBiller) {
    if (proposedBiller == null) {
      return (
        <tr>
          <td colSpan="5">No proposed changes for biller</td>
        </tr>
      );
    }
    const billerState = proposedBiller.proposedBillerState;
    return (
      <tr>
        <td>Proposed</td>
        <td>{billerState.billerCode}</td>
        <td>{billerState.shortName}</td>
        <td>{billerState.longName}</td>
        <td>{proposedBiller.publicationInstructions.activationDate}</td>
      </tr>
    );
  }

  renderBillers(billerDetails) {
    const billerRows = billerDetails.map((biller, index) => {
      return (
        <>
          {this.renderCurrentBiller(biller.currentBillerDetails)}
          {this.renderProposedBiller(biller.proposedBillerDetails)}
        </>
      );
    });
    return billerRows;
  }

  render() {
    return (
      <Row>
        <Table bordered size="sm" striped>
          <thead>
            <tr className="text-center">
              <th>State</th>
              <th>Biller Code</th>
              <th>Short Name</th>
              <th>Long Name</th>
              <th>Activation Date</th>
            </tr>
          </thead>
          <tbody>{this.renderBillers(this.props.billerDetails)}</tbody>
        </Table>
      </Row>
    );
  }
}
export default BillerDisplay;
