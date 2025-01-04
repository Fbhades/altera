'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SocialPage() {
  const router = useRouter()
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [comment, setComment] = useState('')
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(42)

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsUpvoted(!isUpvoted)
    setUpvoteCount(prev => isUpvoted ? prev - 1 : prev + 1)
    // Here you would typically send the upvote to your API
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    // Here you would typically send the comment to your API
    console.log('Comment submitted:', comment)
    setComment('')
    setShowCommentInput(false)
  }

  const examplePost = {
    id: 1,
    title: "My First Flight Experience",
    content: "Just had an amazing flight! The service was excellent and the views were breathtaking...",
    authorName: "John Doe",
    authorPhoto: "/default-avatar.png",
    createdAt: new Date().toISOString(),
    upvotes: 42,
    comments: Array(5),
    photos: ["/default-avatar.png", "/default-avatar.png"]
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Community Posts</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <Image
                src={examplePost.authorPhoto}
                alt={examplePost.authorName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <h2 className="font-semibold text-gray-800">{examplePost.authorName}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(examplePost.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{examplePost.title}</h3>
            <p className="text-gray-600 mb-4">{examplePost.content}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {examplePost.photos.map((photo, index) => (
                <div key={index} className="relative h-48">
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex items-center text-gray-500 space-x-4">
              <button 
                onClick={handleUpvote}
                className={`flex items-center hover:text-blue-600 ${isUpvoted ? 'text-blue-600' : ''}`}
              >
                <svg className="w-5 h-5 mr-1" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
                <span>{upvoteCount}</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation() // Prevent post click event
                  setShowCommentInput(!showCommentInput)
                }}
                className="flex items-center hover:text-blue-600"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span>{examplePost.comments.length}</span>
              </button>
            </div>

            {showCommentInput && (
              <form onSubmit={handleSubmitComment} className="mt-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()} // Prevent post click event
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowCommentInput(false)
                      setComment('')
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Comment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
