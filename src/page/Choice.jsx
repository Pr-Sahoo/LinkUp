import React from 'react';
import Particles from '../components/Particles';
import BlurText from '../components/BlurText';
import AnimatedContent from '../components/AnimatedContent';
import { Link } from 'react-router-dom';

const Choice = () => {
    return (
        <div className='h-screen w-full relative flex flex-col items-center justify-center'>
            <div className="absolute inset-0 z-0">
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={600}
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
                    text="Choose your chat room 👇🏻"
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
                    delay={500}
                    reverse={false}
                    config={{ tension: 120, friction: 30 }}
                    initialOpacity={0}
                    animateOpacity={true}
                    scale={1.1}
                    threshold={0.2}
                >

                    {/* <Link to='/register'><button type="button" class="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-8 text-white text-6xl font-bold px-12 bg-purple-700 border border-purple-700 rounded-xl shadow-lg hover:bg-purple-800 hover:shadow-purple-500/50 transition-all duration-300 focus:ring-4 focus:ring-purple-300">
                        GET STARTED
                    </button></Link> */}

                    {/* <Link to='/register'><button type="button" class="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-8 text-white text-6xl font-bold px-12 bg-purple-700 border border-purple-700 rounded-xl shadow-lg hover:bg-purple-800 hover:shadow-purple-500/50 transition-all duration-300 focus:ring-4 focus:ring-purple-300">
                        Group chat
                    </button></Link>

                    <Link to='/register'><button type="button" class="ml-7 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-8 text-white text-6xl font-bold px-12 bg-purple-700 border border-purple-700 rounded-xl shadow-lg hover:bg-purple-800 hover:shadow-purple-500/50 transition-all duration-300 focus:ring-4 focus:ring-purple-300">
                        Private chat
                    </button></Link> */}

                    {/* <Link to='/group-chat'>
                        <button className="group transition-all duration-300 relative py-6 px-16 text-white text-3xl sm:text-4xl md:text-5xl font-bold rounded-xl bg-blue-700 shadow-lg
                        hover:bg-blue-800 hover:shadow-blue-500/50 focus:ring-4 focus:ring-blue-300
                        before:absolute before:-inset-1 before:bg-blue-500 before:blur-2xl before:opacity-70
                        before:transition-opacity before:duration-300 hover:before:opacity-100">
                            Group Chat
                        </button>
                    </Link>

                    <Link to='/private-chat'>
                        <button className="group transition-all duration-300 relative py-6 px-16 text-white text-3xl sm:text-4xl md:text-5xl font-bold rounded-xl bg-pink-700 shadow-lg
                        hover:bg-pink-800 hover:shadow-pink-500/50 focus:ring-4 focus:ring-pink-300
                        before:absolute before:-inset-1 before:bg-pink-500 before:blur-2xl before:opacity-70
                        before:transition-opacity before:duration-300 hover:before:opacity-100">
                            Private Chat
                        </button>
                    </Link> */}

                    <Link to='/chatting'>
                        <button
                            type="button"
                            className="mr-6 text-white font-bold px-8 py-6 sm:px-10 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 xl:px-20 xl:py-14 
                                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                                       bg-purple-700 border border-purple-700 rounded-xl shadow-lg
                                       hover:bg-purple-800 transition-all duration-300 focus:ring-4 focus:ring-purple-300
                                       shadow-purple-500/50 hover:shadow-purple-400"
                        >
                            Group Chat
                        </button>
                    </Link>

                    <Link to='/private-chat'>
                        <button
                            type="button"
                            className="mt-6 sm:mt-0 text-white font-bold px-8 py-6 sm:px-10 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 xl:px-20 xl:py-14
                                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                                       bg-blue-700 border border-blue-700 rounded-xl shadow-lg
                                       hover:bg-blue-800 transition-all duration-300 focus:ring-4 focus:ring-blue-300
                                       shadow-blue-500/50 hover:shadow-blue-400"
                        >
                            Private Chat
                        </button>
                    </Link>

                </AnimatedContent>
            </div>
        </div>
    )
}

export default Choice