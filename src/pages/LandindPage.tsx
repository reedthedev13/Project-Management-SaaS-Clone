import React from "react";
import { Link } from "react-router-dom";
import AnimatedWrapper from "../components/AnimatedWrapper";

const LandingPage: React.FC = () => {
  return (
    <AnimatedWrapper className=" bg-white rounded shadow-md">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-6">
        <h1 className="text-5xl font-extrabold mb-6 text-center max-w-3xl">
          Welcome to Reed's Project Management App
        </h1>
        <p className="text-lg max-w-xl mb-10 text-center">
          Manage your projects, tasks, and team with ease.
        </p>
        <div className="flex space-x-6">
          <Link
            to="/auth"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            Get Started
          </Link>
          <Link
            to="/auth"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default LandingPage;
