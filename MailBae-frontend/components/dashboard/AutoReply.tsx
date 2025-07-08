import useSWR from "swr";
import { supabase } from "@/lib/supabase";

// Optional: Define the shape of each reply
type AutoReply = {
    needs_reply: boolean;
    classification_rationale: string;
    draft: string;
};

// The fetcher that gets replies
const fetcher = async (url: string): Promise<Record<string, AutoReply>> => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        console.error("User not found:", error);
        return {};
    }

    const timezone = user.user_metadata?.timezone;
    const since_hour = user.user_metadata?.since_hour ?? 9;

    const res = await fetch(
        `${url}?user_email=${user.email}&timezone=${timezone}&since_hour=${since_hour}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
    );

    const replies = await res.json();
    return replies.result || {}; // extract `result` object
};

// Component
export default function AutoReply() {
    const { data, error, isLoading } = useSWR(
        "http://localhost:8000/api/auto_respond",
        fetcher,
        { revalidateOnFocus: false }
    );

    if (isLoading) return <p className="text-gray-500">Loading replies...</p>;
    if (error || !data || Object.keys(data).length === 0)
        return <p className="text-gray-500">No replies available.</p>;

    return (
        <div className="space-y-6">
            {Object.entries(data).map(([sender, details]) => {
                const { needs_reply, classification_rationale, draft } = details;

                return (
                    <div
                        key={sender}
                        className="border p-4 rounded-lg shadow-sm bg-white space-y-2"
                    >
                        <p className="font-semibold text-gray-700">From: {sender}</p>
                        <p className="text-sm text-gray-600">
                            Needs Reply: {needs_reply ? "✅ Yes" : "❌ No"}
                        </p>
                        <p className="text-sm text-gray-600">
                            Reason: {classification_rationale}
                        </p>
                        {needs_reply && (
                            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-800">
                                ✉️ <strong>Draft Reply:</strong> {draft}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
