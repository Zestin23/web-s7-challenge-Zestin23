import React, { useEffect, useState } from 'react'
import Home from './Home'
import Form from './Form'
import { Routes, Route, Link,  } from 'react-router-dom'
import axios from 'axios'
import { schema } from './Form'
import * as yup from "yup"




function App() {
  return (
    <div id="app">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
