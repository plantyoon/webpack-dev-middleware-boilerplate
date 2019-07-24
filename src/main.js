import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

import './main.scss'

class App extends React.Component {
  render() {
    return <div id="app">
      <h1>Hello React!</h1>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
