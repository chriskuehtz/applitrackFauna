import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import api from "./utils/api.js";
import bcrypt from "bcryptjs";

const App = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [ref, setRef] = useState("");
  const [loginScreen, setLoginScreen] = useState(true);
  const [warning, setWarning] = useState("");
  const [applications, setApplications] = useState([]);
  const [entry, setEntry] = useState(null);
  const [newEntry, setNewEntry] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newLink, setNewLink] = useState("");

  const [dropdown, setDropdown] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const categories = [
    "Applied",
    "NoResponse",
    "Response",
    "Interview",
    "Declined",
    "JobOffer",
  ];
  //styles:
  const stages = {
    Applied: "info",
    NoResponse: "dark",
    Response: "primary",
    Interview: "warning",
    Declined: "danger",
    JobOffer: "success",
  };
  const fullscreen = {
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: "100vh",
    heigth: "100%",
    width: "100vw",
    backgroundColor: "#8F2D56",
  };
  const cardHeader = {
    fontSize: "6vh",
    marginLeft: 5,
  };
  const bigCard = {
    backgroundColor: "white",
    margin: "2%",
  };
  const categoryCard = {
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: "1px",
    margin: "4%",
    minHeight: "92%",
  };
  const inputElement = {
    width: "96%",
    fontSize: "4vh",
    margin: "2%",
  };
  const functionButton = {
    width: "96%",
    fontSize: "4vh",
    margin: "2%",
  };
  const categoryButton = {
    backgroundColor: "white",
    color: "black",
    width: "96%",
    fontSize: "4vh",
    margin: "2%",
  };
  const buttonGroup = { width: "96%", margin: "2%" };
  const itemButton = { width: "80%" };
  const deleteButton = { width: "20%" };
  const addButtonDesktop = {
    marginBottom: 20,
    fontSize: "4vh",
    marginTop: "4%",
    marginLeft: "1%",
    width: "98%",
  };
  const addButtonMobile = {
    marginBottom: 20,
    fontSize: "4vh",
    marginTop: "4%",
    marginLeft: "4%",
    width: "92%",
  };

  //load the data upon login
  const fetchData = async (u) => {
    const result = await api.read(u);
    console.log(result);
    setRef(result.data.ref);
    setApplications(result.data.applications);
  };
  //update the DB with the changed Parameters
  const triggerUpdate = async (param, type) => {
    console.log("triggerUpdate");
    let data = {
      user: user,
      applications: applications,
      ref: ref,
    };
    if (type === "application") {
      data.applications = param;
    }
    const result = await api.update({
      ref: ref,
      data: data,
    });
    console.log("received");
    console.log(result.data);
    setApplications(result.data.applications);
  };
  //validate pw hash and username against DB
  const validate = async (u, p) => {
    const result = await api.validate(u);
    if (bcrypt.compareSync(p, result.hash)) {
      console.log("password correct");
      fetchData(u);
      setLoginScreen(false);
      setWarning("");
    } else {
      setWarning("wrong user or password");
    }
  };
  //add a note to an application
  const pushNote = () => {
    if (note !== "") {
      let temp = notes.concat(note);
      let tempEntry = entry;
      tempEntry.notes = temp;
      setNotes(temp);
      setEntry(tempEntry);
      setNote("");
    }
  };
  //delete a note from an application
  const deleteNote = (n) => {
    let temp = notes.filter((note) => note !== n);
    let tempEntry = entry;
    tempEntry.notes = temp;
    setNotes(temp);
    setEntry(tempEntry);
    setNote("");
  };
  //jsx components
  const showHomeScreen = () => {
    //temp variable because everything that does not belong in a filter goes in the "other" filter
    return (
      <Row style={fullscreen}>
        {categories.map((c) => (
          <Col xs="12" lg="4">
            <Card style={categoryCard}>
              <CardHeader>
                <h1 style={{ marginLeft: "2%" }}>
                  {c === "JobOffer"
                    ? "Job Offer"
                    : c === "NoResponse"
                    ? "No Response"
                    : c}
                </h1>
              </CardHeader>

              {applications
                .filter((a) => a.stage === c)
                .map((a) => (
                  <Button
                    style={functionButton}
                    color={stages[a.stage]}
                    onClick={() => {
                      setEntry(a);
                      setNotes(a.notes);
                    }}
                  >
                    {a.title} at {a.company}
                  </Button>
                ))}
            </Card>
          </Col>
        ))}
        <Col xs="12">
          <Button
            style={
              Window.innerHeight >= Window.innerWidth
                ? addButtonMobile
                : addButtonDesktop
            }
            color="light"
            onClick={() =>
              setNewEntry({ title: "", company: "", contact: "", link: "" })
            }
          >
            new Application
          </Button>
        </Col>
      </Row>
    );
  };
  const showEntry = () => {
    const changeStage = (c) => {
      setDropdown(false);
      console.log("changeStage");
      console.log(c);
      let temp = entry;
      temp.stage = c;
      setEntry(temp);
    };
    const keyPressed = (event) => {};

    return (
      <Row style={fullscreen}>
        <Col lg="12" xl={{ size: "10", offset: "1" }}>
          <Card style={bigCard}>
            <Row>
              <Col xs="12">
                <CardHeader>
                  <p style={cardHeader}>
                    {entry.title} at {entry.company}
                  </p>
                </CardHeader>
              </Col>
              <Col xs="12">
                <h3 style={{ width: "96%", marginBottom: 20, marginLeft: 5 }}>
                  {entry.hasOwnProperty("contact") ? entry.contact : ""}
                </h3>
              </Col>
              <Col xs="12">
                <Dropdown isOpen={dropdown}>
                  <DropdownToggle
                    style={{ width: "96%", marginBottom: 20, marginLeft: 5 }}
                    color={stages[entry.stage]}
                    caret
                    onClick={() => setDropdown(!dropdown)}
                  >
                    {entry.stage}
                  </DropdownToggle>
                  <DropdownMenu style={{ width: "96%" }}>
                    {categories.map((c) => (
                      <DropdownItem onClick={() => changeStage(c)}>
                        {c}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col xs="12">
                <ListGroup
                  style={{ width: "96%", marginBottom: 20, marginLeft: 5 }}
                >
                  {notes.map((e) => (
                    <ListGroupItem>
                      {e}
                      <Button
                        style={{ float: "right" }}
                        outline
                        color="dark"
                        onClick={() => deleteNote(e)}
                      >
                        X
                      </Button>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Col>
              <Col xs="12">
                <ButtonGroup
                  style={{ width: "96%", marginBottom: 20, marginLeft: 5 }}
                >
                  <Input
                    placeholder="new Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter" && note !== "") {
                        //if enter is pressed and input is not empty, add input to the list
                        pushNote();
                      }
                    }}
                  />
                  <Button
                    disabled={note === ""}
                    color={stages[entry.stage]}
                    style={{ width: "10%" }}
                    onClick={() => pushNote()}
                  >
                    +
                  </Button>
                </ButtonGroup>
                {entry.link !== "" ? (
                  <Button
                    style={{ width: "96%", marginBottom: 20, marginLeft: 5 }}
                    color={stages[entry.stage]}
                    href={entry.link}
                  >
                    <p>{entry.link}</p>
                  </Button>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Card>
          <Button
            style={{
              fontSize: "4vh",
              marginLeft: "2%",
              marginTop: "2%",
              marginBottom: "5%",
              width: "96%",
            }}
            color="danger"
            onClick={() => {
              setEntry(null);
              triggerUpdate();
            }}
          >
            Back
          </Button>
        </Col>
      </Row>
    );
  };
  const showNewEntry = () => {
    const addEntry = () => {
      let temp = applications;
      let tempEntry = newEntry;
      tempEntry.title = newTitle;
      tempEntry.company = newCompany;
      tempEntry.contact = newContact;
      tempEntry.link = newLink;
      tempEntry.stage = "Applied";
      tempEntry.notes = [];

      temp = temp.concat(tempEntry);
      console.log(tempEntry);
      console.log(temp);
      setApplications(temp);
      setNewEntry(false);
      setNewTitle("");
      setNewCompany("");
      setNewContact("");
      setNewLink("");
      triggerUpdate(temp, "application");
    };
    const addProperty = (e) => {
      let temp = newEntry;
      console.log(e.target.name);
      console.log(e.target.value);
      if (e.target.name === "title") {
        setNewTitle(e.target.value);
      } else if (e.target.name === "company") {
        setNewCompany(e.target.value);
      } else if (e.target.name === "contact") {
        setNewContact(e.target.value);
      } else if (e.target.name === "link") {
        setNewLink(e.target.value);
      } else {
        throw Error;
      }
      console.log(temp);
      setNewEntry(temp);
    };

    if (newEntry !== false) {
      return (
        <Row style={fullscreen}>
          <Col lg="12" xl={{ size: "10", offset: "1" }}>
            <Card style={bigCard}>
              <CardHeader>
                <p style={{ width: "96%", fontSize: "6vh", margin: "2%" }}>
                  New Application:
                </p>
              </CardHeader>
              <Input
                style={inputElement}
                placeholder="title"
                name="title"
                value={newTitle}
                onChange={(e) => addProperty(e)}
              />
              <Input
                style={inputElement}
                placeholder="company"
                name="company"
                value={newCompany}
                onChange={(e) => addProperty(e)}
              />
              <Input
                style={inputElement}
                placeholder="contact"
                name="contact"
                value={newContact}
                onChange={(e) => addProperty(e)}
              />
              <Input
                style={inputElement}
                placeholder="link"
                name="link"
                value={newLink}
                onChange={(e) => addProperty(e)}
              />
            </Card>
            <Button
              style={{
                marginLeft: "2%",
                marginTop: "2%",
                width: "96%",
                fontSize: "4vh",
              }}
              color="success"
              disabled={newTitle === "" || newCompany === ""}
              onClick={() => addEntry()}
            >
              Add
            </Button>
            <Button
              style={{
                fontSize: "4vh",
                marginLeft: "2%",
                marginTop: "2%",
                marginBottom: "5%",
                width: "96%",
              }}
              color="danger"
              onClick={() => setNewEntry(false)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      );
    }
  };
  const showLoginScreen = () => {
    if (loginScreen === true) {
      return (
        <Row style={fullscreen}>
          <Col xs="12">
            <Card style={{ marginTop: "20%", width: "90%", marginLeft: "5%" }}>
              <h1 style={{ marginLeft: "2%" }}>APPLITRACK</h1>
              <h4 style={{ marginLeft: "2%" }}>
                keep track of your job applications!
              </h4>
              <Input
                style={inputElement}
                placeholder="user"
                value={user}
                onChange={(event) => setUser(event.target.value)}
              />
              <Input
                style={inputElement}
                type="password"
                placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button
                color="danger"
                style={functionButton}
                onClick={() => validate(user, password)}
              >
                Log in
              </Button>
              <p>{warning}</p>
            </Card>
          </Col>
        </Row>
      );
    } else return "";
  };

  //return of App, "routing" through ternary operators
  return (
    <div>
      <Container fluid>
        {loginScreen === true
          ? showLoginScreen()
          : entry === null
          ? newEntry === false
            ? showHomeScreen()
            : showNewEntry()
          : showEntry()}
      </Container>
    </div>
  );
};
export default App;
