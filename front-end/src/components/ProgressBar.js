import React from 'react';
import { ProgressBar as ProgressBarComponent} from 'react-bootstrap'

import '../styles/bootstrap.min.css'

function ProgressBar(props) {

  const totalVotingRounds = parseInt(props.totalVotingRounds)
  const votingRound = parseInt(props.votingRound)

  const now = (votingRound - 1) / totalVotingRounds * 100

  return (
    <div>
      <ProgressBarComponent
        variant="custom"
        now={now}
        label={(now === 0) ? null : `${votingRound-1} / ${totalVotingRounds} Completed`}
      />
    </div>
  )
}


export default ProgressBar
