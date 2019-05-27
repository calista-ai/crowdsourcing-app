import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header.js'
import { isMobile } from 'react-device-detect'

import '../styles/IntroDisplay.css'
import demoGif from '../assets/demo.gif'
import rotateDeviceGif from '../assets/rotateDevice.gif'

class IntroDisplay extends Component {

  constructor() {
    super()

    this.state = {
      orientation: "landscape"
    }

    this.updateOrientation = this.updateOrientation.bind(this)
  }

  componentDidMount() {
    // detect if the device is mobile or tablet
    if (isMobile) {
      window.addEventListener("resize", this.updateOrientation)
      this.updateOrientation()
    }
  }

  updateOrientation() {
    if (window.innerWidth < window.innerHeight) {
      this.setState({ orientation: "portrait" })
    }
    else {
      this.setState({ orientation: "landscape" })
    }
  }

  render() {
    const votingTime = process.env.REACT_APP_VOTING_TIME
    const totalVotingRounds = process.env.REACT_APP_VOTING_ROUNDS

    if (this.state.orientation === "portrait") {
      return (
        <div className="device_orientation_message">
          <h3>Please rotate your device and stay in landscape position
            for the rest of the voting session.</h3>
          <img src={rotateDeviceGif} alt="rotateDeviceInstruction"/>
        </div>
      )

    }
    else {

      let keyPointStyle = {
        color: 'green',
        fontWeight: 'bold'
      }

      return (
        <div>
          <Header text="Understanding web visual preferences" />
          <div className="text">
            <div className="title">
              <h3>Welcome to our voting platform!</h3>
            </div>
            <div className="intro">
              <h4>What is this about?</h4>
              <p>You are about to take a test concerning webpage visual preferences.
                Your contribution to our research allows us to learn more about webpage aesthetics.
                The purpose of this platform is to collect sufficient data to fulfil our goal.</p>

              <h4>What will you have to do?</h4>
              <p>Two webpages will be displayed at the same time repeatedly for {totalVotingRounds} times.
                Each time your task is to vote <span style={keyPointStyle}>which webpage you
                find visually more attractive</span> by clicking on it.
                <br />
                For each comparison between two webpages you will
                have <span style={keyPointStyle}>approximately {votingTime} seconds</span>.
                You can take a look at the following example.</p>
              <div className="demo">
                <img src={demoGif} alt="example"/>
              </div>
              <h4>Privacy and Data Collection</h4>
              <p>We will not ask you any personal information, so your anonymity is ensured.
                Any data we collect will be securely stored.</p>

              <h4>Contact information</h4>
              <p>For bug reports or any other information,
                you may contact us at adelitzas@ece.auth.gr.</p>

              <br />
              <div className="button-to-start">
                <Link to="/voting">
                  <button type="button"><span>{"Let's start!"}</span></button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

  }

  componentWillUnmount() {
    // detect if the device is mobile or tablet 
    if (isMobile) {
      window.removeEventListener("resize", this.updateOrientation)
    }
  }

}


export default IntroDisplay
