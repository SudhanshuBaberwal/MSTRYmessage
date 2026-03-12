'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params)
  const username = resolvedParams.username

  // Native React State (No react-hook-form needed)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  
  // Custom status message state to replace react-hot-toast
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 1. Send Message Logic (Using native fetch instead of axios)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic native validation (Replacing Zod)
    if (content.trim().length < 10) {
      setStatus({ type: 'error', text: 'Message must be at least 10 characters.' })
      return
    }

    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message")
      }

      setStatus({ type: 'success', text: data.message || "Message sent successfully!" })
      setContent('') // Clear the text area

    } catch (error: any) {
      setStatus({ type: 'error', text: error.message || "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Suggest Messages Logic (Native fetch streaming)
  const suggestMessageToUser = async () => {
    setIsSuggestLoading(true)
    setStatus(null)
    
    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
      })

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
      }

      const generatedQuestions = text.split("||").filter((q) => q.trim() !== "")
      setQuestions(generatedQuestions)

    } catch (error) {
      setStatus({ type: 'error', text: "Failed to generate questions. Please try again." })
    } finally {
      setIsSuggestLoading(false)
    }
  }

  // 3. Render purely with Tailwind utility classes
  return (
    <div className="container mx-auto my-12 px-6 max-w-4xl text-slate-900 font-sans">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-900">
        Public Profile Link
      </h1>
      
      {/* Status Message Display */}
      {status && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {status.text}
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700">
              Send Anonymous Message to @{username}
            </label>
            <textarea
              id="message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your anonymous message here..."
              className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-y"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={isLoading || content.trim().length === 0}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? 'Sending...' : 'Send It'}
            </button>
          </div>
        </form>
      </div>

      {/* Suggestion Section */}
      <div className="space-y-6 mb-12">
        <div className="space-y-2">
          <button
            onClick={suggestMessageToUser}
            disabled={isSuggestLoading}
            className="bg-slate-100 text-slate-800 border border-slate-300 px-6 py-2 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isSuggestLoading ? 'Generating...' : 'Suggest Messages'}
          </button>
          <p className="text-sm text-slate-500">Click on any message below to select it.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-800">Messages</h3>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {questions.length > 0 ? (
              questions.map((message, index) => (
                <button
                  key={index}
                  onClick={() => setContent(message)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors text-slate-700 text-sm leading-relaxed"
                >
                  {message}
                </button>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">
                No suggestions yet. Click the button above to generate some!
              </p>
            )}
          </div>
        </div>
      </div>
      
      <hr className="border-slate-200 my-8" />
      
      {/* Footer CTA */}
      <div className="text-center space-y-4">
        <div className="font-semibold text-lg text-slate-800">Get Your Message Board</div>
        <Link href="/sign-up">
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
            Create Your Account
          </button>
        </Link>
      </div>

    </div>
  )
}