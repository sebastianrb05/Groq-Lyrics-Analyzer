import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GroqTranscribe',
  description: 'Transcribe and analyze audio using Groq AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-300">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
} 