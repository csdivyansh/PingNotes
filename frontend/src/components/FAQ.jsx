// FAQpage.js
import React from "react";
import "./FAQpage.css";
import { FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const faqs = [
  {
    question: "What is Pingnotes?",
    answer:
      "Pingnotes is a cloud-based note organizing platform designed for students. It helps in managing, storing, and accessing notes from anywhere.",
  },
  {
    question: "Who can use Pingnotes?",
    answer:
      "Any student – school, college, or preparing for competitive exams – can use Pingnotes to organize their study materials.",
  },
  {
    question: "Is my data safe with Pingnotes?",
    answer:
      "Yes, we use secure cloud storage and encryption to protect your notes and personal information.",
  },
  {
    question: "How can I organize notes subject-wise or topic-wise?",
    answer:
      "You can create folders or tags based on subjects or topics, and easily group your notes accordingly within the Pingnotes app.",
  },
  {
    question: "Can I share my notes with classmates?",
    answer:
      "Yes! Pingnotes allows you to share your notes securely with classmates via links or email invitations.",
  },
  {
    question: "Does PingNotes work offline?",
    answer:
      "Currently, PingNotes is optimized for online access, but we are working on an offline mode for future updates.",
  },
];

const FAQpage = () => {
  return (
    <>
      <Navbar />
      <div className="faq-container">
        <header className="faq-header">
          <FaQuestionCircle className="faq-icon" />
          <h1>
            <span className="blue">Ping</span>notes
          </h1>
          <p className="tagline">
            Your Study Companion — Simplified & Organized
          </p>
        </header>

        <motion.div
          className="faq-list"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              className="faq-card"
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default FAQpage;
