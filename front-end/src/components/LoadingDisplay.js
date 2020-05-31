import React from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

import '../styles/LoadingDisplay.css'

function LoadingDisplay() {

    return (
        <div className="loading-display">
            <div className="spinner">
                <BeatLoader
                    size={20}
                    color={"#9ee5f8"}
                />
            </div>
            <div className="description">
                <p>Loading the test. Please wait ...</p>
            </div>
        </div>
    )
}

export default LoadingDisplay