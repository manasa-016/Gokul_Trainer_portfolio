import Link from "next/link";
import { notFound } from "next/navigation";
import { feedbackData } from "@/lib/feedbackData";

export function generateStaticParams() {
    return feedbackData.map((d) => ({
        year: d.year,
    }));
}
import "../Feedbacks.css";

type Props = {
    params: Promise<{
        year: string;
    }>;
};

export async function generateMetadata({ params }: Props) {
    const { year } = await params;
    return {
        title: `Feedbacks for ${year} | Training Portfolio`,
        description: `Browse institutions and training sessions for the year ${year}.`,
    };
}

export default async function YearPage({ params }: Props) {
    const { year } = await params;
    const yearData = feedbackData.find((d) => d.year === year);

    if (!yearData) {
        notFound();
    }

    return (
        <div className="feedbacks-list-wrapper">
            <div className="feedbacks-container">
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link href="/trainings/feedbacks">Trainings</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="current-page">{year}</span>
                </div>

                <div className="feedbacks-header">
                    <h1 className="feedbacks-title">Institutions: {year}</h1>
                    <p className="feedbacks-subtitle">Browse sessions conducted in {year}</p>
                </div>

                <div className="feedbacks-grid">
                    {yearData.institutes.map((inst) => (
                        <Link
                            key={inst.slug}
                            href={`/trainings/feedbacks/${year}/${inst.slug}`}
                            className="feedback-card"
                        >
                            <div className="card-icon">
                                <i className="fas fa-university"></i>
                            </div>
                            <h2 className="card-title">{inst.name}</h2>
                            <p className="card-info">{inst.students.length} Feedback Records</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
