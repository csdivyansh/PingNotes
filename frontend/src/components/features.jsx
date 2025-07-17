import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './features.css';

const Features = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const featureList = [
    {
      emoji: '📑',
      title: 'Smart Note Sharing',
      desc: 'Upload, organize, and share notes with your classmates or group members easily.',
    },
    {
      emoji: '🔍',
      title: 'Instant Search',
      desc: 'Quickly find notes, subjects, or users with our lightning-fast search bar.',
    },
    {
      emoji: '📂',
      title: 'File Management',
      desc: 'Upload PDFs, PPTs, Word docs, and manage them all in one place.',
    },
    {
      emoji: '👥',
      title: 'Group Collaboration',
      desc: 'Create or join groups to share content, ideas, and feedback in real-time.',
    },
    {
      emoji: '🧠',
      title: 'AI-Powered Summaries',
      desc: 'Summarize lengthy notes instantly using AI to save study time and understand better.',
    },
    {
      emoji: '🗓️',
      title: 'Study Planner',
      desc: 'Plan your study schedule, set reminders, and track your progress toward exams.',
    },
    {
      emoji: '🌐',
      title: 'Multi-language Support',
      desc: 'Access and translate notes in multiple languages for global learning experiences.',
    },
    {
      emoji: '🎥',
      title: 'Video Notes',
      desc: 'Upload or embed lecture videos with time-stamped notes for enhanced learning.',
    }
  ];

  return (
    <div className="features-page">
      <div className="features-header" data-aos="fade-down">
        <h1>Explore Pingnotes Features</h1>
        <p>Built to simplify learning, collaboration, and knowledge management.</p>
      </div>

      <div className="features-zigzag">
        {featureList.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`feature-zig ${isEven ? 'left' : 'right'}`}
              data-aos={isEven ? 'fade-right' : 'fade-left'}
            >
              <div className="icon-circle">{item.emoji}</div>
              <div>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="features-end-note" data-aos="fade-up">
        <h3>🚀 More features coming soon for teachers, admins & content creators!</h3>
      </div>
    </div>
  );
};

export default Features;