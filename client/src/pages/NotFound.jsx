import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-600 mb-4" />
      <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-amber-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-amber-700 transition"
      >
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFound;
