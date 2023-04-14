import React, { useContext, useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

import { AuthContext } from "context/AuthContext";
import { db } from "database/firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";


function Dashboard() {
  const { currentUser, userInfo } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [sumOfExpenses, setSumOfExpenses] = useState();
  const [subUsers, setSubUsers] = useState([]);
  const [subUsersExpenses, setSubUsersExpenses] = useState([[]]);

  // available categories to be shown
  const [listOfCategories, setListOfCategories] = useState([]);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "Expenses"),
        where("user_id", "==", currentUser.uid),
        orderBy('created_at', "desc"),
        limit(5)
      );

      getDocs(q).then((querySnapshot) => {
        setExpenses([]);
        setSumOfExpenses(0);

        querySnapshot.forEach((docSnapshot) => {
          setExpenses((oldVal) => [...oldVal, docSnapshot.data()]);

          setSumOfExpenses( prev => prev + parseInt(docSnapshot.data()['expenseTotalPrice']) );
        });

      });
    } catch (error) {
      console.log(error);
    }

    try {
      const q = query(
        collection(db, "users"),
        where("user_id", "==", currentUser.uid)
      );

      getDocs(q).then((querySnapshot) => {
        // handles their number
        querySnapshot.forEach((docSnapshot) => {
          setSubUsers((oldVal) => 
            oldVal.length > 0
              ? oldVal
              : docSnapshot.data()["fullName"]
              ? [...oldVal, docSnapshot.data()]
              : oldVal
          );
        });

        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.data()["fullName"]) {
            const subQ = query(
              collection(db, "Expenses"),
              where("user_id", "==", docSnapshot.data()["uid"])
            );

            setSubUsersExpenses([[]]);

            getDocs(subQ).then((querySub) => {
              setSubUsersExpenses((prev) => {
                let subUserExpense = [];

                querySub.forEach((docSub) => {
                  subUserExpense.push(docSub.data()["expenseTotalPrice"]);
                });

                return [...prev, subUserExpense];
              });
            });
          }
        });
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const q = query(
        collection(db, "Expenses Categories"),
        where(
          "user_id",
          "==",
          userInfo.is_sub_user ? userInfo.sub_user_code : currentUser.uid
        )
      );

      setListOfCategories([]);

      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((document) => {

          setListOfCategories((prev) => {
            if (document.data()["numberOfExpenses"] > 0) {
              return prev.concat({
                category: document.data()["expenseCategory"],
                cardinality: document.data()["numberOfExpenses"],
              });
            } else {
              return prev.concat({ category: "", cardinality: 0 });
            }
          });
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
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Expenses</p>
                      <Card.Title as="h4">$ {sumOfExpenses}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Seconds ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <Card.Title as="h4">$ {userInfo.income ? userInfo.income : 0}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last update
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Expenses</p>
                      <Card.Title as="h4">{expenses.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  In the last update
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Subusers</p>
                      <Card.Title as="h4">{subUsers.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Seconds ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Subusers Expenses</Card.Title>
                <p className="card-category">Last Update </p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      series: subUsersExpenses,
                    }}
                    type="Line"
                    options={{
                      low: 0,
                      high: 800,
                      showArea: false,
                      height: "245px",
                      axisX: {
                        showGrid: false,
                      },
                      lineSmooth: true,
                      showLine: true,
                      showPoint: true,
                      fullWidth: true,
                      chartPadding: {
                        right: 50,
                      },
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated seconds ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Categories</Card.Title>
                <p className="card-category">Main Categories Consumed</p>
              </Card.Header>
              <Card.Body>
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <ChartistGraph
                    data={{
                      labels: listOfCategories.map(
                        (categ) => categ["category"]
                      ),
                      series: listOfCategories.map(
                        (categ) => categ["cardinality"]
                      ),
                    }}
                    type="Pie"
                  />
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock"></i>
                  Latest data update
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Expenses</Card.Title>
                <p className="card-category">Your Recent Expenses Feed </p>
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  <Table>
                    <tbody>
                      {expenses.map((expense, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              You have bought {expense.expenseName} of category{" "}
                              {expense.expenseCategory}, and of unit price{" $"}
                              {expense.expenseUnitPrice}. The total money spent
                              is{" $"}
                              {expense.expenseTotalPrice}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
