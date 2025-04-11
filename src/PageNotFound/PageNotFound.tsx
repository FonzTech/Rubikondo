import * as React from 'react'
import {Container} from "react-bootstrap";

const HomePage: React.FC = () => {
  return (
    <Container fluid className="d-flex flex-column min-vh-100 justify-content-center align-items-center" data-testid="page-not-found">
      <h1>Page Not Found</h1>
    </Container>
  );
};

export default HomePage;