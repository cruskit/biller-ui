import React from "react";
import Table from "react-bootstrap/Table";

class BillerDisplay extends React.Component {
  getPaymentMethodLimits(method, paymentMethods) {
    for (let paymentMethod of paymentMethods) {
      if (paymentMethod.paymentMethodType === method) {
        return `$${paymentMethod.minAmount} - $${paymentMethod.maxAmount}`;
      }
    }
    return " ";
  }

  renderPaymentMethods(paymentMethods, comparedPaymentMethods) {
    const highlight = { backgroundColor: "#ffff00" };
    const plain = {};

    let debitStyle = plain,
      visaStyle = plain,
      mcStyle = plain,
      otherStyle = plain;
    if (comparedPaymentMethods) {
      debitStyle =
        this.getPaymentMethodLimits("001", paymentMethods) ===
        this.getPaymentMethodLimits("001", comparedPaymentMethods)
          ? plain
          : highlight;
      visaStyle =
        this.getPaymentMethodLimits("101", paymentMethods) ===
        this.getPaymentMethodLimits("101", comparedPaymentMethods)
          ? plain
          : highlight;
      mcStyle =
        this.getPaymentMethodLimits("201", paymentMethods) ===
        this.getPaymentMethodLimits("201", comparedPaymentMethods)
          ? plain
          : highlight;
      otherStyle =
        this.getPaymentMethodLimits("301", paymentMethods) ===
        this.getPaymentMethodLimits("301", comparedPaymentMethods)
          ? plain
          : highlight;
    }

    return (
      <>
        <td style={debitStyle}>{this.getPaymentMethodLimits("001", paymentMethods)}</td>
        <td style={visaStyle}>{this.getPaymentMethodLimits("101", paymentMethods)}</td>
        <td style={mcStyle}>{this.getPaymentMethodLimits("201", paymentMethods)}</td>
        <td style={otherStyle}>{this.getPaymentMethodLimits("301", paymentMethods)}</td>
      </>
    );
  }

  renderProposedBiller(proposedBiller, currentBiller) {
    if (!proposedBiller) {
      return (
        <>
          <td colSpan="8">No pending change</td>
        </>
      );
    }

    let statusStyle = {};
    if (proposedBiller.proposedBillerState.status !== currentBiller.billerState.status) {
      statusStyle = { backgroundColor: "#ffff00" };
    }
    let activationDateStyle = {};
    if (proposedBiller.publicationInstructions.activationDate !== currentBiller.activationDate) {
      activationDateStyle = { backgroundColor: "#ffff00" };
    }

    return (
      <>
        <td>Proposed</td>
        <td>{proposedBiller.proposedBillerState.shortName}</td>
        <td style={statusStyle}>{proposedBiller.proposedBillerState.status}</td>
        <td style={activationDateStyle}>{proposedBiller.publicationInstructions.activationDate}</td>
        {this.renderPaymentMethods(
          proposedBiller.proposedBillerState.acceptedPaymentMethods,
          currentBiller.billerState.acceptedPaymentMethods
        )}
      </>
    );
  }

  renderBillers(billerDetails) {
    const billerRows = billerDetails.map((biller, index) => {
      const currentBiller = biller.currentBillerDetails;
      const currentBillerState = biller.currentBillerDetails.billerState;
      const proposedBiller = biller.proposedBillerDetails;

      return (
        <>
          <tr>
            <td rowSpan="2" className="text-center">{currentBillerState.billerCode}</td>
            <td>Current</td>
            <td>{currentBillerState.shortName}</td>
            <td>{currentBillerState.status}</td>
            <td>{currentBiller.activationDate}</td>
            {this.renderPaymentMethods(currentBillerState.acceptedPaymentMethods)}
          </tr>
          <tr>{this.renderProposedBiller(proposedBiller, currentBiller)}</tr>
        </>
      );
    });
    return billerRows;
  }

  render() {
    return (
      <>
        <Table bordered size="sm">
          <thead>
            <tr className="text-center">
              <th>Biller Code</th>
              <th>&nbsp;</th>
              <th>Short Name</th>
              <th>Status</th>
              <th>Activation Date</th>
              <th>Debit</th>
              <th>Visa</th>
              <th>Mastercard</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>{this.renderBillers(this.props.billerDetails)}</tbody>
        </Table>
      </>
    );
  }
}
export default BillerDisplay;
