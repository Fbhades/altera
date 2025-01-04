'use client'
import React, { useEffect, useState } from 'react'
import { Post, Profile } from '../Interface/interface'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { HistoryModal } from '../components/history-modal'
import { Button } from '@/components/ui/button'
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const [profile, setProfile] = useState<Profile>({
      id: 0,
      username: '',
      email: '',
      profilePicture: '',
      bio: '',
      followers: [],
      following: [],
      posts: [],
      joinedDate: new Date()
    })
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const router = useRouter()
  const [showHistory, setShowHistory] = useState(false)
  const [reservationHistory, setReservationHistory] = useState([])
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({ content: '' });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        try {
          const primaryEmail = user.primaryEmailAddress?.emailAddress;
          if (primaryEmail) {
            const response = await fetch(`/api/auth/${encodeURIComponent(primaryEmail)}`);
            if (response.ok) {
              const userData = await response.json();
              // Use userData.id for fetching reservations
              const reservationsResponse = await fetch(`/api/admin/resevation?userid=${userData.id}`);
              if (reservationsResponse.ok) {
                const reservationsData = await reservationsResponse.json();
                setReservationHistory(reservationsData);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isSignedIn, user]);

  const fetchReservationHistory = async () => {
    if (isSignedIn && user) {
      try {
        const primaryEmail = user.primaryEmailAddress?.emailAddress;
        if (primaryEmail) {
          const response = await fetch(`/api/auth/${encodeURIComponent(primaryEmail)}`);
          if (response.ok) {
            const userData = await response.json();
            const reservationsResponse = await fetch(`/api/admin/resevation?userid=${userData.id}`);
            if (!reservationsResponse.ok) throw new Error('Failed to fetch reservations');
            const data = await reservationsResponse.json();
            setReservationHistory(data);
          }
        }
      } catch (error) {
        console.error('Error fetching reservation history:', error);
      }
    }
  };

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const profileResponse = await fetch('/api/profile');
        const profileData = await profileResponse.json();
        setProfile(profileData);

        const postsResponse = await fetch(`/api/posts?userId=${profileData.id}`);
        const postsData = await postsResponse.json();
        setUserPosts(postsData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileAndPosts();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user || !newPost.content.trim()) return;

    try {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      if (!primaryEmail) return;

      const userResponse = await fetch(`/api/auth/${encodeURIComponent(primaryEmail)}`);
      if (!userResponse.ok) throw new Error('Failed to get user data');
      const userData = await userResponse.json();

      // Match the API's expected format exactly
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userData.userid,
          content: newPost.content.trim()
        }),
      });
      console.log(userData.userid);
      console.log(newPost.content.trim());

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      const createdPost = await response.json();
      setUserPosts([createdPost, ...userPosts]);
      setShowPostDialog(false);
      setNewPost({ content: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="relative h-32 w-32">
              <Image
                src={profile.profilePicture || '/default-avatar.png'}
                alt={profile.username || 'User'}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="ml-8">
              <h1 className="text-3xl font-bold text-gray-800">{profile.username || 'Loading...'}</h1>
              <p className="text-gray-600 mt-2">{profile.email || 'Loading...'}</p>
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
          <div className="mt-4">
            <Button
              onClick={() => {
                fetchReservationHistory();
                setShowHistory(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              View Reservation History
            </Button>
          </div>
        </div>

        {/* User's Posts */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
          <Button
            onClick={() => setShowPostDialog(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Create Post
          </Button>
        </div>
        <div className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
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
                
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{post.content}</h4>
                <p className="text-gray-600 mb-4">{post.content}</p>
                
                <div className="flex items-center text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-center text-gray-500">No posts available</p>
            </div>
          )}
        </div>
      </div>
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        reservations={reservationHistory}
      />
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                rows={4}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              {selectedImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={() => setShowPostDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

