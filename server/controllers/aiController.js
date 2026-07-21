const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../config/db");

// Campus knowledge base (static — from saranathan.ac.in)
const CAMPUS_KNOWLEDGE = `
COLLEGE: Saranathan College of Engineering (SCE), Trichy, Tamil Nadu.
Affiliated to Anna University. NAAC & NBA Accredited.

DEPARTMENTS: CSE (Computer Science & Engineering), IT (Information Technology), 
AIDS (Artificial Intelligence & Data Science), AIML (CSE with AI & ML), 
CSBS (Computer Science & Business Systems), ECE (Electronics & Communication Engineering),
EEE (Electrical & Electronics Engineering), ICE (Instrumentation & Control Engineering),
CE (Civil Engineering), MECH (Mechanical Engineering), MBA (Management Studies),
Science & Humanities: Chemistry, English, Mathematics, Physics, Tamil.

COMMON FACILITIES:
- Library: Central library with e-resources and digital journals.
- Transport: College bus routes covering Trichy city and surroundings.
- Hostel: Separate hostels for boys and girls on campus.
- Canteen: Campus canteen serving breakfast, lunch, and snacks.
- NSS: National Service Scheme for community service activities.
- YRC: Youth Red Cross unit for social and health activities.
- Physical Education: Sports ground, indoor courts, gymnasium.

ADMISSION PROCESS:
1. Undergraduate (B.E./B.Tech): Through TNEA counselling by Anna University.
   - Tamil Nadu state quota: based on 12th marks and community.
   - Management quota: direct applications to the college.
   - Required documents: 10th marksheet, 12th marksheet, Transfer Certificate, 
     Community Certificate, Income Certificate, Aadhar Card, passport photo.
2. Postgraduate (M.E./MBA): TANCET score + counselling.
3. Hostel Registration: Apply to the warden after joining. First-come first-served.
   Separate application for boy's and girl's hostels.
4. Fee Payment: Pay through college portal or DD. Fee committee circulars are 
   published on the college website annually.

SCHOLARSHIPS AVAILABLE:
- Government scholarships: BC/MBC/SC/ST schemes via Tamil Nadu government.
- Meritorious scholarship for university rank holders.
- Management scholarship for financially needy students.

RESEARCH & INNOVATION:
- Center for Research: Promotes Ph.D. and funded research projects.
- Institute Industry Partnership Cell (IIPC): Industry-academia collaborations.
- Smart India Hackathon (SIH): Internal college round conducted annually.
- E-Yantra: Robotics and embedded systems lab in collaboration with IIT Bombay.
- Entrepreneurship Development Cell (EDC): Startup support and mentorship.

PLACEMENT CELL:
- Active placement drives with companies like TCS, Infosys, Wipro, Cognizant, HCL.
- Pre-placement training: aptitude, communication, technical rounds.
- Students can contact the Placement Cell at the college campus.
- University rank holders from all departments are recognized annually.

CONTACT:
- Address: Saranathan College of Engineering, Panjappur, Trichy - 620 012, Tamil Nadu.
- Grievance Redressal Portal: https://saranathan.edugrievance.com
`;

const buildSystemPrompt = (eventsContext, clubsContext, facultyContext, announcementsContext, timetableContext, canteenContext, user) => {
  const userContext = user
    ? `\nCURRENT STUDENT: Name: ${user.name}, Department: ${user.department || "Not set"}, Year: ${user.year || "Not set"}, Interests: ${user.interests || "Not specified"}.`
    : "\nCURRENT STUDENT: Not logged in (public query).";

  return `You are the Campus Compass AI Assistant for Saranathan College of Engineering, Trichy.
You are a friendly, knowledgeable campus guide who helps students with all campus-related questions.
Always be helpful, clear, and concise. Use bullet points or numbered lists for clarity when needed.
${userContext}

${CAMPUS_KNOWLEDGE}

UPCOMING EVENTS:
${eventsContext || "No upcoming events found."}

STUDENT CLUBS:
${clubsContext || "No clubs listed."}

FACULTY (by department):
${facultyContext || "Faculty information is being loaded."}

RECENT ANNOUNCEMENTS:
${announcementsContext || "No recent announcements."}

CLASS TIMETABLE:
${timetableContext || "No timetable available."}

CANTEEN MENU:
${canteenContext || "Canteen menu not available."}

INSTRUCTIONS:
- For admission questions: Walk students through the process step by step.
- For faculty questions: Provide name, designation, department, and email.
- For events: Mention venue, date, and how to register.
- For clubs: Mention faculty coordinator, meeting day, and contact email.
- For timetable questions: Tell the student their specific classes based on their department and year if available in context.
- For canteen questions: List the available items and their prices.
- If you cannot find specific information, politely say so and suggest the student visit the college office.
- Never make up faculty names, emails, timetable schedules, or specific data not in your context.`;
};

