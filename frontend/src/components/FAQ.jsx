import React, { useState } from "react";
import "./FAQpage.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is PingNotes?",
      answer:
        "PingNotes is a cloud-based note organizer designed to help students save, organize, and share study materials easily.",
    },
    {
      question: "Who can use PingNotes?",
      answer:
        "PingNotes is for all students – school students, college students, and those preparing for competitive exams like JEE, NEET, UPSC, SSC, etc.",
    },
    {
      question: "Is PingNotes free to use?",
      answer:
        "Yes, PingNotes offers a free plan for students to get started easily.",
    },
    {
      question: "Can I access PingNotes on mobile?",
      answer:
        "Yes, PingNotes is fully responsive and works on all smartphones and tablets.",
    },
    {
      question: "Can I use PingNotes offline?",
      answer:
        "Currently, PingNotes requires an internet connection, but offline support is planned for future updates.",
    },
    {
      question: "Does PingNotes work on all devices and browsers?",
      answer:
        "Yes, PingNotes works smoothly on Chrome, Firefox, Safari, and modern mobile browsers.",
    },
    {
      question: "Can I organize notes subject-wise or topic-wise?",
      answer:
        "Absolutely! You can create folders, categories, and tags for subjects, topics, or exams.",
    },
    {
      question: "Can I share my notes with friends or classmates?",
      answer:
        "Yes, you can share notes via a link or invite other users to collaborate on notes.",
    },
    {
      question: "Can I upload PDFs, images, or other files to my notes?",
      answer:
        "Yes, PingNotes supports file uploads including PDFs, images, and more.",
    },
    {
      question: "Does PingNotes support handwritten notes or drawing?",
      answer:
        "We are working on a drawing board feature for handwritten notes.",
    },
    {
      question:
        "How can PingNotes help me prepare for competitive exams like JEE, NEET, SSC, UPSC?",
      answer:
        "You can organize revision notes, track progress, and share notes with study groups.",
    },
    {
      question: "Can I bookmark important notes or tag them?",
      answer:
        "Yes, you can easily tag and bookmark your notes for quick access.",
    },
    {
      question: "Can I set reminders or schedules for revision?",
      answer: "A built-in reminder and scheduler feature is coming soon!",
    },
    {
      question: "Is PingNotes useful for school students (Class 6 to 12)?",
      answer: "Yes, PingNotes is designed to support all academic levels.",
    },
    {
      question:
        "Can college students use PingNotes for lecture notes and assignments?",
      answer:
        "Definitely! You can store, sort, and share your college materials easily.",
    },
    {
      question: "Can teachers use PingNotes to share notes with students?",
      answer:
        "Yes, PingNotes supports sharing and collaboration for teachers and students alike.",
    },
    {
      question: "Is my data safe on PingNotes?",
      answer: "Yes, we use secure encryption to keep your data protected.",
    },
    {
      question: "Can I recover deleted notes?",
      answer:
        "Yes, a deleted note goes to Trash and can be recovered within 30 days.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Use the 'Forgot Password' link on the login page to reset it easily.",
    },
    {
      question: "How can I contact PingNotes support team?",
      answer:
        "You can reach out to us via our Contact page or email us at support@pingnotes.in.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="faq-container">
        <h1 className="faq-title">PingNotes</h1>
        <p className="faq-subtitle">
          Your smart companion for storing, syncing, and sharing notes — built
          for every student.
        </p>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleAnswer(index)}>
                {faq.question}
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
