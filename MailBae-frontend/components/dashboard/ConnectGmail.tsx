'use client'
import { signIn } from 'next-auth/react'

export default function GmailConnectButton() {
    return (
        <button
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Connect Gmail
        </button>
    )
}
