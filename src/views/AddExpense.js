import React, { useContext, useState } from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Dropdown,
  Col,
} from "react-bootstrap";

import {
  collection,
  updateDoc,
  addDoc,
  doc,
  FieldValue,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { AuthContext } from "context/AuthContext";
import { db } from "database/firebase";

function AddExpense() {
  const [successfulCreation, setSuccessfullCreation] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Fruits");
  const [expenseUnitPrice, setExpenseUnitPrice] = useState(0);
  const [expenseTotalPrice, setExpenseTotalPrice] = useState(0);

  const { currentUser, userInfo } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    try {
      const userRef = doc(
        db,
        "users",
        userInfo.is_sub_user ? userInfo.document_id : currentUser.uid
      );

      if (parseInt(userInfo.income) > expenseTotalPrice) {

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;

        // adding the expense
        await addDoc(collection(db, "Expenses"), {
          user_id: currentUser.uid,
          expenseName,
          expenseCategory,
          expenseUnitPrice,
          expenseTotalPrice,
          created_at: dateTime
        });
        
        // reducing the user income
        await updateDoc(userRef, {
          income: parseInt(userInfo.income) - expenseTotalPrice,
        });

        // incrementing the number of expenses in that category
        const q = query(
          collection(db, "Expenses Categories"),
          where(
            "user_id",
            "==",
            userInfo.is_sub_user ? userInfo.sub_user_code : currentUser.uid
          ),
          where("expenseCategory", "==", expenseCategory)
        );

        const querySnapshot = await getDocs(q);

        const userExpensesCategories = querySnapshot.docs[0].ref;

        querySnapshot.forEach(async (document) => {
          await updateDoc(userExpensesCategories, {
            numberOfExpenses: document.data()["numberOfExpenses"] + 1,
          });
        });

        setSuccessfullCreation(true);
      
      } else {
        setSuccessfullCreation(false);
        setError(true);

        setErrorMessage(`The expense given exceeds your current balance of $ ${userInfo.income ? userInfo.income : 0 }.`);
      } 
    } catch (error) {
      console.log(error);
      errorMessage("");
      setError(true);
      setSuccessfullCreation(false);
      return;
    }

    setTimeout(() => {
      setSuccessfullCreation(false);
    }, 4000);
  };

  const handleChange = (e) => {
    setExpenseCategory(e.target.value);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Add Expense</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e)}>
                  <Row>
                    <Col className=" px-1 ml-2" md="5">
                      <Form.Group>
                        <label>Expense Name</label>
                        <Form.Control
                          type="text"
                          value={expenseName}
                          onChange={(e) => setExpenseName(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="5">
                      <Dropdown className="d-flex form-select flex-column ml-2 my-2 h-25">
                        <label htmlFor="dropdown">Category</label>
                        <select
                          id="dropdown"
                          className="form-control"
                          onChange={handleChange}
                        >
                          <option value="Fruits">Fruits</option>
                          <option value="Vegetables">Vegetables</option>
                          <option value="Fun">Fun</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Other">Other</option>
                        </select>
                      </Dropdown>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Expense Unit Price</label>
                        <Form.Control
                          type="number"
                          value={expenseUnitPrice}
                          onChange={(e) => setExpenseUnitPrice(e.target.value)}
                          min="0"
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Expense Total Price</label>
                        <Form.Control
                          value={expenseTotalPrice}
                          onChange={(e) => setExpenseTotalPrice(e.target.value)}
                          type="number"
                          min="0"
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right mt-1"
                    type="submit"
                    variant="info"
                  >
                    Add Expense
                  </Button>
                  {successfulCreation && (
                    <div className="clearfix mt-2">
                      <span className="text-success">
                        Expense Added Successfully
                      </span>
                    </div>
                  )}
                  {error && (
                    <div className="clearfix mt-2">
                      <span className="text-danger">
                        {
                          errorMessage.length > 0 ? errorMessage : "Encountered an issue while adding expense... Retry Again"
                        }
                      </span>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddExpense;
