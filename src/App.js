import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import "./App.css";
import Authenticator from "./Authenticator";
import AuthenticationDetails from "./AuthenticationDetails";
import BillerEntry from "./BillerEntry";
import BillerDisplay from "./BillerDisplay";
import UserActions from "./UserActions";
import StatusUpdates from "./StatusUpdates";

// Status Update
const STATUS_UNCHANGED = 0;
const STATUS_UPDATE_FAILED = 1;
const STATUS_UPDATE_SUCCESS = 2;
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseUrl: "api.bpaygroup.com.au",
      authDetails: null,
      statusUpdates: [],
    };
  }

  addErrorStatusMessage(message) {
    let messages = this.state.statusUpdates.slice();
    messages.push({ message: message, variant: "danger" });
    this.setState({ statusUpdates: messages });
  }
  addSuccessStatusMessage(message) {
    let messages = this.state.statusUpdates.slice();
    messages.push({ message: message, variant: "success" });
    this.setState({ statusUpdates: messages });
  }

  clearStatusMessages() {
    this.setState({ statusUpdates: [] });
  }

  handleAuthenticationSuccessful(authDetails) {
    console.log("Authentication successful, accessToken: " + authDetails.token.access_token);
    this.setState({ authDetails: authDetails });
  }

  handleBillerSelection(billerCodes) {
    console.log("Loading billers entered by user, billerCodes: " + billerCodes);
    this.loadBillers(billerCodes);
  }

  getRequestHeaders() {
    return {
      Authorization: "Bearer " + this.state.authDetails.token.access_token,
      Accept: "application/json",
    };
  }

  async loadBillers(billerCodes, preserveStatusMessages) {

    // Used when load called after an update
    if (!preserveStatusMessages){
      this.clearStatusMessages();
    }

    // Clear out any previous biller details that were previously loaded
    this.setState({ billerCodes: billerCodes, billerDetails: null });

    console.log("Starting to load biller details, num to load: " + billerCodes.length);

    const billerDetails = [];

    for (let billerCode of billerCodes) {
      console.log("Loading biller details for: " + billerCode);

      const url = this.state.authDetails.baseUrl + "/bpay/v1/billerchanges/" + billerCode;
      const options = {
        method: "GET",
        headers: this.getRequestHeaders(),
      };
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const billerDetail = await response.json();
          billerDetail.updateStatus = STATUS_UNCHANGED;
          console.log("Response biller Detail: " + JSON.stringify(billerDetail));
          billerDetails.push(billerDetail);
        } else {
          let bodyText = await response.text();
          let message =
            "Failed to load billerCode: " + billerCode + ", httpCode: " + response.status + ", error: " + bodyText;

          console.log(message);
          this.addErrorStatusMessage(message);
        }
      } catch (error) {
        const message = "Failed to load biller, billerCode: " + billerCode + ", error: " + error;
        console.log(message);
        this.addErrorStatusMessage(message);
      }
    }

    this.setState({ billerCodes: billerCodes, billerDetails: billerDetails });
  }

  async handleUpdateBillers(updateDetails) {
    this.clearStatusMessages();

    const url = this.state.authDetails.baseUrl + "/bpay/v1/billerchanges";

    for (let biller of this.state.billerDetails) {
      let billerCode = biller.currentBillerDetails.billerState.billerCode;
      let activationDate = updateDetails.activationDate;
      let comment = updateDetails.comment;

      // Start with the existing state and apply the changes to it
      let proposedState = JSON.parse(JSON.stringify(biller.currentBillerDetails.billerState));
      for (let paymentMethod of proposedState.acceptedPaymentMethods) {
        paymentMethod.maxAmount = updateDetails.upperLimit;
      }
      proposedState.comment = comment;
      delete proposedState.changeCollateral;
      delete proposedState.status;

      let body = {
        changeType: "UPDATE",
        proposedBillerDetails: proposedState,
        publicationInstructions: {
          activationDate: activationDate,
          publishToBMFImmediately: false,
        },
      };

      const header = this.getRequestHeaders();
      header["Content-Type"] = "application/json";

      const options = {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      };

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const billerDetail = await response.json();
          console.log("Update biller " + billerCode + ", response detail: " + JSON.stringify(billerDetail));
          biller.updateStatus = STATUS_UPDATE_SUCCESS;
        } else {
          let bodyText = await response.text();
          let message =
            "Failed to update biller, billerCode: " +
            billerCode +
            ", errorCode: " +
            response.status +
            ", error: " +
            bodyText;

          console.log(message);
          this.addErrorStatusMessage(message);
          biller.updateStatus = STATUS_UPDATE_FAILED;
        }
      } catch (error) {
        const message = "Failed biller update attempt, billerCode: " + billerCode + ", error: " + error;
        console.log(message);
        this.addErrorStatusMessage(message);
        biller.updateStatus = STATUS_UPDATE_FAILED;
      }
    }

    // Refresh the status of the billers that have been updated
    this.loadBillers(this.state.billerCodes, true);
  }

  async handleCloseBillers(closeDetails) {
    this.clearStatusMessages();
    const url = this.state.authDetails.baseUrl + "/bpay/v1/billerchanges";

    for (let biller of this.state.billerDetails) {
      let billerCode = biller.currentBillerDetails.billerState.billerCode;
      let activationDate = closeDetails.activationDate;
      let closureReasonCode = closeDetails.closeReason;
      let comment = closeDetails.comment;

      let body = {
        changeType: "CLOSE",
        billerCloseDetails: {
          billerCode: billerCode,
          closureReasonCode: closureReasonCode,
          comment: comment,
        },
        publicationInstructions: {
          activationDate: activationDate,
          publishToBMFImmediately: false,
        },
      };

      const header = this.getRequestHeaders();
      header["Content-Type"] = "application/json";

      const options = {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      };

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const billerDetail = await response.json();
          console.log("Close biller " + billerCode + ", response detail: " + JSON.stringify(billerDetail));
          biller.updateStatus = STATUS_UPDATE_SUCCESS;
        } else {
          const bodyText = await response.text();
          const message =
            "Failed to close biller, billerCode: " +
            billerCode +
            ", errorCode: " +
            response.status +
            ", error: " +
            bodyText;

          console.log(message);
          this.addErrorStatusMessage(message);
          biller.updateStatus = STATUS_UPDATE_FAILED;
        }
      } catch (error) {
        const message = "Failed biller close attempt, billerCode: " + billerCode + ", error: " + error;
        console.log(message);
        this.addErrorStatusMessage(message);
        biller.updateStatus = STATUS_UPDATE_FAILED;
      }
    }

    // Refresh the status of the billers that have been updated
    this.loadBillers(this.state.billerCodes, true);
  }

  async handleDeletePendingChanges() {
    this.clearStatusMessages();
    const url = this.state.authDetails.baseUrl + "/bpay/v1/billerchanges/";

    for (let biller of this.state.billerDetails) {
      let billerCode = biller.currentBillerDetails.billerState.billerCode;

      const options = {
        method: "DELETE",
        headers: this.getRequestHeaders(),
      };

      try {
        console.log("Attemping to delete pending change for billerCode: " + billerCode);
        const response = await fetch(url + billerCode, options);
        if (response.ok) {
          const billerDetail = await response.json();
          console.log("Close biller " + billerCode + ", response detail: " + JSON.stringify(billerDetail));
          biller.updateStatus = STATUS_UPDATE_SUCCESS;
        } else {
          console.log(
            "Failed to delete pending change for billerCode: " +
              billerCode +
              ", errorCode: " +
              response.status +
              ", error: " +
              response.statusText
          );
          biller.updateStatus = STATUS_UPDATE_FAILED;
          throw new Error(
            "Error deleting pending change for billerCode: " +
              billerCode +
              ", code: " +
              response.status +
              ", error: " +
              response.statusText
          );
        }
      } catch (error) {
        console.log("Failed delete pending change attempt, billerCode: " + billerCode + ", error: " + error);
        biller.updateStatus = STATUS_UPDATE_FAILED;
      }
    }
  }

  render() {
    return (
      <Container fluid>
        <h1>Biller Update Tool</h1>

        {!this.state.authDetails && (
          <Authenticator
            onAuthenticationSuccessful={(authDetails) => this.handleAuthenticationSuccessful(authDetails)}
          />
        )}

        {this.state.authDetails && (
          <AuthenticationDetails clientId={this.state.authDetails.clientId} baseUrl={this.state.authDetails.baseUrl} />
        )}

        {this.state.authDetails && (
          <BillerEntry onBillerEntry={(billerCodes) => this.handleBillerSelection(billerCodes)} />
        )}

        <br />

        {this.state.billerDetails && (
          <UserActions
            onCloseBillers={(closeDetails) => this.handleCloseBillers(closeDetails)}
            onDeletePendingChanges={() => this.handleDeletePendingChanges()}
            onUpdateBillers={(updateDetails) => this.handleUpdateBillers(updateDetails)}
          />
        )}

        <StatusUpdates updates={this.state.statusUpdates} />

        {this.state.billerDetails && <BillerDisplay billerDetails={this.state.billerDetails} />}
      </Container>
    );
  }
}

export default App;
