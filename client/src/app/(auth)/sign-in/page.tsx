'use client'
import { useSession, signIn, signOut } from "next-auth/react"

const page = () => {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed In as {session?.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div>
      Not signed in <br />
      <button className="bg-orange-500 px-3 py-1 m-4 rounded cursor-pointer" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

export default page