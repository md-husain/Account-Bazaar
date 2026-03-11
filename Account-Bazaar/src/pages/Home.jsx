import React from 'react'
import HeroSection from '../components/HeroSection'
import LatestListings from '../components/LatestListings'
import Plan from '../components/Plan'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
      <HeroSection/>
      <LatestListings />
      <Plan />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home
