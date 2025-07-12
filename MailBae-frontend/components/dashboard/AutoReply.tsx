'use client'

import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Optional: Define the shape of each reply
type AutoReply = {
    sender: string,
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
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            // revalidateOnMount: false,
        }
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-lg text-gray-500">Loading replies...</p>
            </div>
        );
    }

    if (error || !data || Object.keys(data).length === 0) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-lg text-gray-500">No replies available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {Object.entries(data).map(([id, details], index) => {
                const { sender, needs_reply, classification_rationale, draft } = details;

                return (
                    <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 flex flex-col h-full">
                            <CardHeader className="flex flex-col space-y-2">
                                <CardTitle className="text-lg font-semibold text-blue-900 break-words max-w-full">{sender}</CardTitle>
                                <Badge variant={needs_reply ? "default" : "destructive"} className={`text-xs font-bold w-fit py-1 ${needs_reply ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {needs_reply ? "Reply Needed" : "No Action"}
                                </Badge>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-gray-600 mb-4">
                                    <strong>Reason:</strong> {classification_rationale}
                                </p>
                                {needs_reply && (
                                    <div className="bg-blue-50 p-4 rounded-lg mt-4 text-sm text-gray-800 border border-blue-200">
                                        <p className="font-bold mb-2 text-blue-800">✉️ Suggested Reply</p>
                                        <p>{draft}</p>
                                    </div>
                                )}
                            </CardContent>
                            {needs_reply && (
                                <CardFooter className="flex justify-end space-x-3 mt-auto pt-4">
                                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                        Edit
                                    </Button>
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                        Send Reply
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
