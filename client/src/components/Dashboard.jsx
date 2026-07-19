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
    <div className="container mt-5 pt-5">
      <div className="text-center mb-5 animate-fade-in-up">
        <h2 className="display-4 fw-bold gradient-text">
          Welcome to Campus Compass AI 🚀
        </h2>
        <p className="lead text-muted mt-3">
          Your intelligent guide for campus life.
        </p>
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