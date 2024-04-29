import React from 'react'
import pizza from './images/pizza.jpg'
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/order")
  }
  
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      <img alt="order-pizza" onClick={handleClick} style={{ cursor: 'pointer' }} src={pizza} />
    </div>
  )
}

export default Home
