// import react and router
import React from 'react'
import {useLocation} from "react-router-dom"

// articles component
function Articles() {
    // get state from location
    const {state}= useLocation()
  

  // return article display
  return (
    <div className='flex  flex-col justify-between  sm:flex-row mt-14'>
         <div className='w-3/5 p-10'>
         <p className='text-4xl mb-10'>{state?.article?.title}</p>
         <p className='text-2xl mb-10'>{state?.article?.content}</p>
            <p className='text-3xl mb-10'>{state?.article?.category}</p>
            <p className='text-4xl mb-10'>{state?.article?.comments}</p>
         </div>
    </div>

  )
}

export default Articles