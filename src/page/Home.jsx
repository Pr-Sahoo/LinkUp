import React from 'react';
import Particles from '../components/Particles';
import Register from './Register';

const Home = () => {
  return (
    // <div className='h-screen w-full text-black flex items-center justify-center' style={{background: "#66A5AD"}}>Home</div>
    <div className='h-screen w-full relative'>
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      <div className='chat-container'>
        <Register />
      </div>
    </div>
  )
}

export default Home