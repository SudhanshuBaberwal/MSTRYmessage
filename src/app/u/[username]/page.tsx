'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params)
  const username = resolvedParams.username

  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [completion, setCompletion] = useState("")
  const initialMessages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?"
  ]
  const parseStringMessages = (messageString: string): string[] => {
    return messageString.split('||')
  }

  const isUserAcceptMessage = async (): Promise<boolean> => {
    try {
      const response = await axios.get("/api/accept-messages");
      return response.data.isAcceptingMessages;
    } catch (error) {
      console.error("Error fetching accept message status:", error);
      return false; // default value
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (content.trim().length < 10) {
      setStatus({ type: 'error', text: 'Message must be at least 10 characters long.' })
      return
    }

    setIsLoading(true)
    setStatus(null)
    const r = isUserAcceptMessage()
    if (!r) {
      return
    }
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message")
      }

      setStatus({ type: 'success', text: data.message || "Message sent securely!" })
      setContent('')

    } catch (error: any) {
      setStatus({ type: 'error', text: error.message || "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  const suggestMessageToUser = async () => {
    setIsSuggestLoading(true)
    setStatus(null)
    setCompletion("")

    try {
      const response = await fetch("/api/suggest-messages", { method: "POST" })

      if (!response.body) {
        setStatus({ type: 'error', text: "Can't connect to AI suggestion service." })
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        text += decoder.decode(value, { stream: true })
        setCompletion(text)
      }

    } catch (error) {
      setStatus({ type: 'error', text: "Failed to generate questions. Please try again." })
    } finally {
      setIsSuggestLoading(false)
    }
  }

  const displayMessages = completion.length > 0 ? parseStringMessages(completion) : initialMessages

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-x-hidden flex flex-col items-center py-16 px-4 sm:px-6">

      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-150 h-125 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-2xl space-y-10">

        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Send a Secret
          </h1>
          <p className="text-slate-400 text-lg">
            Send an anonymous message to <span className="text-indigo-400 font-bold">@{username}</span>
          </p>
        </div>

        {status && (
          <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-lg border backdrop-blur-md ${status.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
            {status.text}
          </div>
        )}

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 p-6 md:p-8 rounded-[2rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="message" className="block text-sm font-bold text-slate-300 ml-1">
                Your Message
              </label>
              <textarea
                id="message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something nice, funny, or brutally honest..."
                className="w-full min-h-40 p-5 bg-slate-950/50 border border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-y transition-all text-base"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || content.trim().length === 0}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending...' : 'Send Secret Message'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-200">Need inspiration?</h3>
              <p className="text-sm text-slate-500 mt-1">Select a suggested message below.</p>
            </div>
            <button
              onClick={suggestMessageToUser}
              disabled={isSuggestLoading}
              className="bg-slate-800/50 text-indigo-300 border border-slate-700/50 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 hover:text-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              {isSuggestLoading ? 'Generating...' : 'Generate Suggestions'}
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-[1.5rem] overflow-hidden min-h-35">
            <div className="p-4 sm:p-6 flex flex-col gap-3">
              {displayMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => setContent(message)}
                  className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-indigo-500/30 hover:bg-slate-900 transition-all text-slate-300 text-sm leading-relaxed"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-slate-800/60 my-12" />

        <div className="text-center space-y-6 pb-8">
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-slate-100">Want your own message board?</h4>
            <p className="text-slate-400">Create a free account to start receiving secret feedback.</p>
          </div>
          <Link href="/sign-up" className="inline-block">
            <button className="bg-slate-100 text-slate-900 px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-colors shadow-lg">
              Create Your Account
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}