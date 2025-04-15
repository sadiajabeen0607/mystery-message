"use client"
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar = () => {
  const { data: session} = useSession();

  const user: User = session?.user as User;
  
  return (
    <nav className='p-4 md:p-6 shadow-md w-full'>
      <div className='container mx-auto flex flex-row items-center justify-between space-x-4 w-full'>
        <Link className='text-xl md:mb-0 font-bold w-20 md:w-auto' href="/">Mystery Message</Link>

        {
          session ? (
            <>
              <p className='mr-2 w-28 md:w-auto'>Welcome, <span className=' pl-1 font-bold'> {user?.username || user?.email}</span></p>
              <Button className='w-auto sm:w-24 md:w-auto' onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <Link href="/signIn">
              <Button className=''>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
