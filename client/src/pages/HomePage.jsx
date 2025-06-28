import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg')`,
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Expert Legal <span className="text-amber-400">Representation</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            With over 25 years of experience, we deliver exceptional legal
            services tailored to protect your interests and secure your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-amber-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-amber-700 transform hover:scale-105 transition"
            >
              Get Free Consultation
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Client Testimonials
            </h2>
            <p className="text-xl text-gray-300">
              What our clients say about our legal services
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Business Owner",
                content:
                  "Sterling & Associates helped me navigate a complex business acquisition. Their expertise and attention to detail were exceptional.",
              },
              {
                name: "Michael Chen",
                role: "Individual Client",
                content:
                  "After my accident, they fought tirelessly to get me the compensation I deserved. I couldn't have asked for better representation.",
              },
              {
                name: "Emily Rodriguez",
                role: "Family Client",
                content:
                  "During my divorce proceedings, they provided compassionate yet strong advocacy. They truly cared about my family's wellbeing.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-gray-200 p-8 rounded-lg">
                <p className="text-black mb-6 italic">"{t.content}"</p>
                <div>
                  <div className="font-semibold text-amber-400">{t.name}</div>
                  <div className="text-sm text-black">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
