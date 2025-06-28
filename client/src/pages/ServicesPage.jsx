import React from "react";
import {
  Scale,
  Shield,
  Users,
  Award,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

const services = [
  {
    icon: <Scale className="h-12 w-12 text-amber-600" />,
    title: "Corporate Law",
    description:
      "Comprehensive business legal services including contract negotiation, mergers, acquisitions, and corporate governance.",
    features: ["Contract Review", "M&A Transactions", "Corporate Compliance"],
  },
  {
    icon: <Shield className="h-12 w-12 text-amber-600" />,
    title: "Criminal Defense",
    description:
      "Aggressive defense representation for all criminal charges, from misdemeanors to serious felonies.",
    features: ["DUI Defense", "White Collar Crime", "Appeals"],
  },
  {
    icon: <Users className="h-12 w-12 text-amber-600" />,
    title: "Family Law",
    description:
      "Compassionate legal guidance through divorce, custody, adoption, and other family legal matters.",
    features: ["Divorce Proceedings", "Child Custody", "Adoption Services"],
  },
  {
    icon: <Award className="h-12 w-12 text-amber-600" />,
    title: "Personal Injury",
    description:
      "Maximum compensation for accident victims, including auto accidents, medical malpractice, and workplace injuries.",
    features: [
      "Auto Accidents",
      "Medical Malpractice",
      "Workers' Compensation",
    ],
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-amber-600" />,
    title: "Estate Planning",
    description:
      "Protect your assets and ensure your wishes are carried out with comprehensive estate planning services.",
    features: ["Wills & Trusts", "Probate", "Asset Protection"],
  },
  {
    icon: <Clock className="h-12 w-12 text-amber-600" />,
    title: "Real Estate Law",
    description:
      "Expert guidance through property transactions, disputes, and real estate investment legal matters.",
    features: ["Property Transactions", "Title Issues", "Real Estate Disputes"],
  },
];

const ServicesPage = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Practice Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive legal services across multiple practice
            areas, ensuring expert representation for all your legal needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transform hover:-translate-y-2 transition"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <ChevronRight className="h-4 w-4 text-amber-600 mr-2" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
