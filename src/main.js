import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

import './main.scss'

const App = () => <>
  <h1>Hello React!</h1>
</>

ReactDOM.render(<App />, document.getElementById('app'))
