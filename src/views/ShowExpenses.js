import { AuthContext } from "context/AuthContext";
import { db } from "database/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

function TableList() {
  const [expenses, setExpenses] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "Expenses"),
        where("user_id", "==", currentUser.uid),
        orderBy("created_at", "desc")
      );

      getDocs(q).then((querySnapshot) => {
        setExpenses([]);

        querySnapshot.forEach((docSnapshot) => {
          setExpenses((oldVal) => [...oldVal, docSnapshot.data()]);
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
                <Card.Title as="h4">List of Expenses</Card.Title>
                <p className="card-category">
                  See detailed information about what you have spent
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Expense Name</th>
                      <th className="border-0">Category</th>
                      <th className="border-0">Total Price</th>
                      <th className="border-0">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => {
                      const [datePart, timePart] = expense.created_at.split(" "); // split date and time parts
                      const [year, month, day] = datePart
                        .split("-")
                        .map(Number); // split date part into year, month, and day
                      const [hours, minutes, seconds] = timePart
                        .split(":")
                        .map(Number); // split time part into hours, minutes, and seconds

                      const monthNames = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ];
                      const monthName = monthNames[month - 1];

                      const formattedDate = `${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{expense.expenseName}</td>
                          <td>{expense.expenseCategory}</td>
                          <td>$ {expense.expenseTotalPrice}</td>
                          <td>{formattedDate}</td>
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
