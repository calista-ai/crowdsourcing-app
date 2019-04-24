import React, { Component } from 'react'

import '../styles/CountdownTimer.css'

class CountdownTimer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeRemainingInSeconds: props.startTimeInSeconds,
      votingRound: props.votingRound,
      startTimer: false
    }

    this.decrementTime = this.decrementTime.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  decrementTime() {
    if (this.state.timeRemainingInSeconds > 0) {
      this.setState(prevState => {
          return {
            timeRemainingInSeconds: prevState.timeRemainingInSeconds - 1
          }
      });
    }
    else {
      clearInterval(this.timer);
      this.props.handleTimeout();

    }
  }

  startTimer() {
    this.timer = setInterval(() => {
          this.decrementTime();
      }, 1000);
    this.setState({ timerStarted: true})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.startTimer === false && this.props.startTimer === true) {
      this.startTimer()
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const styleTimeIsRunningOut =
      (this.state.timeRemainingInSeconds < 3) ? { color: "red" } : null;

    return (
      <div className="countdown-timer">
        <div className="countdown-timer__outer-circle">
          <div className="countdown-timer__circle">
            <svg>
              <circle
                r="24"
                cx="26"
                cy="26"
                style={
                        this.state.timerStarted
                        ? {
                            animation: `countdown-animation ${this.props
                              .startTimeInSeconds}s linear`
                          }
                        : null
                      }
              />
            </svg>
          </div>
          <div className="countdown-timer__text" style={styleTimeIsRunningOut}>
            {this.state.timerStarted ? this.state.timeRemainingInSeconds : null}
          </div>
        </div>
      </div>
    );
  }
}

export default CountdownTimer
