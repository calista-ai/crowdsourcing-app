import React from 'react'

import '../styles/Header.css'

function Header(props) {

  const textStyle = props.logoDisplay ? null : {'paddingTop': '15px'}

  return (
    <div>
      <header>
      {
        props.logoDisplay ?
        <p className="logo">
          <a href="https://issel.ee.auth.gr/">issel</a>
        </p> :
        null
      }
        <p className="site-title" style={textStyle}>{props.text}</p>
      </header>
    </div>
  )
}


export default Header
