import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Authenticator from './Authenticator';

function App() {
  return (
    <Container fluid>
        <h1>
          BPAY Biller Manager
        </h1>

        <Authenticator />
    </Container>
  );
}

export default App;
