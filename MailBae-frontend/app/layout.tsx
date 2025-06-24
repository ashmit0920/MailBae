import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MailBae - AI-Powered Email Management',
  description: 'Transform your email experience with MailBae\'s AI-powered responder. Auto-sort, reply, and summarize your emails. 7-day free trial.',
  keywords: 'email management, AI email, auto-responder, email organization, productivity, mailbae, auto reply, smart email, AI inbox, AI gmail, AI outlook',
  authors: [{ name: 'MailBae Team' }],
  openGraph: {
    title: 'MailBae - Your Inbox\'s BFF',
    description: 'AI-powered email management that sorts, replies, and summarizes your mail automatically.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" style={{ fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif' }}>
      <body className="bg-white text-gray-900" style={{ fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  );
}

