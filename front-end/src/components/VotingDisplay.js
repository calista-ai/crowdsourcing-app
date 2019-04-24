import React from 'react';
import Header from './Header.js'
import VotingProcess from './VotingProcess.js'

function VotingDisplay() {

  return (
    <div>
      <Header text="Which design is more attractive?"/>

      <VotingProcess
        votingTime={process.env.REACT_APP_VOTING_TIME}
        totalVotingRounds={process.env.REACT_APP_VOTING_ROUNDS}
      />
    </div>
  )
}


export default VotingDisplay
