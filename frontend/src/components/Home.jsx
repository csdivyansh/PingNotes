import React from 'react';

// You can replace this with a logo SVG or image if available
const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ width: 32, height: 32, background: '#0078FF', borderRadius: 8 }} />
    <span style={{ fontWeight: 700, fontSize: 24, color: '#0a192f', letterSpacing: 1 }}>PingNotes</span>
  </div>
);

const Home = () => {
  return (
    <div style={{ fontFamily: 'Poppins, Arial, sans-serif', background: '#f9fbfd', minHeight: '100vh' }}>
      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)', color: '#fff', padding: '8px 0', textAlign: 'center', fontWeight: 600, fontSize: 18 }}>
        🚀 Welcome! 
      </div>
      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 5vw 12px 5vw', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <Logo />
        <div style={{ display: 'flex', gap: 32, fontWeight: 500, fontSize: 18 }}>
          <a href="#" style={{ color: '#0078FF', textDecoration: 'none' }}>Home</a>
          <a href="#features" style={{ color: '#0a192f', textDecoration: 'none' }}>Features</a>
          <a href="#faqs" style={{ color: '#0a192f', textDecoration: 'none' }}>FAQs</a>
          <a href="#about" style={{ color: '#0a192f', textDecoration: 'none' }}>About</a>
        </div>
        <a href="#login" style={{ background: '#0078FF', color: '#fff', padding: '10px 28px', borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,120,255,0.08)' }}>Login / Register</a>
      </nav>
      {/* Hero Section */}
      {/* Motto & Description */}
      <section style={{ margin: '64px auto 0 auto', maxWidth: 1100, textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: '#0078FF', letterSpacing: 2, marginBottom: 0, lineHeight: 1.1 }}>
          Ping<span style={{ color: '#0a192f' }}>Notes</span>
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, color: '#0a192f', margin: '12px 0 0 0', lineHeight: 1.1 }}>
          Notes Organisation <span style={{ color: '#0078FF' }}>Simplified</span>
        </div>
        <div style={{ fontSize: 22, color: '#222', margin: '32px auto 0 auto', maxWidth: 700, fontWeight: 400 }}>
          Organise, search, and access your notes with ease. PingNotes helps you keep your study and work materials structured, accessible, and always at your fingertips.
        </div>
        <a href="#explore" style={{ display: 'inline-block', marginTop: 40, background: '#0078FF', color: '#fff', padding: '16px 48px', borderRadius: 12, fontWeight: 700, fontSize: 22, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,120,255,0.10)' }}>Explore </a>
      </section>
    </div>
  );
};


export default Home; 