import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700
        disabled:opacity-50 disabled:cursor-not-allowed
        text-white font-semibold rounded-lg
        shadow-md hover:shadow-lg transition duration-300
        ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
