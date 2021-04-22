import React from "react";
import Alert from "react-bootstrap/Alert";

class StatusUpdates extends React.Component {
  render() {
    const status = this.props.updates.map((update, number) => {
      return (
        <>
          <Alert variant={update.variant}>{update.message}</Alert>
        </>
      );
    });
    return status;
  }
}

export default StatusUpdates;
