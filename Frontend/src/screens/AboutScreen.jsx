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
                        About <span className="text-primary">Nuntium</span>
                    </h1>
                </AnimatedSection>

                <AnimatedSection>
                    <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                        Nuntium is your gateway to the world's stories, delivering accurate, timely, and engaging news content
                        across a spectrum of topics.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <AnimatedSection>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
                            <p className="text-gray-600 mb-4">
                                At Nuntium, we believe in the power of information to shape perspectives and drive positive change. Our
                                mission is to provide a comprehensive view of current events and trending stories, empowering our
                                readers to make informed decisions and engage meaningfully with the world around them.
                            </p>
                            <p className="text-gray-600">
                                Founded in 2023, we've quickly established ourselves as a trusted source of news, thanks to our
                                commitment to journalistic integrity and our passion for storytelling.
                            </p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="bg-primary rounded-lg shadow-lg p-8 text-white">
                            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <Globe className="w-6 h-6 mr-2" />
                                    <span>Global reach across 150+ countries</span>
                                </li>
                                <li className="flex items-center">
                                    <Users className="w-6 h-6 mr-2" />
                                    <span>10 million+ monthly active readers</span>
                                </li>
                                <li className="flex items-center">
                                    <Newspaper className="w-6 h-6 mr-2" />
                                    <span>500+ original articles published daily</span>
                                </li>
                                <li className="flex items-center">
                                    <TrendingUp className="w-6 h-6 mr-2" />
                                    <span>Consistently ranked in top 10 news apps</span>
                                </li>
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>

                <AnimatedSection>
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Why Choose Nuntium?</h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <AnimatedSection>
                        <FeatureCard
                            icon={Globe}
                            title="Global Coverage"
                            description="Stay informed about events from every corner of the world."
                        />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureCard
                            icon={TrendingUp}
                            title="Trending Topics"
                            description="Get real-time updates on the most discussed stories."
                        />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureCard
                            icon={Users}
                            title="Expert Analysis"
                            description="Gain insights from our team of seasoned journalists and analysts."
                        />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureCard
                            icon={Newspaper}
                            title="Diverse Content"
                            description="Explore a wide range of topics tailored to your interests."
                        />
                    </AnimatedSection>
                </div>

                <AnimatedSection>
                    <div className="text-center">
                        <p className="text-xl text-gray-600 mb-8">
                            Thank you for choosing Nuntium as your trusted news source. We're committed to keeping you informed,
                            engaged, and inspired.
                        </p>
                        <motion.button
                            className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
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