'use client'

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
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
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our wide range of rental properties tailored to meet your lifestyle and needs!
          </p>
          <div className="flex justify-center">
            <Input
              type="text"
              value='Search query'
              onChange={() => {}}
              placeholder="search by city, neighbourhood or address"
              className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
            />
            <Button
              onClick={() => {}}
              className="bg-red-400 text-white text-lg rounded-none rounded-r-xl border-none hover:bg-red-500 h-12"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
