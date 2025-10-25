"use client";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-800 to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Join AI Coding Companion</h1>
        <p className="text-gray-300 mb-6">Create your account in seconds</p>

        <SignUpButton mode="redirect">
          <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold transition-all shadow-lg">
            ✨ Sign up with Google
          </button>
        </SignUpButton>
      </motion.div>
    </div>
  );
}
