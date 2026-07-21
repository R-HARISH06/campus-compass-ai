import { Link } from "react-router-dom";

function Dashboard() {

  const features = [
    {
      title: "📅 Events",
      description: "Discover upcoming campus events and register.",
      link: "/events"
    },
    {
      title: "🎓 Clubs",
      description: "Explore student clubs and activities.",
      link: "/clubs"
    },
    {
      title: "👨‍🏫 Faculty",
      description: "Find faculty details and contact information.",
      link: "/faculty"
    },
    {
      title: "📚 Timetable",
      description: "Access your class schedule anytime.",
      link: "/timetable"
    },
    {
      title: "📢 Announcements",
      description: "Stay updated with campus notifications.",
      link: "/announcements"
    },
    {
      title: "🤖 AI Assistant",
      description: "Ask questions about campus using Gemini AI.",
      link: "/ai"
    }
  ];

  return (
    <div className="container mt-5 pt-5 position-relative">
      
      {/* Decorative Background Blobs */}
      <div 
        className="position-absolute rounded-circle" 
        style={{
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0) 70%)',
          top: '-10%', left: '-5%', filter: 'blur(40px)', zIndex: -1
        }}
      />
      <div 
        className="position-absolute rounded-circle" 
        style={{
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)',
          top: '20%', right: '5%', filter: 'blur(40px)', zIndex: -1
        }}
      />

      <div className="text-center mb-5 animate-fade-in-up">
        <h2 className="display-3 fw-bold gradient-text mb-3" style={{ letterSpacing: '-1px' }}>
          Welcome to Campus Compass AI
        </h2>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
          Your intelligent guide for campus life. Navigate smarter, discover opportunities, and connect seamlessly.
        </p>

        <div className="mt-4 mb-5">
          <Link to="/ai" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
            Try AI Assistant ✨
          </Link>
        </div>

        {/* Enhanced Poster Section */}
        <div className="row justify-content-center animate-fade-in-up delay-1">
          <div className="col-12 col-md-10 col-lg-8">
            <div 
              className="poster-wrapper position-relative"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px rgba(79, 70, 229, 0.15)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(0,0,0,0.6), 0 0 50px rgba(79, 70, 229, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px rgba(79, 70, 229, 0.15)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <img 
                src="/images/originalwelcomeposter.png"
                alt="The Beginning - Ready Player Campus" 
                className="img-fluid"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 pt-4">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Link to={feature.link} className="text-decoration-none">
              <div className={`card h-100 hover-scale animate-fade-in-up delay-${(index % 4) + 1}`} style={{ cursor: "pointer" }}>
                <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                  <div className="display-4 mb-3" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
                    {feature.title.split(" ")[0]}
                  </div>
                  <h3 className="card-title h5 fw-bold text-white mb-2">
                    {feature.title.split(" ").slice(1).join(" ")}
                  </h3>
                  <p className="card-text text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;