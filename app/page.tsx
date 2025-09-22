"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import { BACKEND_URL as backendURL } from "../constants/constant";

const poppins = Poppins({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function LandingPage() {
  return (
    <main
      className={`relative min-h-screen flex flex-col md:flex-row items-center justify-between 
                  px-6 sm:px-10 lg:px-20 py-10 pb-28 bg-[#0f0f0f] text-white overflow-hidden
                  ${poppins.variable} font-poppins`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8A2BE2]/40 via-[#FF69B4]/30 to-[#FFD700]/30 animate-gradient-xy"></div>

      {/* Decorative shapes */}
      <div className="absolute top-16 left-16 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center gap-4 py-4 px-6 sm:px-10 lg:px-20 z-20">
        {/* Logo / Brand */}
        <h2 className="flex-shrink-0 text-xl sm:text-2xl font-bold text-yellow-300">
          RonilTodo
        </h2>

        {/* Tagline Badge */}
        <span className="px-4 py-1 text-xs sm:text-sm rounded-full bg-yellow-300/20 text-yellow-200 font-medium border border-yellow-300/30 whitespace-nowrap">
          🎉 100% Free to Use
        </span>
      </header>

      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-start w-full md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-10 mt-16 md:mt-0"
      >
        <h1 className="text-3xl sm:text-3xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight">
          <span className="block text-white">Ronil Todo</span>
          <span className="block text-yellow-300">App Software</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl mb-8 text-gray-200 max-w-lg leading-relaxed">
          A web application to organize your tasks, stay productive, and achieve your goals — designed with simplicity and efficiency in mind.
        </p>

        {/* Login Button */}
        <a href={`${backendURL}/api/auth/google`} className="inline-block cursor-pointer">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 cursor-pointer bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 
                       text-gray-900 font-semibold rounded-full shadow-lg
                       hover:shadow-yellow-300/40 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-yellow-300/50 flex items-center space-x-3"
          >
            <span className="text-xl">🚀</span>
            <span>Sign in with Google</span>
          </motion.button>
        </a>
      </motion.div>

      {/* Right Section: Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="relative z-10 flex justify-center items-center w-full md:w-1/2 
                    h-[200px] sm:h-[280px] md:h-[420px] lg:h-[500px] xl:h-[550px] mt-8 md:mt-0"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="/illustration.png"
            alt="Todo Illustration"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="w-full z-10 mt-10 md:mt-0 md:absolute md:bottom-0 left-0"
      >
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
        <div className="text-center py-4 text-xs sm:text-sm text-gray-300">
          <p>
            Developed by{" "}
            <span className="font-semibold text-white">Ken Obul</span> •{" "}
            <a
              href="mailto:kenobul@mpikenya.org"
              className="underline hover:text-yellow-300 transition-colors duration-300"
            >
              kenobul@mpikenya.org
            </a>
          </p>
          <p className="mt-1 opacity-75">
            © {new Date().getFullYear()} RonilTodo. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </main>
  );
}
