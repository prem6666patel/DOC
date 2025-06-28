import React from "react";
import { CheckCircle } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            25+ Years of Legal Excellence
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Sterling & Associates has been serving clients with dedication,
            integrity, and exceptional legal expertise since 1998.
          </p>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600">Cases Won</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              "AV Preeminent Rating by Martindale-Hubbell",
              "Super Lawyers Recognition",
              "State Bar Association Member",
              "National Trial Lawyers Association",
            ].map((cred, i) => (
              <div key={i} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                <span className="text-gray-700">{cred}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
            alt="Attorney"
            className="rounded-lg shadow-xl w-full h-96 object-cover"
          />
          <div className="absolute -bottom-8 -left-8 bg-amber-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">Free</div>
            <div className="text-sm">Initial Consultation</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
