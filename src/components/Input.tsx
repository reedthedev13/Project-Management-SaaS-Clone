import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-5 py-3 border rounded-lg
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500
          transition duration-300
          ${
            error
              ? "border-red-600 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 font-semibold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
