'use client'

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful platform background"
        className="object-cover object-center"
        priority
        fill
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-full"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
