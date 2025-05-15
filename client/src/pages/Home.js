import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Hero with Video Background */}
      <div className="relative h-[90vh] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          src="/hero-bg.mp4"
        />

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center h-full flex flex-col justify-center items-center px-4 text-white bg-black/50"
        >
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-xl"
          >
            FitTrack
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl mt-6 max-w-2xl mx-auto font-light"
          >
            Your intelligent companion to track meals, workouts, and become a
            better version of yourself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 space-x-6"
          >
            <a
              href="/register"
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-lg shadow hover:bg-gray-100"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600"
            >
              Login
            </a>
          </motion.div>
        </motion.section>
      </div>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-gray-800"
        >
          Why FitTrack Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {["Meal Tracking", "Workout Logs", "Progress Reports"].map(
            (title, index) => (
              <Tilt
                key={index}
                glareEnable={true}
                glareMaxOpacity={0.15}
                scale={1.03}
                transitionSpeed={350}
              >
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white shadow-xl rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={`/${["meal", "workout", "report"][index]}-icon.svg`}
                    alt={title}
                    className="w-16 h-16 mx-auto mb-5"
                  />
                  <h3 className="text-xl font-bold mb-2 text-indigo-600">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {
                      [
                        "Log meals, track macros, and get insights on what you eat.",
                        "Record your workouts and view weekly performance analytics.",
                        "Visualize your health trends with dynamic progress summaries.",
                      ][index]
                    }
                  </p>
                </motion.div>
              </Tilt>
            )
          )}
        </div>
      </section>

      {/* Screenshot Preview */}
      <motion.section
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.7 }}
        className="bg-indigo-50 py-24 text-center px-4"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Your Health, Visualized
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          From calorie tracking to workout history, FitTrack provides a unified
          dashboard that brings all your fitness data into one elegant view.
        </p>
        <img
          src="/dashboard-preview.png"
          alt="App Preview"
          className="mx-auto rounded-2xl shadow-2xl w-full max-w-5xl"
        />
      </motion.section>

      {/* Testimonials */}
      <section className="py-24 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          Trusted by Real Users
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            "Alex G., Runner",
            "Priya V., Nutrition Coach",
            "Jordan S., Student",
          ].map((name, i) => (
            <Tilt
              key={i}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable={true}
              glareMaxOpacity={0.1}
            >
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.4, delay: i * 0.2 }}
                className="bg-gray-50 p-6 rounded-2xl shadow-md w-80"
              >
                <p className="italic text-gray-700">
                  {
                    [
                      "FitTrack changed my lifestyle. I eat better, I feel stronger.",
                      "Tracking my food became effortless. This is gold.",
                      "Finally an app that doesn’t overwhelm me. Simple & effective.",
                    ][i]
                  }
                </p>
                <p className="mt-4 text-sm text-gray-500">– {name}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">
          © 2025 FitTrack · Built with 💪 and ☕ by Sairam
        </p>
        <div className="mt-2 space-x-4 text-xs">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            GitHub
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
