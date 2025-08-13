import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-full w-full bg-white rounded-lg shadow-lg p-10">
        {isLogin ? (
          <>
            <Login />
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <Register />
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Log in here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
