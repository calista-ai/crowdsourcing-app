import React, { Component } from 'react'

import '../styles/ImageContainer.css'

class ImageContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageLoaded: false
    }

    this.handleImageWhenLoaded = this.handleImageWhenLoaded.bind(this)
  }

  handleImageWhenLoaded(imageId) {
    this.setState({ imageLoaded: true })

    this.props.handleImageLoading(imageId)

  }

  render() {
    const className = "image-container " + this.props.position
    const imagePath = process.env.PUBLIC_URL + '/images/' + this.props.imageId + '.png'

    return (
      <div className={className} onClick={(event) => this.props.handleImageClick(this.props.imageId)}>
        {
          !this.state.imageLoaded
          ? (<img src="http://via.placeholder.com/1366x694?text=Image+Loading" alt="Loading ..." />)
          : null
        }
        <img
          src={imagePath}
          style={!this.state.imageLoaded ? {display: 'none'} : null}
          alt={this.props.imageId}
          onLoad={(event) => this.handleImageWhenLoaded(this.props.imageId)}
        />
      </div>
    )
  }
}


export default ImageContainer
