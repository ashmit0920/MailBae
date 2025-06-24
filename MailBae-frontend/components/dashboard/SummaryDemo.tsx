import { useEffect, useState } from "react";

export default function SummaryDemo() {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8000/api/summarize", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                setSummary(data.summary);
                const bullets = summary?.match(/[^.!?]+[.!?]/g) || []; //bullets
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading summary...</p>
            ) : (
                <p className="text-gray-600 whitespace-pre-wrap">{summary}</p>
            )}
        </div>
    );
}
