import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Globe, Users, Newspaper, TrendingUp } from "lucide-react"
import { useNavigate } from 'react-router-dom'

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

const values = [
    {
        title: "Connect & Share",
        description: "Build genuine connections and share your moments with the people you care about.",
    },
    {
        title: "Discover Trends",
        description: "Stay updated with trending posts and discover what's popular in your community.",
    },
    {
        title: "Global Community",
        description: "Join millions of users worldwide and be part of a thriving global community.",
    },
    {
        title: "Express Yourself",
        description: "Share your thoughts, photos, videos, and creativity without limits.",
    },
]

const team = [
    {
        name: "Ikram Sadouq",
        role: "Co-Founder & CEO",
        bio: "Visionary leader with 15+ years in social technology",
    },
    {
        name: "Daha Mohamed Amine",
        role: "Co-Founder & CTO",
        bio: "Engineering expert focused on scalability and security",
    },
]

const AboutScreen = () => {
    const navigate = useNavigate()
    
    return (
        <main className="min-h-screen bg-background">
            <section className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
                    <div className="space-y-6">
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-balance leading-tight text-gray-900">
                            About{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                FaceRam
                            </span>
                        </h1>
                        <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto text-balance">
                            FaceRam is your social hub for connecting with friends, sharing moments, and discovering amazing content
                            from people around the world.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Our Mission - Full Width Card */}
                    <AnimatedSection>
                        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl mb-16">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100 to-transparent"></div>
                            <div className="relative p-10 md:p-16">
                                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
                                    OUR MISSION
                                </span>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 max-w-2xl">
                                    Building bridges between <span className="text-blue-600">people</span> and <span className="text-purple-600">possibilities</span>
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        At FaceRam, we believe in the power of genuine connections. Our mission is to create a vibrant
                                        community where people can freely share their thoughts, experiences, and creativity.
                                    </p>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Founded with passion, we've built a platform that prioritizes user experience, privacy, and
                                        authentic interactions. Every feature is designed to bring people closer together.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Our Impact - Horizontal Stats */}
                    <AnimatedSection>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <motion.div 
                                className="relative group"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                                    <Globe className="w-10 h-10 mx-auto mb-3 opacity-90" />
                                    <div className="text-3xl font-bold mb-1">190+</div>
                                    <div className="text-sm text-blue-100">Countries</div>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="relative group"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                                <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                                    <Users className="w-10 h-10 mx-auto mb-3 opacity-90" />
                                    <div className="text-3xl font-bold mb-1">10M+</div>
                                    <div className="text-sm text-purple-100">Active Users</div>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="relative group"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                                <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
                                    <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-90" />
                                    <div className="text-3xl font-bold mb-1">50M+</div>
                                    <div className="text-sm text-indigo-100">Posts Daily</div>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="relative group"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                                <div className="relative bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white text-center">
                                    <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-90" />
                                    <div className="text-3xl font-bold mb-1">99%</div>
                                    <div className="text-sm text-pink-100">Satisfaction</div>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <section className="py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose FaceRam?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <AnimatedSection key={value.title}>
                                <motion.div
                                    className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center h-56"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        {team.map((member) => (
                            <AnimatedSection key={member.name}>
                                <motion.div
                                    className="group cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="h-64 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 mb-4 flex items-center justify-center group-hover:shadow-lg transition-all">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-white/30 mx-auto"></div>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                                    <p className="text-sm text-blue-600 font-medium mb-2">{member.role}</p>
                                    <p className="text-sm text-gray-600">{member.bio}</p>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="relative rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 75 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-12 sm:p-16 text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">Join FaceRam today</h2>
                            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                                Join FaceRam today and become part of a global movement connecting hearts and minds. Your story
                                deserves to be heard, and we're here to help you share it with the world.
                            </p>
                            <motion.button
                                className="px-8 py-3 rounded-full bg-white text-blue-600 font-bold text-lg hover:shadow-lg transition-shadow"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/home')}
                            >
                                Start Exploring
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}

export default AboutScreen