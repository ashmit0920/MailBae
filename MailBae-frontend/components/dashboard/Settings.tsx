'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import timezones from './timezones.json'
import { toast } from 'sonner';

const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Settings() {
    const [timezone, setTimezone] = useState('');
    const [sinceHour, setSinceHour] = useState(9);
    // const [autoSummaries, setAutoSummaries] = useState(true);
    // const [darkMode, setDarkMode] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUserSettings = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const meta = user?.user_metadata || {};
            setTimezone(meta.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
            setSinceHour(meta.since_hour || 9);
            // setAutoSummaries(meta.auto_summaries ?? true);
            // setDarkMode(meta.dark_mode ?? false);
        };

        fetchUserSettings();
    }, []);

    // Sort timezones alphabetically
    const sortedTimezones = [...timezones].sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    const handleSave = async () => {
        setSaving(true);
        const updates = {
            timezone,
            since_hour: sinceHour,
            // auto_summaries: autoSummaries,
            // dark_mode: darkMode,
        };

        const { error } = await supabase.auth.updateUser({
            data: updates,
        });

        if (error) {
            toast.error('Failed to update settings');
        } else {
            toast.success('Settings updated successfully!');
        }

        setSaving(false);
    };

    return (
        <div className="bg-white mt-5 rounded-2xl max-w-3xl space-y-6">

            {/* Timezone */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">Timezone</label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    {sortedTimezones.map((tz) => (
                        <option key={tz.tzCode} value={tz.tzCode}>
                            {tz.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Since Hour */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">Show emails since</label>
                <select
                    value={sinceHour}
                    onChange={(e) => setSinceHour(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    {hours.map((h) => (
                        <option key={h} value={h}>
                            {h.toString().padStart(2, '0')}:00
                        </option>
                    ))}
                </select>
            </div>

            {/* Auto Summaries */}
            {/* <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Enable Auto Summaries</label>
                <input
                    type="checkbox"
                    checked={autoSummaries}
                    onChange={(e) => setAutoSummaries(e.target.checked)}
                    className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
                />
            </div> */}

            {/* Dark Mode (optional toggle) */}
            {/* <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Dark Mode</label>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
                />
            </div> */}

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    );
}
