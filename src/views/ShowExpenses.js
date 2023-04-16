import { AuthContext } from "context/AuthContext";

import { db } from "database/firebase";

import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import React, { useContext, useEffect, useState } from "react";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
  Dropdown,
  Button,
} from "react-bootstrap";

function ShowExpenses() {
  const [expenses, setExpenses] = useState([]);
  const { currentUser, userInfo } = useContext(AuthContext);
  const [editedExpense, setEditedExpense] = useState();
  const [selectedExpenseName, setSelectedExpenseName] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [selectedExpensePrice, setSelectedExpensePrice] = useState();

  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);
  const [err, setError] = useState(false);

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

  const handleClickExpense = (clickedExpenseIndex) => {
    if (editedExpense === clickedExpenseIndex) {
      setEditedExpense(20);
      return;
    }

    setEditedExpense(clickedExpenseIndex);

    setSelectedExpenseName(expenses[clickedExpenseIndex]["expenseName"]);
    setSelectedExpenseCategory(
      expenses[clickedExpenseIndex]["expenseCategory"]
    );
    setSelectedExpensePrice(expenses[clickedExpenseIndex]["expenseTotalPrice"]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "Expenses"),
        where("user_id", "==", currentUser.uid),
        where("created_at", "==", expenses[editedExpense]["created_at"])
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = docSnapshot.ref;

        await updateDoc(docRef, {
          expenseCategory: selectedExpenseCategory,
          expenseName: selectedExpenseName,
          expenseTotalPrice: selectedExpensePrice,
        });

        if (
          selectedExpenseCategory !== expenses[editedExpense]["expenseCategory"]
        ) {
          let subQ = query(
            collection(db, "Expenses Categories"),
            where(
              userInfo.is_sub_user ? "sub_user_code" : "user_id",
              "==",
              userInfo.is_sub_user ? userInfo.sub_user_code : currentUser.uid
            ),
            where(
              "expenseCategory",
              "==",
              expenses[editedExpense]["expenseCategory"]
            )
          );

          let subQuerySnapshot = await getDocs(subQ);

          // reduce from the old category cardinality
          subQuerySnapshot.forEach(async (subDocSnapshot) => {
            const subDocRef = subDocSnapshot.ref;

            await updateDoc(subDocRef, {
              numberOfExpenses: subDocSnapshot.data()["numberOfExpenses"] - 1,
            });
          });

          subQ = query(
            collection(db, "Expenses Categories"),
            where(
              userInfo.is_sub_user ? "sub_user_code" : "user_id",
              "==",
              userInfo.is_sub_user ? userInfo.sub_user_code : currentUser.uid
            ),
            where("expenseCategory", "==", selectedExpenseCategory)
          );

          subQuerySnapshot = await getDocs(subQ);

          // increment the new category cardinality
          subQuerySnapshot.forEach(async (subDocSnapshot) => {
            const subDocRef = subDocSnapshot.ref;

            await updateDoc(subDocRef, {
              numberOfExpenses: subDocSnapshot.data()["numberOfExpenses"] + 1,
            });
          });
        }

        if (
          parseInt(selectedExpensePrice) !==
          parseInt(expenses[editedExpense]["expenseTotalPrice"])
        ) {
          const differenceInExpense =
            parseInt(expenses[editedExpense]["expenseTotalPrice"]) -
            parseInt(selectedExpensePrice);

          let subQ;

          if (userInfo.is_sub_user) {
            subQ = query(
              collection(db, "users"),
              where("sub_user_code", "==", userInfo.sub_user_code)
            );
          } else {
            subQ = query(
              collection(db, "users"),
              collection("user_id", "==", userInfo.uid)
            );
          }

          const subQuerySnapshot = await getDocs(q);

          // update user's income
          subQuerySnapshot.forEach(async (subDoc) => {
            const userRef = subDoc.ref;

            await updateDoc(userRef, {
              income: parseInt(userInfo.income) + differenceInExpense,
            });
          });
        }
      });

      setUpdatedSuccessfully(true);
    } catch (error) {
      setUpdatedSuccessfully(false);
      setError(true);
      console.log(error);
    }

    setInterval(() => {
      setUpdatedSuccessfully(false);
    }, 5000);
  };

  const handleChange = (e) => {
    setSelectedExpenseCategory(e.target.value);
  };

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
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => {
                      const [datePart, timePart] =
                        expense.created_at.split(" "); // split date and time parts
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
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{expense.expenseName}</td>
                            <td>{expense.expenseCategory}</td>
                            <td>$ {expense.expenseTotalPrice}</td>
                            <td>{formattedDate}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning mr-1"
                                onClick={(e) => handleClickExpense(index)}
                              >
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger">
                                Delete
                              </button>
                            </td>
                          </tr>
                          {editedExpense === index ? (
                            <tr key={index}>
                              <td colSpan={6}>
                                <Form
                                  style={{ width: "100%", height: "20rem" }}
                                  onSubmit={handleSubmit}
                                >
                                  <Form.Group>
                                    <label>Expense Name</label>
                                    <Form.Control
                                      type="text"
                                      value={selectedExpenseName}
                                      onChange={(e) =>
                                        setSelectedExpenseName(e.target.value)
                                      }
                                      required
                                    ></Form.Control>
                                  </Form.Group>
                                  <Dropdown className="d-flex form-select flex-column mt-2 h-25">
                                    <label htmlFor="dropdown">Category</label>
                                    <select
                                      id="dropdown"
                                      className="form-control"
                                      onChange={handleChange}
                                    >
                                      <option value="Fruits">Fruits</option>
                                      <option value="Vegetables">
                                        Vegetables
                                      </option>
                                      <option value="Fun">Fun</option>
                                      <option value="Luxury">Luxury</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </Dropdown>
                                  <Form.Group>
                                    <label>Expense Total Price</label>
                                    <Form.Control
                                      type="number"
                                      value={selectedExpensePrice}
                                      onChange={(e) => {
                                        setSelectedExpensePrice(e.target.value);
                                      }}
                                      required
                                    ></Form.Control>
                                  </Form.Group>
                                  <Button
                                    className="btn-fill pull-right my-3"
                                    type="submit"
                                    variant="info"
                                  >
                                    Update Expense
                                  </Button>
                                  <br />
                                  {err && (
                                    <span
                                      className="title text-danger"
                                      style={{ fontSize: "1rem" }}
                                    >
                                      Something Wrong Happened, Retry...
                                    </span>
                                  )}
                                  {updatedSuccessfully && (
                                    <span
                                      className="title text-success"
                                      style={{ fontSize: "1rem" }}
                                    >
                                      Successfull Update ...
                                    </span>
                                  )}
                                </Form>
                              </td>
                            </tr>
                          ) : null}
                        </>
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

export default ShowExpenses;
