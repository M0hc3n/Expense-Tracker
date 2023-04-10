import { AuthContext } from "context/AuthContext";
import { db } from "database/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

function TableList() {
  const [subUsers, setSubUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "users"),
        where("user_id", "==", currentUser.uid)
      );

      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(async (docSnapshot) => {
          setSubUsers((oldVal) =>
            oldVal.length > 0
              ? oldVal
              : docSnapshot.data()["fullName"]
              ? [...oldVal, docSnapshot.data()]
              : oldVal
          );
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">List of Sub Users</Card.Title>
                <p className="card-category">
                  Check Data about all the subusers
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Full Name</th>
                      <th className="border-0">Income</th>
                      <th className="border-0">Country</th>
                      <th className="border-0">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subUsers.map((subuser, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{subuser.fullName}</td>
                          <td>${subuser.granted_income}</td>
                          <td>{subuser.country}</td>
                          <td>{subuser.city}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableList;
