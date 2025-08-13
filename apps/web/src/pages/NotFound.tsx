import { useNavigate } from "react-router";
import { Container,Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-5">
      <Container>
        <p className="lead">Not found</p>
            <Button variant="primary" onClick={()=>navigate(-1)}>Go back</Button>
      </Container>
    </div>
  );
}
