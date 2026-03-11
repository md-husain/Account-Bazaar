import React from 'react'
import Title from './Title'
import {useSelector} from 'react-redux'
import ListingCard from './ListingCard'

function LatestListings() {

    const {listings} = useSelector(state => state.listing)

  return (
    <div className='mt-20 mb-8' >
      <Title title="Latest Listings" description="Discover the Latest social profiles available right now."/>

      <div className='flex flex-col gap-6 px-6'>
        {listings.slice(0,4).map((listing,idx)=>(
           <div key={idx} className='mx-auto w-full max-w-3xl rounded-xl'>
           <ListingCard listing={listing}/>
           </div>
        )) }   
      </div>
    </div>
  )
}

export default LatestListings
