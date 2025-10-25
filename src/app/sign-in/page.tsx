"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  if (isSignedIn) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <Code2 className="w-10 h-10 text-indigo-400 mr-2" />
          <h1 className="text-3xl font-bold">AI Coding Companion</h1>
        </div>
        <p className="text-gray-300 max-w-md mx-auto mb-8">
          Your intelligent coding partner — built for students and hackathon developers.
        </p>

        <SignInButton mode="redirect">
          <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            🚀 Sign in with Google
          </button>
        </SignInButton>
      </motion.div>

      <footer className="absolute bottom-5 text-sm text-gray-400">
        © 2025 AI Coding Companion — Built for Hackathons ⚡
      </footer>
    </div>
  );
}
