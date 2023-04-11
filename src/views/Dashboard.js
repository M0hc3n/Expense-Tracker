import React, { useContext, useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

import { AuthContext } from "context/AuthContext";
import { db } from "database/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const LIST_OF_CATEGORIES = ["Fruits", "Vegetables", "Fun", "Luxury", "Other"];

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
        where("user_id", "==", currentUser.uid)
      );

      getDocs(q).then((querySnapshot) => {
        setExpenses([]);
        querySnapshot.forEach((docSnapshot) => {
          setExpenses((oldVal) => [...oldVal, docSnapshot.data()]);

          // update the total sum of the expenses
          // setSumOfExpenses( expenses.reduce((acc, curr) => acc + curr.expenseTotalPrice ,0) );

          let sumOfExpenses_ = 0;

          for (let i = 0; i < expenses.length; i++) {
            sumOfExpenses_ += expenses[i]["expenseTotalPrice"];
          }

          setSumOfExpenses(sumOfExpenses_);
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
              where("user_id", "==", docSnapshot.data()["sub_user_code"])
            );

            let subUserExpense = [];

            getDocs(subQ).then((querySub) => {
              querySub.forEach((docSub) => {
                subUserExpense.push(docSub.data()["expenseTotalPrice"]);
              });
            });

            subUsersExpenses(prev => [...prev, subUserExpense]);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const q = query(
        collection(db, "Expenses Categories"),
        where("user_id", "==", currentUser.uid)
      );

      setListOfCategories([]);

      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((document) => {
          console.log(document.data());

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

  console.log(listOfCategories);

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
                      <Card.Title as="h4">$ {0}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update Now
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
                      <Card.Title as="h4">$ {userInfo.income}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
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
                  In the last hour
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
                      {/* TODO */}
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
                  Update now
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
                <p className="card-category">Last 24 Hours </p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      labels: ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"],
                      series: [
                        [287, 385, 490, 492, 554, 586, 698, 695],
                        [67, 152, 143, 240, 287, 335, 435, 437],
                        [23, 113, 67, 108, 190, 239, 307, 308],
                      ],
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
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Open <i className="fas fa-circle text-danger"></i>
                  Click <i className="fas fa-circle text-warning"></i>
                  Click Second Time
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated 3 minutes ago
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
                <div className="legend">
                  <i className="fas fa-circle text-success"></i>
                  Vegetables <i className="fas fa-circle text-info"></i>
                  Luxury <i className="fas fa-circle text-danger"></i>
                  Fun <br />
                  <i className="fas fa-circle text-warning"></i>
                  Other{" "}
                  <i className="fas fa-circle" style={{ color: "#9368E9" }}></i>
                  Fruits
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock"></i>
                  Campaign sent 2 days ago
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Income And Expenses</Card.Title>
                <p className="card-category">
                  Comparaison between Income and Expenses
                </p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        [
                          542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756,
                          895,
                        ],
                        [
                          412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636,
                          695,
                        ],
                      ],
                    }}
                    type="Bar"
                    options={{
                      seriesBarDistance: 10,
                      axisX: {
                        showGrid: false,
                      },
                      height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
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
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Income <i className="fas fa-circle text-danger"></i>
                  Expenses
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-check"></i>
                  Data information certified
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Expenses</Card.Title>
                <p className="card-category">Your Expenses Feed </p>
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
