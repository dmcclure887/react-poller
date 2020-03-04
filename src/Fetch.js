import React from 'react';

class Fetch extends React.Component {

 constructor(props) {
        super(props)
        this.state = {
            users: [],
            done: false,
            start: false,
            seconds: parseInt(props.startTimeInSeconds, 10) || 0
        }
        this.handleClick = this.handleClickQuery.bind(this);
        this.handleClickClear = this.handleClickClear.bind(this);

    }

    queryApi() {
        var existingValue = this.state.users;
        fetch('http://jsonplaceholder.typicode.com/todos')
        .then(res => res.json())
        .then((data) => {
            existingValue = existingValue + JSON.stringify(data).substring(1,5);
            this.setState({ users: existingValue, done: true })
            //console.log(this.state.users)
            console.log('FETCHED')
        })
        .catch(console.log)
    }

    handleClickQuery() {
          this.setState({ users: '', done: false, start: true, seconds: 0 })
          this.queryApi(); // also load one immediately
    }

    handleClickClear() {
        this.setState({ users: '', done: false, start: false })
    }

      tick() {
        this.setState(state => ({
          seconds: state.seconds + 1
        }));
      }

      componentDidMount() {
          this.intervalId = setInterval(() => this.queryApi(), 1000);
          this.queryApi(); // also load one immediately
        this.interval = setInterval(() => this.tick(), 1000);
      }

      componentWillUnmount() {
      clearInterval(this.intervalId);
        clearInterval(this.interval);
      }

    formatTime(secs) {
        let hours   = Math.floor(secs / 3600);
        let minutes = Math.floor(secs / 60) % 60;
        let seconds = secs % 60;
        return [hours, minutes, seconds]
            .map(v => ('' + v).padStart(2, '0'))
            .filter((v,i) => v !== '00' || i > 0)
            .join(':');
      }

    render() {
        if(!this.state.start) {
            return (
                <div>
                    <button onClick={this.handleClick}>Query API</button>
                    <h2>Waiting...</h2>
                </div>
            )
        } else {
            return (
                <div>
                    <button onClick={this.handleClickQuery}>Query API</button>
                    <button onClick={this.handleClickClear}>Clear</button>
                    <p>Run time: {this.formatTime(this.state.seconds)}</p>
                    <p>Users: {this.state.users}</p>
                </div>
            )
        }
    }



}

export default Fetch;