import Link from "next/link";
import { notFound } from "next/navigation";
import { feedbackData } from "@/lib/feedbackData";
import "../../Feedbacks.css";

export function generateStaticParams() {
    const params: { year: string; institute: string }[] = [];
    for (const year of feedbackData) {
        for (const inst of year.institutes) {
            params.push({ year: year.year, institute: inst.slug });
        }
    }
    return params;
}

type Props = {
    params: Promise<{
        year: string;
        institute: string;
    }>;
};

export async function generateMetadata({ params }: Props) {
    const { year, institute } = await params;
    const yearData = feedbackData.find((d) => d.year === year);
    const instituteData = yearData?.institutes.find((i) => i.slug === institute);

    return {
        title: `Student Feedbacks: ${instituteData?.name || institute} | ${year}`,
        description: `Browse student training feedback for ${instituteData?.name || institute} in ${year}.`,
    };
}

export default async function InstitutePage({ params }: Props) {
    const { year, institute } = await params;
    const yearData = feedbackData.find((d) => d.year === year);
    const instituteData = yearData?.institutes.find((i) => i.slug === institute);

    if (!instituteData) {
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
                    <Link href={`/trainings/feedbacks/${year}`}>{year}</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="current-page">{instituteData.slug.toUpperCase()}</span>
                </div>

                <div className="feedbacks-header">
                    <h1 className="feedbacks-title">{instituteData.name}</h1>
                    <p className="feedbacks-subtitle">Select a student to view their feedback</p>
                </div>

                <div className="feedbacks-grid">
                    {instituteData.students.map((student) => (
                        <Link
                            key={student.slug}
                            href={`/trainings/feedbacks/${year}/${institute}/${student.slug}`}
                            className="feedback-card"
                        >
                            <div className="card-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <h2 className="card-title">{student.name}</h2>
                            <p className="card-info">View Detailed Report</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
