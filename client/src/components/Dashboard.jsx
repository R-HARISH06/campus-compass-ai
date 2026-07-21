import { Link } from "react-router-dom";
import posterImg from "../images/welcomepartyposter.png";

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
    <div className="container mt-5 pt-5">
      <div className="text-center mb-5 animate-fade-in-up">
        <h2 className="display-4 fw-bold gradient-text">
          Welcome to Campus Compass AI 🚀
        </h2>
        <p className="lead text-muted mt-3 mb-5">
          Your intelligent guide for campus life.
        </p>

        {/* Enhanced Poster Section with Hover Transitions */}
        <div className="row justify-content-center animate-fade-in-up delay-1">
          <div className="col-12 col-md-10 col-lg-8">
            <div 
              className="poster-wrapper"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0, 195, 255, 0.15), 0 0 50px rgba(110, 0, 255, 0.1)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 195, 255, 0.3), 0 0 80px rgba(110, 0, 255, 0.2)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 195, 255, 0.15), 0 0 50px rgba(110, 0, 255, 0.1)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              }}
            >
              <img 
                src={posterImg}
                alt="The Beginning - Ready Player Campus" 
                className="img-fluid"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Link to={feature.link} className="text-decoration-none">
              <div className={`card h-100 hover-scale animate-fade-in-up delay-${(index % 4) + 1}`} style={{ cursor: "pointer" }}>
                <div className="card-body p-4 text-center">
                  <div className="display-4 mb-3">{feature.title.split(" ")[0]}</div>
                  <h3 className="card-title h4 fw-bold text-white">
                    {feature.title.split(" ").slice(1).join(" ")}
                  </h3>
                  <p className="card-text text-muted mt-3">
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