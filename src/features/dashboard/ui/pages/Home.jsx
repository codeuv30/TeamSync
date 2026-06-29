import React from 'react'
import { useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch();

  return (
    <div className='min-h-screen w-full'>
      <h1>This is my dashboard page</h1>
    </div>
  )
}

export default Home