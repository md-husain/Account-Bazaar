import { PricingTable } from '@clerk/react'
import React from 'react'

function Plan() {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30 max-md px-4'>
      <div className='text-center'>
      <h2 className='text-grey-700 text-4xl font-semibold'>Choose Your Plan</h2>
      <p className='text-grey-500 text-sm max-w-md mx-auto'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs</p>
    </div>
    <div className='mt-16'>
        <PricingTable /> 
    </div>
    </div>
    
  )
}

export default Plan
