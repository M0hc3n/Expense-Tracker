import { AuthContext } from "context/AuthContext";
import { db } from "database/firebase";
import { collection, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

// react-bootstrap components
import { Card, Table, Container, Row, Col, Form } from "react-bootstrap";

function TableList() {
  const [subUsers, setSubUsers] = useState([]);
  const { currentUser , userInfo } = useContext(AuthContext);
  const [render, setRender] = useState(false);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "users"),
        where("user_id", "==", currentUser.uid)
      );

      setSubUsers([]);
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(async (docSnapshot) => {
          setSubUsers((oldVal) => docSnapshot.data()['fullName'] ? [...oldVal, docSnapshot.data()]: oldVal);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, render]);

  const handleActionOnSubUser = async (subUserIndex) => {
    
    try {
      
      const q = query(
        collection(db, 'users'),
        where(
          "sub_user_code",
          "==",
          subUsers[subUserIndex]['sub_user_code']
        )
      );
      
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (queryDoc) => {
        const userRef = queryDoc.ref;

        // setting the state to off
        await updateDoc(userRef , {
          activated: ! queryDoc.data()['activated']
        });

        setRender(prev => ! prev);
      })
    
    } catch (error) {
      console.log(error);
    }
  }

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
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subUsers.map((subuser, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{subuser.fullName}</td>
                          <td>$ {subuser.income}</td>
                          <td>{subuser.country}</td>
                          <td>{subuser.city}</td>
                          <td>
                            {subuser.activated ? (
                              <button className="btn btn-sm btn-danger" onClick={(e) => handleActionOnSubUser(index)}>
                                Deactivate
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-primary" onClick={(e) => handleActionOnSubUser(index)}>
                                Activate
                              </button>
                            )}
                          </td>
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
