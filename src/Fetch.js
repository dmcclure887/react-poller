import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";

// formatted with https://prettier.io/

class Fetch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      stop: false,
      start: false,
      paused: false,
      seconds: 0,
    };
    this.apiUrl = "http://worldclockapi.com/api/json/est/now";
    this.emptyStr = "";
    this.handleClick = this.handleClickQuery.bind(this);
    this.queryApi = this.queryApi.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickStop = this.handleClickStop.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);
  }

  queryApi() {
    var existingValue = this.state.data;
    fetch(this.apiUrl)
      .then((res) => res.json())
      .then((data) => {
        existingValue += data["currentDateTime"] + ", ";
        this.setState({ data: existingValue, stop: true });
      })
      .catch(console.log);
  }

  handleClickQuery() {
    if (!this.state.stop) {
      this.setState({
        data: this.emptyStr,
        stop: false,
        start: true,
        seconds: parseInt(this.state.seconds),
      });
      this.intervalId1 = setInterval(() => this.queryApi(), 1000);
      this.intervalId2 = setInterval(() => this.tick(), 1000);
    }
  }

  handleClickPause() {
    if (this.state.paused) {
      this.intervalId1 = setInterval(() => this.queryApi(), 1000);
      this.intervalId2 = setInterval(() => this.tick(), 1000);
    } else {
      clearInterval(this.intervalId1);
      clearInterval(this.intervalId2);
    }
    this.setState({
      data: this.state.data,
      stop: true,
      start: true,
      paused: !this.state.paused,
      seconds: parseInt(this.state.seconds),
    });
    console.log("pause state:" + this.state.paused);
  }

  handleClickStop() {
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
    this.setState({
      data: this.state.data,
      stop: true,
      start: true,
      paused: false,
      seconds: parseInt(this.state.seconds),
    });
  }

  handleClickClear() {
    this.setState({
      data: this.emptyStr,
      stop: false,
      start: true,
      paused: false,
      seconds: 0,
    });
  }

  handleClickReset() {
    this.handleClickStop();
    this.setState({
      data: this.emptyStr,
      stop: false,
      start: false,
      paused: false,
      seconds: 0,
    });
  }

  tick() {
    this.setState((state) => ({
      seconds: state.seconds + 1,
    }));
  }

  formatTime(secs) {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    return [hours, minutes, seconds]
      .map((v) => ("" + v).padStart(2, "0"))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  }

  render() {
    var navbarRow = (
      <Row>
        <Col xs={6} md={4}>
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#home">
              React Web Poller, made with React Bootstrap
            </Navbar.Brand>
          </Navbar>
        </Col>
      </Row>
    );

    if (!this.state.start) {
      return (
        <Container fluid>
          {navbarRow}
          <br></br>
          <Row>
            <Col xs={2} md={2}>
              <Image
                src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark.png"
                fluid
              />
              <br></br>
              <br></br>
            </Col>
          </Row>
          <Row></Row>
          <Row>
            <Col xs={6} md={4}>
              <Button
                variant="primary"
                onClick={this.handleClickQuery.bind(this)}
              >
                Query API
              </Button>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container fluid>
          {navbarRow}
          <br></br>
          <Row>
            <Col xs={6} md={4}>
              <Button
                variant="primary"
                onClick={this.handleClickQuery.bind(this)}
              >
                Query API
              </Button>{" "}
              <Button
                variant="primary"
                onClick={this.handleClickPause.bind(this)}
              >
                Pause
              </Button>{" "}
              <Button
                variant="primary"
                onClick={this.handleClickStop.bind(this)}
              >
                Stop
              </Button>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs={6} md={4}>
              <Button
                variant="primary"
                onClick={this.handleClickClear.bind(this)}
              >
                Clear
              </Button>{" "}
              <Button
                variant="primary"
                onClick={this.handleClickReset.bind(this)}
              >
                Reset
              </Button>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs={6} md={4}>
              <h5>Run time:</h5>
              <p>{this.formatTime(this.state.seconds)}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
              <h5>Data:</h5>
              <p>{this.state.data}</p>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default Fetch;