import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Plans.css";
import Navbar from "./Navbar";

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    features: ["Access to basic notes", "Limited uploads", "Community support"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    features: [
      "Unlimited note storage",
      "Advanced search",
      "AI summarisation",
      "Priority support",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$29.99/mo",
    features: [
      "Team collaboration tools",
      "Admin controls",
      "Custom integrations",
      "Dedicated manager",
      "Exclusive analytics",
    ],
    highlighted: false,
  },
];

export default function Plans() {
  return (
    <>
      <Navbar />
      <div className="plans-section no-bg">
        <motion.div
          className="plans-header"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Choose your perfect plan</h2>
          <p>
            From free forever to power-packed pro — find what fits you best.
          </p>
        </motion.div>

        <motion.div
          className="plan-cards"
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {plans.map((plan, idx) => (
            <motion.div
              className={`plan-card`}
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.h3
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {plan.name}
              </motion.h3>
              <p className="plan-price">{plan.price}</p>
              <ul>
                {plan.features.map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <FaCheckCircle className="check-icon" /> {feat}
                  </motion.li>
                ))}
              </ul>
              <motion.button
                className="choose-btn"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Choose {plan.name}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="new-update-msg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          ✨ More features are on the way — stay tuned!
        </motion.p>
      </div>
    </>
  );
}
