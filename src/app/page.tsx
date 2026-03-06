"use client";
import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Typewriter from "@/components/Typewriter";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── Animate hero items on load ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll(".hero .animate-in").forEach((el, i) => {
        setTimeout(() => el.classList.add("visible"), i * 120);
      });
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  /* ── Counter animation ── */
  useEffect(() => {
    let hasAnimated = false;
    const counters = document.querySelectorAll<HTMLElement>(".stat-number");
    function animateCounters() {
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-count") || "0");
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        function update() {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current).toString();
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toString();
          }
        }
        update();
      });
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );
    const statsEl = document.querySelector(".hero-stats");
    if (statsEl) observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll(
      ".section-header, .timeline-item, .skill-category, .edu-card, .contact-card, .contact-form-wrapper, .about-text, .about-visual, .certifications, .other-roles"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("reveal"), index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Tilt cards ── */
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".tilt-card");
    const handlers = new Map<HTMLElement, { move: (e: MouseEvent) => void; leave: () => void }>();
    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };
      const leave = () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
      };
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      handlers.set(card, { move, leave });
    });
    return () => {
      handlers.forEach(({ move, leave }, card) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  /* ── Parallax ── */
  useEffect(() => {
    const onScroll = () => {
      const heroVisual = document.querySelector<HTMLElement>(".hero-visual");
      if (heroVisual) heroVisual.style.transform = `translateY(${window.pageYOffset * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Contact form handler ── */
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const subject = fd.get("subject") as string;
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const message = fd.get("message") as string;
    const mailto = `mailto:gokulakrishnan.msamy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;
    const btn = form.querySelector<HTMLButtonElement>(".btn-submit");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
      btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ""; form.reset(); }, 3000);
    }
  }, []);

  return (
    <>
      <Background />
      <CustomCursor />
      <Loader />
      <Navbar />

      <main>
        {/* ══════ HERO ══════ */}
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-visual">
            <div className="image-space-container hero-only-pic">
              <div className="image-space-glow" style={{ opacity: 0.2 }}></div>
              <div className="profile-avatar">
                <div className="avatar-fallback" style={{ display: "flex" }}>
                  <i className="fas fa-user-astronaut"></i>
                </div>
                <div className="avatar-ring" style={{ inset: -15, borderWidth: 3 }}></div>
                <div className="avatar-ring ring-2" style={{ inset: -25, borderWidth: 2 }}></div>
              </div>
            </div>
          </div>

          <div className="hero-content">
            <div className="hero-badge animate-in">
              <span className="badge-dot"></span>
              Open for New Challenges
            </div>
            <h1 className="hero-title animate-in">
              <span className="hero-greeting">Hello, I&apos;m</span>
              <span className="hero-name">
                <span className="name-word">Gokulakrishnan</span>
                <span className="name-word gradient-text">Muthusamy</span>
              </span>
            </h1>
            <Typewriter />
            <p className="hero-description animate-in">
              Results-driven professional with <strong>5+ years</strong> of experience in{" "}
              <strong>Data Science, AI/ML, Generative AI</strong>, and advanced analytics.
              Successfully guided <strong>200+ professionals</strong> — from students to senior
              architects in Fortune 500 organizations.
            </p>
            <div className="hero-stats animate-in">
              <div className="stat-item">
                <span className="stat-number" data-count="300">0</span>
                <span className="stat-plus">+</span>
                <span className="stat-label">Learners Mentored</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number" data-count="5">0</span>
                <span className="stat-plus">+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number" data-count="200">0</span>
                <span className="stat-plus">+</span>
                <span className="stat-label">Professionals Guided</span>
              </div>
            </div>
            <div className="hero-actions animate-in">
              <a href="#contact" className="btn btn-primary">
                <span>Get in Touch</span><i className="fas fa-arrow-right"></i>
              </a>
              <a href="/Gokul_AI_Trainer.pdf" className="btn btn-primary" download>
                <span>Resume</span><i className="fas fa-download"></i>
              </a>
              <a href="#experience" className="btn btn-primary">
                <span>View Work</span><i className="fas fa-eye"></i>
              </a>
            </div>
            <div className="hero-socials animate-in">
              <a href="https://github.com/gokul-1998" target="_blank" rel="noopener noreferrer" className="contact-social-link" aria-label="GitHub"><i className="fab fa-github"></i><span>GitHub</span></a>
              <a href="https://linkedin.com/in/gokulakrishnan-muthusamy-141a78201" target="_blank" rel="noopener noreferrer" className="contact-social-link" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i><span>LinkedIn</span></a>
              <a href="mailto:gokulakrishnan.msamy@gmail.com" className="contact-social-link" aria-label="Email"><i className="fas fa-envelope"></i><span>Email</span></a>
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="scroll-line"></div>
            <span>Scroll Down</span>
          </div>
        </section>

        {/* ══════ ABOUT ══════ */}
        <section className="section about-section" id="about">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Passionate About <span className="gradient-text">Innovation</span></h2>
            </div>
            <div className="about-grid">
              <div className="about-text">
                <p>Over the past five years, I have built deep expertise in mentoring and delivering high-impact training across <strong>Python for fintech automation</strong>, Data Analytics for BI dashboards, <strong>AI/ML for predictive wealth modeling</strong> and stock analysis, <strong>Generative AI</strong> for scenario planning, DSA for algorithmic efficiency, software testing for robust quality assurance, and <strong>Agile/Scrum for iterative delivery</strong>.</p>
                <p>I&apos;ve successfully guided 200+ professionals — ranging from students to senior architects in Fortune 500 organizations — toward mastery in <strong>Generative AI, data analytics, and Python full-stack development</strong>, enabling accelerated career growth in remote, high-stakes environments.</p>
                <div className="about-highlights">
                  <div className="highlight-card">
                    <div className="highlight-icon"><i className="fas fa-graduation-cap"></i></div>
                    <div className="highlight-info"><h4>IIT Madras</h4><p>B.S. in Data Science</p></div>
                  </div>
                  <div className="highlight-card">
                    <div className="highlight-icon"><i className="fas fa-building"></i></div>
                    <div className="highlight-info"><h4>Magizh Technologies</h4><p>Founder &amp; CEO</p></div>
                  </div>
                  <div className="highlight-card">
                    <div className="highlight-icon"><i className="fas fa-certificate"></i></div>
                    <div className="highlight-info"><h4>Microsoft Azure</h4><p>AI-900 &amp; PL-900</p></div>
                  </div>
                </div>
              </div>
              <div className="about-visual">
                <div className="code-window">
                  <div className="code-header">
                    <div className="code-dots"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span></div>
                    <span className="code-filename">gokulakrishnan.py</span>
                  </div>
                  <div className="code-body">
                    <pre><code dangerouslySetInnerHTML={{
                      __html: `<span class="code-keyword">class</span> <span class="code-class">Gokulakrishnan</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(<span class="code-param">self</span>):
        <span class="code-param">self</span>.name = <span class="code-string">"Gokulakrishnan M"</span>
        <span class="code-param">self</span>.role = <span class="code-string">"AI/ML Expert"</span>
        <span class="code-param">self</span>.experience = <span class="code-number">5</span>  <span class="code-comment"># years</span>
        <span class="code-param">self</span>.learners = <span class="code-number">300</span>+
        <span class="code-param">self</span>.location = <span class="code-string">"Tamil Nadu"</span>

    <span class="code-keyword">def</span> <span class="code-func">expertise</span>(<span class="code-param">self</span>):
        <span class="code-keyword">return</span> [
            <span class="code-string">"Data Science"</span>,
            <span class="code-string">"AI/ML"</span>,
            <span class="code-string">"Generative AI"</span>,
            <span class="code-string">"Full-Stack Dev"</span>,
            <span class="code-string">"Fintech Automation"</span>
        ]

    <span class="code-keyword">def</span> <span class="code-func">passion</span>(<span class="code-param">self</span>):
        <span class="code-keyword">return</span> <span class="code-string">"Empowering minds 🚀"</span>` }} /></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ EXPERIENCE ══════ */}
        <section className="section experience-section" id="experience">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Professional <span className="gradient-text">Journey</span></h2>
            </div>
            <div className="timeline">
              {[
                { date: "Jan 2026 - Present", role: "Founder — Training Division", company: "Maharaja Institute of Technology, Mysore", icon: "fa-university", bullets: ["Conducted <strong>Generative AI placement training</strong> for 60+ B.Tech CSE students, covering fundamentals of Generative AI through to building full-stack GenAI platforms with hands-on, project-based learning.", "Delivered <strong>Python Full-Stack placement training</strong> for 70+ BCA students, focusing on Django and web development through classroom sessions with 90% practical, hands-on implementation."], tags: ["Generative AI", "Python", "Django", "Full-Stack"] },
                { date: "Jan 2024 - Present", role: "Founder", company: "Magizh Technologies", icon: "fa-rocket", bullets: ["Founded and led a <strong>technology-driven training and consulting organization</strong> focused on industry-ready upskilling in Python, Data Science, AI/ML, and Generative AI.", "Mentored <strong>300+ learners</strong>, enabling job-ready competencies through project-based learning, assessments, and career-oriented guidance.", "Oversaw technical strategy, curriculum design, instructor mentoring, and quality assurance across training programs."], tags: ["Python", "Data Science", "AI/ML", "Leadership"] },
                { date: "Dec 2024 - Sept 2025", role: "Guest Professor — AI & Analytics", company: "VIT, Vellore, Tamil Nadu", icon: "fa-university", bullets: ["Taught <strong>Statistics and Machine Learning</strong> using Python across two academic semesters.", "Trained <strong>70 students</strong> through a structured blend of theory, coding labs, assignments, and applied case studies.", "Focused on building strong <strong>statistical intuition, ML fundamentals</strong>, and real-world implementation skills."], tags: ["Machine Learning", "Statistics", "Python", "Teaching"] },
                { date: "July 2024", role: "Visiting Trainer", company: "NSE Academy", icon: "fa-chart-bar", bullets: ["Conducted a <strong>2-month, hands-on training program</strong> on Artificial Intelligence and its applications in Finance.", "Covered practical AI use cases including <strong>risk analysis, predictive modeling, market insights</strong>, and financial decision support systems.", "Emphasized industry relevance, implementation workflows, and responsible AI practices in fintech contexts."], tags: ["AI in Finance", "Risk Analysis", "Predictive Modeling"] },
                { date: "Jan 2021 - Present", role: "Academic Mentor & Examiner", company: "IIT Madras, Chennai", icon: "fa-university", bullets: ["Trained <strong>100+ students</strong> enrolled in the BS Degree Program, focusing on strong foundations in computer science and applied analytics.", "Served as <strong>Viva Examiner</strong>, evaluating conceptual understanding, problem-solving ability, and technical rigor.", "Acted as a <strong>DSA Mentor</strong> for undergraduate and postgraduate learners, emphasizing algorithmic efficiency and scalable problem-solving."], tags: ["Mentoring", "DSA", "IIT Madras", "Examiner"] },
                { date: "Corporate Training", role: "Corporate / Academic Trainer", company: "Shree Eshwar College of Engineering", icon: "fa-building", bullets: ["Led <strong>5-day intensive bootcamps</strong> on Python and Pandas, focused on data manipulation, analysis, and visualization.", "Enabled participants to apply concepts to <strong>real-world datasets and problem statements</strong>, strengthening employability and practical skills."], tags: ["Python", "Pandas", "Data Analysis", "Bootcamp"] },
              ].map((exp, idx) => (
                <div className="timeline-item" key={idx}>
                  <div className="timeline-marker"><div className="marker-dot"></div></div>
                  <div className="timeline-card tilt-card">
                    <div className="timeline-date"><span className="date-badge">{exp.date}</span></div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <h4 className="timeline-company"><i className={`fas ${exp.icon}`}></i> {exp.company}</h4>
                    <ul className="timeline-details">
                      {exp.bullets.map((b, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                      ))}
                    </ul>
                    <div className="timeline-tags">
                      {exp.tags.map((t) => (<span key={t}>{t}</span>))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SKILLS ══════ */}
        <section className="section skills-section" id="skills">
          <div className="section-container">
            <div className="section-header">

              <h2 className="section-title">Technical <span className="gradient-text">Arsenal</span></h2>
            </div>
            <div className="skills-grid">
              {[
                {
                  icon: "fa-code", title: "Languages & Frameworks", skills: [
                    { name: "Python", level: "expert" }, { name: "Flask", level: "expert" }, { name: "FastAPI", level: "expert" }, { name: "Django", level: "advanced" }, { name: "JavaScript", level: "advanced" }, { name: "React", level: "advanced" }, { name: "VueJS", level: "advanced" }, { name: "React Native", level: "intermediate" }, { name: "Node.js", level: "intermediate" }, { name: "Express.js", level: "intermediate" }, { name: "Golang", level: "intermediate" }, { name: "SQL", level: "advanced" }, { name: "Java", level: "intermediate" }, { name: "C++", level: "intermediate" }, { name: "Shell Scripting", level: "advanced" }
                  ]
                },
                {
                  icon: "fa-brain", title: "Data Science & AI/ML", skills: [
                    { name: "Pandas", level: "expert" }, { name: "NumPy", level: "expert" }, { name: "Matplotlib", level: "expert" }, { name: "Machine Learning", level: "expert" }, { name: "Generative AI", level: "expert" }, { name: "Data Analytics", level: "advanced" }, { name: "Predictive Modeling", level: "advanced" }, { name: "Risk Analysis", level: "advanced" }, { name: "Statistical Analysis", level: "advanced" }
                  ]
                },
                {
                  icon: "fa-database", title: "Databases", skills: [
                    { name: "PostgreSQL", level: "expert" }, { name: "Oracle DB", level: "advanced" }, { name: "MySQL", level: "advanced" }, { name: "SQLite3", level: "advanced" }, { name: "SQLAlchemy", level: "advanced" }, { name: "ORM", level: "advanced" }, { name: "PLSQL", level: "intermediate" }
                  ]
                },
                {
                  icon: "fa-server", title: "DevOps & Cloud", skills: [
                    { name: "Docker", level: "advanced" }, { name: "Azure DevOps", level: "advanced" }, { name: "GitHub Actions", level: "advanced" }, { name: "CI/CD Pipelines", level: "advanced" }, { name: "Grafana", level: "intermediate" }, { name: "Kafka", level: "intermediate" }, { name: "RabbitMQ", level: "intermediate" }, { name: "Redis", level: "advanced" }, { name: "Celery", level: "advanced" }
                  ]
                },
                {
                  icon: "fa-sitemap", title: "Architecture & Patterns", skills: [
                    { name: "MVC", level: "expert" }, { name: "RBAC", level: "advanced" }, { name: "REST APIs", level: "advanced" }, { name: "Websockets", level: "advanced" }, { name: "Webhooks", level: "advanced" }, { name: "Async Programming", level: "advanced" }, { name: "Client-Server", level: "advanced" }
                  ]
                },
                {
                  icon: "fa-vial", title: "Testing & Automation", skills: [
                    { name: "Pytest", level: "advanced" }, { name: "Selenium", level: "advanced" }, { name: "Playwright", level: "advanced" }, { name: "n8n", level: "intermediate" }, { name: "Make.com", level: "intermediate" }, { name: "Zapier", level: "intermediate" }, { name: "DSA", level: "advanced" }, { name: "OOPS", level: "advanced" }
                  ]
                },
              ].map((cat, idx) => (
                <div className="skill-category tilt-card" key={idx}>
                  <div className="skill-category-header">
                    <div className="skill-icon"><i className={`fas ${cat.icon}`}></i></div>
                    <h3>{cat.title}</h3>
                  </div>
                  <div className="skill-tags">
                    {cat.skills.map((s) => (
                      <span className="skill-tag" data-level={s.level} key={s.name}>{s.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ EDUCATION ══════ */}
        <section className="section education-section" id="education">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Academic <span className="gradient-text">Background</span></h2>
            </div>
            <div className="education-grid">
              <div className="edu-card tilt-card">
                <div className="edu-icon"><i className="fas fa-award"></i></div>
                <div className="edu-content">
                  <h3>Indian Institute of Technology, Madras</h3>
                  <p className="edu-degree">B.S. in Data Science and Applications</p>
                  <p className="edu-date"><i className="far fa-calendar-alt"></i> Jan 2021 - Present</p>
                  <div className="edu-score"><span className="score-label">CGPA</span><span className="score-value">8.5 / 10</span></div>
                </div>
              </div>
              <div className="edu-card tilt-card">
                <div className="edu-icon"><i className="fas fa-graduation-cap"></i></div>
                <div className="edu-content">
                  <h3>Anna University, Chennai</h3>
                  <p className="edu-degree">B.E. in Mechanical Engineering</p>
                  <p className="edu-date"><i className="far fa-calendar-alt"></i> Aug 2016 - June 2021</p>
                  <div className="edu-score"><span className="score-label">CGPA</span><span className="score-value">7.9 / 10</span></div>
                </div>
              </div>
            </div>

            <div className="certifications">
              <h3 className="cert-title">Awards &amp; Certifications</h3>
              <div className="cert-grid">
                {[
                  { icon: "fab fa-microsoft", text: "Microsoft Azure AI-900" },
                  { icon: "fab fa-microsoft", text: "Microsoft Azure PL-900" },
                  { icon: "fas fa-graduation-cap", text: "IIT Madras Diploma in Data Science" },
                  { icon: "fas fa-trophy", text: "Best Flask-VueJS Project" },
                  { icon: "fas fa-certificate", text: "ML Projects - Coursera" },
                  { icon: "fas fa-certificate", text: "Neural Networks & Deep Learning - Coursera" },
                ].map((c, i) => (
                  <div className="cert-card" key={i}>
                    <div className="cert-icon"><i className={c.icon}></i></div>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="other-roles" id="trainings">
              <h3 className="cert-title">Other Roles &amp; Responsibilities</h3>
              <div className="roles-grid">
                {[
                  { icon: "fas fa-flag", text: "Founder & Head — Techno Cultural Fest (IITM BS)" },
                  { icon: "fas fa-users-cog", text: "Academic Affairs Coordinator (IITM BS — 8 months)" },
                  { icon: "fas fa-user-tie", text: "Secretary of Nilgiri House (8 months)" },
                  { icon: "fas fa-chalkboard-teacher", text: "Academic Mentor for DSA" },
                ].map((r, i) => (
                  <div className="role-card" key={i}>
                    <i className={r.icon}></i>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>

              {/* Feedback Portal CTA */}
              <div className="feedback-cta reveal" style={{ marginTop: "40px", textAlign: "center", padding: "40px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "24px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                <h4 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "15px", color: "white" }}>Training Feedback Portal</h4>
                <p style={{ color: "#a0a0b8", marginBottom: "25px" }}>Browse through detailed feedback and records from all my training sessions across different institutions and years.</p>
                <Link href="/trainings/feedbacks" className="btn btn-primary">
                  <span>Explore Feedbacks</span><i className="fas fa-external-link-alt" style={{ marginLeft: "10px" }}></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ CONTACT ══════ */}
        <section className="section contact-section" id="contact">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Let&apos;s <span className="gradient-text">Connect</span></h2>
              <p className="section-subtitle">Have a project in mind or want to discuss AI training opportunities? Let&apos;s talk!</p>
            </div>
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-card tilt-card">
                  <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                  <div className="contact-detail">
                    <h4 style={{ fontWeight: "800", color: "white", fontSize: "1.2rem" }}>Email</h4>
                    <a href="mailto:gokulakrishnan.msamy@gmail.com">gokulakrishnan.msamy@gmail.com</a>
                  </div>
                </div>
                <div className="contact-card tilt-card">
                  <div className="contact-icon"><i className="fas fa-phone"></i></div>
                  <div className="contact-detail">
                    <h4 style={{ fontWeight: "800", color: "white", fontSize: "1.2rem" }}>Phone</h4>
                    <a href="tel:+917397413403">+91 7397413403</a>
                  </div>
                </div>
                <div className="contact-card tilt-card">
                  <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="contact-detail">
                    <h4 style={{ fontWeight: "800", color: "white", fontSize: "1.2rem" }}>Location</h4>
                    <span>Tamil Nadu, India</span>
                  </div>
                </div>
                <div className="contact-socials">
                  <a href="https://github.com/gokul-1998" target="_blank" rel="noopener noreferrer" className="contact-social-link"><i className="fab fa-github"></i><span>GitHub</span></a>
                  <a href="https://linkedin.com/in/gokulakrishnan-muthusamy-141a78201" target="_blank" rel="noopener noreferrer" className="contact-social-link"><i className="fab fa-linkedin-in"></i><span>LinkedIn</span></a>
                  <a href="https://ds.study.iitm.ac.in/student/21f1007026" target="_blank" rel="noopener noreferrer" className="contact-social-link"><i className="fas fa-university"></i><span>IIT Madras</span></a>
                </div>
              </div>
              <div className="contact-form-wrapper">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input type="text" name="name" id="formName" placeholder=" " required />
                    <label htmlFor="formName">Your Name</label>
                    <div className="form-line"></div>
                  </div>
                  <div className="form-group">
                    <input type="email" name="email" id="formEmail" placeholder=" " required />
                    <label htmlFor="formEmail">Your Email</label>
                    <div className="form-line"></div>
                  </div>
                  <div className="form-group">
                    <input type="text" name="subject" id="formSubject" placeholder=" " required />
                    <label htmlFor="formSubject">Subject</label>
                    <div className="form-line"></div>
                  </div>
                  <div className="form-group">
                    <textarea name="message" id="formMessage" rows={4} placeholder=" " required></textarea>
                    <label htmlFor="formMessage">Message</label>
                    <div className="form-line"></div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-submit">
                    <span>Send Message</span>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════ FOOTER ══════ */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-logo">&lt;GK/&gt;</span>
            <p>AI/ML Expert &amp; Data Science Trainer</p>
          </div>
          <div className="footer-center">
            <p>&copy; 2026 Gokulakrishnan Muthusamy. All rights reserved.</p>
          </div>
          <div className="footer-right">
            <a href="https://github.com/gokul-1998" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
            <a href="https://linkedin.com/in/gokulakrishnan-muthusamy-141a78201" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            <a href="mailto:gokulakrishnan.msamy@gmail.com"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </footer>
    </>
  );
}
