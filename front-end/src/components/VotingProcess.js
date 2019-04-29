import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoadingScreen from 'react-loading-screen'
import ImageContainer from './ImageContainer.js'
import CountdownTimer from './CountdownTimer.js'
import ProgressBar from './ProgressBar.js'
import API from '../api.js'

class VotingProcess extends Component {

  constructor()
  {
    super()
    this.state = {
      votingRound: 1,
      imageLeftId: 0,
      imageRightId: 0,
      votingCompleted: false,
      _id: "",
      imageLeftLoaded: false,
      imageRightLoaded: false
    }

    this.handleImageClick = this.handleImageClick.bind(this)
    this.updateVotingRound = this.updateVotingRound.bind(this)
    this.addVote = this.addVote.bind(this)
    this.handleTimeout = this.handleTimeout.bind(this)
    this.handleImageLoading = this.handleImageLoading.bind(this)

    this.imageLeftIds = []
    this.imageRightIds = []

  }


  componentDidMount() {
    API.post(`votes/start_session`, { d: new Date() })
      .then(res => {
         this.imageLeftIds = res.data.imageLeftIds
         this.imageRightIds = res.data.imageRightIds

         // DEBUGGING PURPOSES
         // console.log(this.imageLeftIds + '\n' + this.imageRightIds)
         // console.log('New vote sessions created: ' + res.data._id)

         this.setState({
           _id: res.data._id,
           imageLeftId: this.imageLeftIds[0],
           imageRightId: this.imageRightIds[0]
         })
      })
  }

  updateVotingRound() {

    if (this.state.votingRound === parseInt(this.props.totalVotingRounds)) {

      // DEBUGGING PURPOSES
      // console.log('END VOTING')

      this.setState({ votingCompleted: true })
    }
    else {
      this.setState(prevState => {
        return {
          votingRound: prevState.votingRound + 1,
          imageLeftLoaded: false,
          imageRightLoaded: false,
          imageLeftId: this.imageLeftIds[prevState.votingRound],
          imageRightId: this.imageRightIds[prevState.votingRound]
        }
      })
    }
  }

  addVote(newVote) {
    let isLastVotingRound =
      (this.state.votingRound === parseInt(this.props.totalVotingRounds))

    API.post(`votes/add/` + this.state._id, newVote)
      .then(res => {
        // DEBUGGING PURPOSES
        // console.log(res.data)

        if (isLastVotingRound) {
          API.post(`votes/submit/` + this.state._id)
          
            // DEBUGGING PURPOSES
            // .then(res => {
            //   console.log(res.data)
            // })
        }
      })
  }

  handleImageClick(imageId) {

    if (this.state.imageLeftLoaded && this.state.imageRightLoaded)
    {
      // DEBUGGING PURPOSES
      // console.log('----- Round: ' + this.state.votingRound + ' -----')
      // console.log(this.state.imageLeftId + " vs " + this.state.imageRightId + " -> " + imageId)

      const newVote = {
        imL: this.state.imageLeftId,
        imR: this.state.imageRightId,
        imC: imageId
      }

      this.addVote(newVote)

      this.updateVotingRound()
    }
  }

  handleTimeout() {

    // DEBUGGING PURPOSES
    // console.log('----- Round: ' + this.state.votingRound + ' -----')
    // console.log(this.state.imageLeftId + " vs " + this.state.imageRightId + " -> Timeout")

    const newVote = {
      imL: this.state.imageLeftId,
      imR: this.state.imageRightId,
      imC: -1
    }

    this.addVote(newVote)

    this.updateVotingRound()
  }

  handleImageLoading(imageId) {
    if (imageId === this.state.imageLeftId) {
      this.setState({ imageLeftLoaded: true })

      // DEBUGGING PURPOSES
      // console.log('Left image loaded ' + this.state.imageLeftId)
    }
    else if (imageId === this.state.imageRightId) {
      this.setState({ imageRightLoaded: true })

      // DEBUGGING PURPOSES
      // console.log('Right image loaded ' + this.state.imageRightId)
    }
    else {

      // DEBUGGING PURPOSES
      // console.log('Error: Cannot recognize imageId...')
    }
  }

  render() {

    if (this.state.votingCompleted) {
      return ( <Redirect push to="/ending" /> )
    }
    else if (this.state._id === "") {
      return (
        <LoadingScreen
          loading={true}
          bgColor='#f1f1f1'
          spinnerColor='#9ee5f8'
          textColor='#676767'
          text='Loading the test. Please wait ...'
          children=''
        />
      )
    }
    else {
      return (
        <div>
          <ProgressBar
            votingRound={this.state.votingRound}
            totalVotingRounds={this.props.totalVotingRounds}
             />
          <CountdownTimer
            startTimeInSeconds={this.props.votingTime}
            handleTimeout={this.handleTimeout}
            startTimer={(this.state.imageLeftLoaded && this.state.imageRightLoaded)}
            key={this.state.votingRound}
          />
          <br />
          <div className="row">
            <div className="column">
              <ImageContainer
                imageId={this.state.imageLeftId}
                position="left"
                handleImageClick={this.handleImageClick}
                handleImageLoading={this.handleImageLoading}
                key={this.state.votingRound}
              />
            </div>

            <div className="column">
              <ImageContainer
                imageId={this.state.imageRightId}
                position="right"
                handleImageClick={this.handleImageClick}
                handleImageLoading={this.handleImageLoading}
                key={this.state.votingRound}
              />
            </div>
          </div>

        </div>
      )
    }

  }
}


export default VotingProcess
