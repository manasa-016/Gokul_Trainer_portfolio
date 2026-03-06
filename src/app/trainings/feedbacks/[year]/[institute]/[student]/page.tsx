import { Metadata } from "next";
import Link from "next/link";
import { feedbackData } from "@/lib/feedbackData";
import "./Feedback.css";

export function generateStaticParams() {
  const params: { year: string; institute: string; student: string }[] = [];
  for (const year of feedbackData) {
    for (const inst of year.institutes) {
      for (const student of inst.students) {
        params.push({ year: year.year, institute: inst.slug, student: student.slug });
      }
    }
  }
  return params;
}

type Props = {
  params: Promise<{
    year: string;
    institute: string;
    student: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, institute, student } = await params;
  const studentName = student.charAt(0).toUpperCase() + student.slice(1);
  return {
    title: `Feedback: ${studentName} | ${institute} ${year}`,
    description: `Training feedback for ${studentName} from ${institute}, class of ${year}.`,
  };
}

export default async function FeedbackPage({ params }: Props) {
  const { year, institute, student } = await params;

  // Format the name for display
  const studentName = student.charAt(0).toUpperCase() + student.slice(1);
  const instituteName = institute.toUpperCase();

  return (
    <div className="feedback-page-wrapper">
      <div className="feedback-container">
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/trainings/feedbacks">Trainings</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/trainings/feedbacks/${year}`}>{year}</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/trainings/feedbacks/${year}/${institute}`}>{instituteName}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="current-page">{studentName}</span>
        </div>

        {/* Header/Logo Section */}
        <div className="feedback-header">
          <Link href="/" className="feedback-logo">&lt;GK/&gt;</Link>
          <div className="header-meta">
            <span className="meta-tag">Training Feedback Portfolio</span>
            <span className="meta-date">{year} Series</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="feedback-content-card">

          <div className="student-profile">
            <div className="profile-initials">{studentName.charAt(0)}</div>
            <div className="profile-info">
              <h1 className="student-name">{studentName}</h1>
              <p className="student-institute">{instituteName} • Batch of {year}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="feedback-body">
            <h2 className="section-subtitle">Training Experience</h2>
            <p className="feedback-text">
              The training sessions provided by <strong>Gokulakrishnan Muthusamy</strong> were highly impactful and practical.
              The curriculum was tailored to meet industry standards, particularly in the fields of AI, Data Science, and Python Full-Stack development.
            </p>

            <div className="ratings-grid">
              <div className="rating-item">
                <span className="rating-label">Technical Depth</span>
                <div className="rating-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <div className="rating-item">
                <span className="rating-label">Practical Delivery</span>
                <div className="rating-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="feedback-footer">
            <div className="trainer-sign">
              <p className="sign-role">Training Mentor</p>
              <p className="sign-name">Gokulakrishnan M.</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="back-link-wrapper">
          <Link href={`/trainings/feedbacks/${year}/${institute}`} className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Student List
          </Link>
        </div>
      </div>
    </div>
  );
}
