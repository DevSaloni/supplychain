import React from 'react'

import HeroSection from '../component/HeroSection';
import HowItWorkSection from '../component/HowItWorkSection';
import Feature from '../component/Feature';
import DemoPreview from "../component/DemoPreview";

const Home = () => {
  return (
    <div>
     <HeroSection/>
     <DemoPreview/>
     <HowItWorkSection/>
     <Feature/>
    </div>
    
  )
}

export default Home