
function AuthenticationDetails(props) {
  return (
    <>
      <p>Authenticated as: {props.clientId} in environment: {props.baseUrl}</p>
    </>
  );
}

export default AuthenticationDetails;