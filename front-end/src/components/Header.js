import React from 'react'

import '../styles/Header.css'

function Header(props) {
  return (
    <div>
      <header>
        <p>{props.text}</p>
      </header>
    </div>
  )
}


export default Header
