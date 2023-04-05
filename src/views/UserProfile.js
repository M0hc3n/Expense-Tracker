import React , { useContext , useMemo, useState}  from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col
} from "react-bootstrap";

import { AuthContext } from '../context/AuthContext'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "database/firebase";


function User() {

  const { currentUser, userInfo } = useContext(AuthContext);

  while(userInfo === {}){
    console.log(userInfo);
  }

  const [userName, setUserName] = useState(userInfo.userName);
  const [email , setEmail] = useState(userInfo.email);
  const [fullName, setFullName] = useState(userInfo.fullName);
  const [city, setCity] = useState(userInfo.city);
  const [country, setCountry] = useState(userInfo.country);

 const handleUpdate = async (e) => {
  e.preventDefault();

  const userRef = doc(db, "users", currentUser.uid);

  try {
    await updateDoc(userRef, {
      userName,
      fullName,
      "photoURL": userInfo.photoURL ,
      email,
      city,
      country,
      "uid": currentUser.uid
    })

  } catch (error) {
    console.log(error);
  }
 }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="7">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleUpdate(e)}>
                  <Row>
                    <Col className=" px-1 ml-2" md="3">
                      <Form.Group>
                        <label>Username</label>
                        <Form.Control
                          value={userName}
                          placeholder={userInfo.userName}
                          onChange={(e) => setUserName(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Form.Control
                          placeholder={userInfo.email}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Full Name</label>
                        <Form.Control
                          placeholder={userInfo.fullName}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>City</label>
                        <Form.Control
                          placeholder={userInfo.city}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control
                          placeholder={userInfo.country}
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right mt-1"
                    type="submit"
                    variant="info"
                  >
                    Update Profile
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <Card.Body>
                <div className="author mt-3">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={userInfo.photoURL}
                    ></img>
                    <h5 className="title">{userInfo.fullName}</h5>
                  </a>
                  <p className="description">{userInfo.userName}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default User;
