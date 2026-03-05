import Link from "next/link";
import { feedbackData } from "@/lib/feedbackData";
import "./Feedbacks.css";

export const metadata = {
    title: "Training Feedbacks | Archive",
    description: "Browse training feedback records by year.",
};

export default function FeedbacksPage() {
    return (
        <div className="feedbacks-list-wrapper">
            <div className="feedbacks-container">
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="current-page">Trainings</span>
                </div>

                <div className="feedbacks-header">
                    <h1 className="feedbacks-title">Training Feedbacks</h1>
                    <p className="feedbacks-subtitle">Select a year to view feedback records</p>
                </div>

                <div className="feedbacks-grid">
                    {feedbackData.map((data) => (
                        <Link
                            key={data.year}
                            href={`/trainings/feedbacks/${data.year}`}
                            className="feedback-card"
                        >
                            <div className="card-icon">
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <h2 className="card-title">{data.year} Series</h2>
                            <p className="card-info">{data.institutes.length} Institutions</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
