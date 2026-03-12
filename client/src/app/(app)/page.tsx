'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Quote } from 'lucide-react' // Swapped Mail for Quote to fit the premium aesthetic

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">

      {/* Main content */}
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-20">

        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl mx-auto space-y-6">

          {/* Subtle Status Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-2 text-sm font-semibold tracking-wide text-slate-900 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Now open for feedback
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Dive into the World of <br className="hidden md:block mt-2" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-500">
              Anonymous Feedback
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mt-6">
            True Feedback — Where your identity remains a secret, and your words make a genuine impact.
          </p>
        </section>

        {/* Carousel for Messages */}
        <div className="w-full max-w-lg md:max-w-2xl px-4">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]} // Slightly increased delay so users can read the text
            className="w-full"
            opts={{ loop: true }} // Added loop so the carousel doesn't awkwardly stop at the end
          >
            <CarouselContent className="-ml-4">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/1">
                  {/* Extra padding inside the item to prevent the shadow from being clipped by the carousel wrapper */}
                  <div className="p-4">
                    <Card className="bg-white border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                      <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center space-y-6">

                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-2">
                          <Quote className="w-5 h-5 fill-current" />
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                            {message.title}
                          </h3>
                          <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                            "{message.content}"
                          </p>
                        </div>

                        {/* Subtle divider */}
                        <div className="w-12 h-1 bg-slate-100 rounded-full my-2"></div>

                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          {message.received || "Anonymous"}
                        </p>

                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white py-8 text-center">
        <p className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} True Feedback. All rights reserved.
        </p>
      </footer>
    </div>
  );
}