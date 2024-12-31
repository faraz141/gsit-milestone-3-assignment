'use client'; // Needed for client-side hooks like useState and useEffect

import React from 'react';
import Link from 'next/link';
// import Navbar from '@/components/navbar'; // Assuming you have a Navbar component

export default function HomePage() {
  return (
    <div className=" bg-transparent min-h-screen mt-10">
      {/* <Navbar /> */}
      <div className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Our Blog</h1>
          <p className="text-lg mb-8">
            Discover insights, ideas, and inspiration from our community of
            writers.
          </p>
          <Link
            href="/blog"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition"
          >
            Explore Blog Posts
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-4">Latest Posts</h2>
        {/* You can add a list of latest posts here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example of a post card */}
          <div className="bg-black opacity-80  shadow-lg rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold">Post Title 1</h3>
            <p className="text-white mt-2">
              A brief description of the post goes here.
            </p>
            <Link href="/blog/1" className="text-blue-500 mt-4 inline-block">
              Read More →
            </Link>
          </div>
          <div className="bg-black opacity-80 shadow-lg rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold">Post Title 2</h3>
            <p className="text-white  mt-2">
              A brief description of the post goes here.
            </p>
            <Link href="/blog/2" className="text-blue-500 mt-4 inline-block">
              Read More →
            </Link>
          </div>
          <div className="bg-black opacity-80 shadow-lg rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold">Post Title 3</h3>
            <p className="text-white mt-2">
              A brief description of the post goes here.
            </p>
            <Link href="/blog/3" className="text-blue-500 mt-4 inline-block">
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
