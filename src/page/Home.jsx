import React from 'react';
import Particles from '../components/Particles';
// import Register from './Register';
import BlurText from '../components/Blurtext';
import AnimatedContent from '../components/AnimatedContent';
import { Link } from 'react-router-dom';
// import Footer from '../components/Footer';

const Home = () => {

  return (
    <div className="h-screen w-full relative flex flex-col items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
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
      </div>

      {/* Blur Text (Ensuring it's above Particles) */}
      <div className="relative z-10">
        <BlurText
          text="Welcome to ChatSphere 🙋🏻‍♀️"
          delay={150}
          animateBy="words"
          direction="top"
          // onAnimationComplete={handleAnimationComplete}
          className="italic text-white font-bold mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center text-4xl"
        />
      </div>
      <div className='relative z-10 mt-16'>
        <AnimatedContent
          distance={100}
          direction="vertical"
          delay={1500}
          reverse={false}
          config={{ tension: 120, friction: 30 }}
          initialOpacity={0}
          animateOpacity={true}
          scale={1.1}
          threshold={0.2}
        >
          {/* <div className='text-4xl'>Get Started</div> */}
          {/* <button type="button" class="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-8xl px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">Purple</button> */}
          {/* <Link to='/register'><button type="button" class="text-white text-6xl font-bold px-10 py-6 bg-purple-700 border border-purple-700 rounded-xl shadow-lg hover:bg-purple-800 hover:shadow-purple-500/50 transition-all duration-300 focus:ring-4 focus:ring-purple-300">
            GET STARTED
          </button></Link> */}

          <Link to='/register'><button type="button" class="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-8 text-white text-6xl font-bold px-12 bg-purple-700 border border-purple-700 rounded-xl shadow-lg hover:bg-purple-800 hover:shadow-purple-500/50 transition-all duration-300 focus:ring-4 focus:ring-purple-300">
            GET STARTED
          </button></Link>

        </AnimatedContent>
      </div>
      {/* <Footer className='relative z-10 w-full bg-black text-white text-center p-4 shadow-md border-t border-gray-700'/> */}
    </div>

  )
}
export default Home