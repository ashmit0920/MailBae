import useSWR from "swr";
import { supabase } from '@/lib/supabase';

type SummaryCategory = {
    category: string;
    points: string[];
};

// pastel-ish backgrounds; cycle through as needed
const categoryBgClasses = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-pink-50",
    "bg-indigo-50",
];

const fetcher = async (url: string) => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        console.error("User not found:", error);
        return;
    }

    const timezone = user.user_metadata?.timezone;
    const since_hour = user.user_metadata?.since_hour ?? 9;

    const res = await fetch(`${url}?user_email=${user.email}&timezone=${timezone}&since_hour=${since_hour}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return typeof data.summary === "string" ? JSON.parse(data.summary) : data.summary;
};

export default function SummaryCards() {
    const { data: summaryData, error, isLoading } = useSWR<SummaryCategory[]>(
        "http://localhost:8000/api/summarize",
        fetcher,
        {
            revalidateOnFocus: false, // optional: don't refetch on tab switch
        }
    );

    if (isLoading) {
        return <p className="text-gray-500">Loading summary...</p>;
    }

    if (error || !summaryData || summaryData.length === 0) {
        return <p className="text-gray-500">No summary available.</p>;
    }

    return (
        <div className="space-y-12">
            {summaryData.map(({ category, points }, idx) => (
                <div key={category}>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {points.map((point, i) => (
                            <div
                                key={i}
                                className={`
                  ${categoryBgClasses[idx % categoryBgClasses.length]}
                  p-6 rounded-2xl shadow-sm border border-gray-100
                  hover:shadow-lg transition-shadow duration-200
                `}
                            >
                                <p className="text-gray-700 leading-relaxed">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
