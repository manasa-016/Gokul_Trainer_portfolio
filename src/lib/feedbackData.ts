export interface StudentFeedback {
    name: string;
    slug: string;
}

export interface Institute {
    name: string;
    slug: string;
    students: StudentFeedback[];
}

export interface YearData {
    year: string;
    institutes: Institute[];
}

export const feedbackData: YearData[] = [
    {
        year: "2026",
        institutes: [
            {
                name: "Maharaja Institute of Technology, Mysore",
                slug: "MITM",
                students: [
                    { name: "Manasa", slug: "Manasa" },
                ],
            },
        ],
    },
];