// POST /api/ai/chat
const askGemini = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required." });
  }
  
  console.log("Checking API KEY:", process.env.GEMINI_API_KEY ? "EXISTS" : "UNDEFINED");
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ message: "Gemini AI API key is not configured on the server." });
  }

  try {
    const [events] = await db.query("SELECT * FROM events ORDER BY id DESC LIMIT 20");
    const [clubs]  = await db.query("SELECT * FROM clubs");
    const [facultyRows] = await db.query("SELECT name, designation, department, email FROM faculty ORDER BY department, designation");
    const [announcements] = await db.query("SELECT title, body, created_at FROM announcements ORDER BY created_at DESC LIMIT 10");
    const [timetableRows] = await db.query("SELECT department, year, day, time_slot, subject, room FROM timetable ORDER BY department, year, day, time_slot");
    const [canteenRows] = await db.query("SELECT item_name, item_type, price FROM canteen_menu WHERE is_available = 1 ORDER BY item_type, item_name");

    const eventsContext = events.map(e =>
      `- ${e.title} (${e.event_type}) at ${e.venue} on ${e.date}: ${e.description}`
    ).join("\n");

    const clubsContext = clubs.map(c =>
      `- ${c.name} | Coordinator: ${c.faculty_coordinator} | Meeting: ${c.meeting_day} | Contact: ${c.contact_email} — ${c.description}`
    ).join("\n");

    // Group faculty by dept
    const facultyByDept = {};
    facultyRows.forEach(f => {
      if (!facultyByDept[f.department]) facultyByDept[f.department] = [];
      facultyByDept[f.department].push(`  ${f.name} (${f.designation}) — ${f.email || "email N/A"}`);
    });
    const facultyContext = Object.entries(facultyByDept)
      .map(([dept, members]) => `[${dept}]\n${members.join("\n")}`)
      .join("\n\n");
      
    const announcementsContext = announcements.map(a =>
      `- [${new Date(a.created_at).toLocaleDateString()}] ${a.title}: ${a.body}`
    ).join("\n");

    // Group timetable by dept and year
    const timetableByDeptYear = {};
    timetableRows.forEach(t => {
      const key = `${t.department} - Year ${t.year}`;
      if (!timetableByDeptYear[key]) timetableByDeptYear[key] = [];
      timetableByDeptYear[key].push(`  ${t.day} ${t.time_slot}: ${t.subject} (Room ${t.room})`);
    });
    const timetableContext = Object.entries(timetableByDeptYear)
      .map(([key, classes]) => `[${key}]\n${classes.join("\n")}`)
      .join("\n\n");
      
    // Group canteen menu by item_type
    const canteenByType = {};
    canteenRows.forEach(c => {
      if (!canteenByType[c.item_type]) canteenByType[c.item_type] = [];
      canteenByType[c.item_type].push(`  ${c.item_name} - ₹${c.price}`);
    });
    const canteenContext = Object.entries(canteenByType)
      .map(([type, items]) => `[${type.toUpperCase()}]\n${items.join("\n")}`)
      .join("\n\n");

    // Get user info if logged in
    let userInfo = null;
    if (req.user) {
      const [rows] = await db.query(
        "SELECT name, department, year, interests FROM users WHERE id = ?",
        [req.user.id]
      );
      if (rows.length > 0) userInfo = rows[0];
    }

    // Log the query
    if (req.user) {
      await db.query(
        "INSERT INTO ai_query_logs (user_id, query) VALUES (?, ?)",
        [req.user.id, message.substring(0, 500)]
      ).catch(() => {}); // non-blocking
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: buildSystemPrompt(eventsContext, clubsContext, facultyContext, announcementsContext, timetableContext, canteenContext, userInfo)
    });

    let chatHistory = (history || []).map(h => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));
    
    // Google Gemini API strictly requires chat history to start with a 'user' message
    // If the history starts with our hardcoded model greeting, remove it.
    while (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory.shift();
    }

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ message: "Error communicating with AI Assistant. Please try again." });
  }
};

// POST /api/ai/recommend — personalized club/event recommendations
const getRecommendations = async (req, res) => {
  const { interests } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ message: "Gemini AI API key is not configured." });
  }

  try {
    const [clubs]  = await db.query("SELECT name, description, meeting_day FROM clubs");
    const [events] = await db.query("SELECT title, description, venue, date, event_type FROM events ORDER BY id DESC LIMIT 20");

    const clubsList  = clubs.map(c  => `- ${c.name}: ${c.description} (Meets: ${c.meeting_day})`).join("\n");
    const eventsList = events.map(e => `- ${e.title} (${e.event_type}): ${e.description}`).join("\n");

    const prompt = `You are a helpful campus advisor at Saranathan College of Engineering, Trichy.

A student has the following interests: "${interests || "general campus activities"}"

Available Clubs:
${clubsList}

Upcoming Events:
${eventsList}

Based on the student's interests, recommend the top 3 most relevant clubs and top 3 most relevant events.
Format your response as JSON with this structure:
{
  "clubs": [{ "name": "...", "reason": "..." }],
  "events": [{ "title": "...", "reason": "..." }]
}
Only return the JSON, nothing else.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();

    let recommendations;
    try {
      recommendations = JSON.parse(text);
    } catch {
      recommendations = { clubs: [], events: [], raw: text };
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Recommend error:", error);
    res.status(500).json({ message: "Failed to generate recommendations." });
  }
};

module.exports = { askGemini, getRecommendations };
