import React from 'react';
import VotingProcess from './VotingProcess.js'

function VotingDisplay() {

  return (
    <div>
      <VotingProcess
        votingTime={process.env.REACT_APP_VOTING_TIME}
        totalVotingRounds={process.env.REACT_APP_VOTING_ROUNDS}
      />
    </div>
  )
}


export default VotingDisplay
