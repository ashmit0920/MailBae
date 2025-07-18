'use client';
import { useState } from "react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type AutoReply = {
    sender: string;
    needs_reply: boolean;
    classification_rationale: string;
    draft: string;
};

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
    return replies.result || {};
};

export default function AutoReply() {
    const { data, error, isLoading } = useSWR(
        "http://localhost:8000/api/auto_respond",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );

    // Hold edited drafts and editing state per message ID
    const [editedDrafts, setEditedDrafts] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});

    const startEditing = (id: string, original: string) => {
        setEditedDrafts(d => ({ ...d, [id]: original }));
        setIsEditing(e => ({ ...e, [id]: true }));
    };

    const onDraftChange = (id: string, val: string) => {
        setEditedDrafts(d => ({ ...d, [id]: val }));
    };

    const stopEditing = (id: string) => {
        setIsEditing(e => ({ ...e, [id]: false }));
    };

    // Function to send the drafted reply
    const handleSendReply = async (to: string, message: string) => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            alert("Could not get your user info. Please re-login.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/send_email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_email: user.email,  // sender of the email
                    to,                      // reply recipient
                    subject: "",             // blank subject for now
                    message,
                }),
            });

            const payload = await res.json();
            if (res.ok) {
                toast.success("Reply sent! Message ID: " + payload.message_id);
            } else {
                toast.error("Failed to send reply: " + payload.detail);
            }
        } catch (e) {
            toast.error("❌ Error contacting server.");
            console.error(e);
        }
    };

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
                const editing = isEditing[id] || false;
                const currentDraft = editing ? editedDrafts[id] : draft;

                return (
                    <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 flex flex-col h-full">
                            <CardHeader className="flex flex-col space-y-2">
                                <CardTitle className="text-lg font-semibold text-blue-900 break-words max-w-full">
                                    {sender}
                                </CardTitle>
                                <Badge
                                    variant={needs_reply ? "default" : "destructive"}
                                    className={`text-xs font-bold w-fit py-1 ${needs_reply
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                        }`}
                                >
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
                                        {editing ? (
                                            <textarea
                                                className="w-full h-32 p-2 border rounded"
                                                value={currentDraft}
                                                onChange={e => onDraftChange(id, e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{currentDraft}</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            {needs_reply && (
                                <CardFooter className="flex justify-end space-x-3 mt-auto pt-4">
                                    {editing ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="text-gray-700 hover:bg-gray-100"
                                                onClick={() => stopEditing(id)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={() => {
                                                    stopEditing(id);
                                                    handleSendReply(sender, currentDraft);
                                                }}
                                            >
                                                Send Edited Reply
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="text-gray-700 hover:bg-gray-100"
                                                onClick={() => startEditing(id, draft)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                className="bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={() => handleSendReply(sender, draft)}
                                            >
                                                Send Reply
                                            </Button>
                                        </>
                                    )}
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
