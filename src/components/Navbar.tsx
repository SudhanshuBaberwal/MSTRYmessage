'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User } from 'next-auth';
import { Sparkles } from 'lucide-react'; 

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl font-sans">
      <div className="container mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-100 transition-colors hover:text-indigo-400"
        >
          <Sparkles className="w-5 h-5 text-indigo-500" />
          True Feedback
        </Link>

        {/* Auth Cluster */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* Hidden on very small screens to keep the navbar clean */}
              <span className="hidden sm:inline-block text-sm font-medium text-slate-400">
                Welcome, <span className="text-indigo-400 font-bold">{user?.username || user?.email}</span>
              </span>
              
              <Button 
                onClick={() => signOut()} 
                variant="outline"
                className="cursor-pointer h-10 px-5 rounded-xl border-slate-700 bg-slate-900/50 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition-colors"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button 
                className="h-10 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;