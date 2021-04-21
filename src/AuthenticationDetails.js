
function AuthenticationDetails(props) {
  return (
    <>
      <p>Authenticated as: {props.clientId}, using environment: {props.baseUrl}</p>
    </>
  );
}

export default AuthenticationDetails;