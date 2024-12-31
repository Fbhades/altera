'use client'
import React, { useEffect, useState } from 'react'
import { Post, Profile } from '../Interface/interface'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetch('/api/profile');
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch user's posts using their profile ID
        const postsResponse = await fetch(`/api/posts?userId=${profileData.id}`);
        const postsData = await postsResponse.json();
        setUserPosts(postsData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="relative h-32 w-32">
              <Image
                src={profile.profilePicture || '/default-avatar.png'}
                alt={profile.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="ml-8">
              <h1 className="text-3xl font-bold text-gray-800">{profile.username}</h1>
              <p className="text-gray-600 mt-2">{profile.email}</p>
              <div className="mt-4 flex space-x-4">
                <div className="text-center">
                  <span className="block font-bold text-gray-800">{userPosts.length}</span>
                  <span className="text-gray-600">Posts</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-800">{profile.followers?.length || 0}</span>
                  <span className="text-gray-600">Followers</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-800">{profile.following?.length || 0}</span>
                  <span className="text-gray-600">Following</span>
                </div>
              </div>
            </div>
          </div>
          {profile.bio && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-800 mb-2">About</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* User's Posts */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts</h2>
        <div className="space-y-6">
          {userPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/post/${post.id}`)}
            >
              <div className="flex items-center mb-4">
                <Image
                  src={profile.profilePicture || '/default-avatar.png'}
                  alt={profile.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">{profile.username}</h3>
                  <p className="text-sm text-gray-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
              </div>
              
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h4>
              <p className="text-gray-600 mb-4">{post.content}</p>
              
              {post.photos && post.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {post.photos.map((photo, index) => (
                    <div key={index} className="relative h-48">
                      <Image
                        src={photo}
                        alt={`${post.title} - Photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center text-gray-500 space-x-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>{post.upvotes || 0}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
          {userPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
