import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Newspaper, Globe, Users, TrendingUp } from "lucide-react"
import { useNavigate } from 'react-router-dom'


const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center h-56"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Icon className="w-12 h-12 text-primary mb-4" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
)

const AnimatedSection = ({ children }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const mainControls = useAnimation()

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
    }, [isInView, mainControls])

    return (
        <motion.div
            ref={ref}
            variants={{
                hidden: { opacity: 0, y: 75 },
                visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 0.5, delay: 0.25 }}
        >
            {children}
        </motion.div>
    )
}

const AboutScreen = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <h1 className="text-5xl font-extrabold text-center mb-8 text-gray-900">
                        About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FaceMook</span>
                    </h1>
                </AnimatedSection>

                <AnimatedSection>
                    <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                        FaceMook is your social hub for connecting with friends, sharing moments, and discovering amazing content
                        from people around the world.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <AnimatedSection>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
                            <p className="text-gray-600 mb-4">
                                At FaceMook, we believe in the power of genuine connections. Our mission is to create a vibrant community
                                where people can freely share their thoughts, experiences, and creativity, while building meaningful relationships
                                and staying connected with those who matter most.
                            </p>
                            <p className="text-gray-600">
                                Founded with passion, we've built a platform that prioritizes user experience, privacy, and authentic
                                interactions. Every feature is designed to bring people closer together.
                            </p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <Globe className="w-6 h-6 mr-2" />
                                    <span>Connecting users across the globe</span>
                                </li>
                                <li className="flex items-center">
                                    <Users className="w-6 h-6 mr-2" />
                                    <span>Empowering communities worldwide</span>
                                </li>
                                <li className="flex items-center">
                                    <Newspaper className="w-6 h-6 mr-2" />
                                    <span>Sharing millions of stories daily</span>
                                </li>
                                <li className="flex items-center">
                                    <TrendingUp className="w-6 h-6 mr-2" />
                                    <span>Growing faster every single day</span>
                                </li>
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>

                <AnimatedSection>
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Why Choose FaceMook?</h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <AnimatedSection>
                        <FeatureCard
                            icon={Users}
                            title="Connect & Share"
                            description="Build genuine connections and share your moments with the people you care about."
                        />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureCard
                            icon={TrendingUp}
                            title="Discover Trends"
                            description="Stay updated with trending posts and discover what's popular in your community."
                        />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureCard
                            icon={Globe}
                            title="Global Community"
                            description="Join millions of users worldwide and be part of a thriving global community."
                        />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureCard
                            icon={Newspaper}
                            title="Express Yourself"
                            description="Share your thoughts, photos, videos, and creativity without limits."
                        />
                    </AnimatedSection>
                </div>

                <AnimatedSection>
                    <div className="text-center">
                        <p className="text-xl text-gray-600 mb-8">
                            Join FaceMook today and become part of a global movement connecting hearts and minds. Your story deserves
                            to be heard, and we're here to help you share it with the world.
                        </p>
                        <motion.button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transition-shadow"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/home')}
                        >
                            Start Exploring
                        </motion.button>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    )
}

export default AboutScreen