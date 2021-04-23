
function AuthenticationDetails(props) {
  return (
    <>
      <p>Client Id: {props.clientId}, Service: {props.baseUrl}</p>
    </>
  );
}

export default AuthenticationDetails;