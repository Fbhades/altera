"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
// import { Avatar } from "@/components/ui/avatar";
import { HistoryModal } from "../../components/history-modal";

interface Post {
  id: number;
  content: string;
  created_at: string;
  upvotes: number;
  comment_count: number;
  has_upvoted: boolean;
}

interface Comment {
  comment_id: number;
  user_id: number;
  user_name: string;
  comment_content: string;
  created_at: string;
}

interface U {
    userID: number;
    name: string;
    email: string;
  }

export default function ProfilePage() {
    const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [reservationHistory, setReservationHistory] = useState([]);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({ content: "" });
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [followingNames, setFollowingNames] = useState<string[]>([]);
  const [showFollowingNames, setShowFollowingNames] = useState(false);
  const [followerNames, setFollowersNames] = useState<string[]>([]);
  const [showFollowerNames, setShowFollowerNames] = useState(false);
  const [currentUser, setCurrentUser] = useState<U | null>(null); // State for user data


  useEffect(() => {
    const fetchUserData = async () => {
        if (id) {
            const response = await fetch(
                `/api/user/${(id)}`
            );
            if (response.ok) {
                const userData: U = await response.json(); // Fetch and type the user data
                setCurrentUser({ // Update state with fetched user data
                    userID: userData.userID,
                    name: userData.name,
                    email: userData.email,
                });          
            }
            // Fetch data using the provided id
            await fetchReservationHistory(id as string);
            await fetchFollowerCounts(id as string);
            await fetchUserPosts(id as string);
        } else if (isSignedIn && user) { // Corrected to 'else if'
            try {
                const primaryEmail = user.primaryEmailAddress?.emailAddress;
                if (primaryEmail) {
                    const response = await fetch(
                        `/api/auth/${encodeURIComponent(primaryEmail)}`
                    );
                    if (response.ok) {
                        const userData = await response.json();
                        await fetchReservationHistory(userData.userid);
                        await fetchFollowerCounts(userData.userid);
                        await fetchUserPosts(userData.userid);
                        setCurrentUser({ // Update state with fetched user data
                            userID: userData.userID,
                            name: userData.name,
                            email: userData.email,
                        });  
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    fetchUserData();
}, [id, isSignedIn, user]); // Added 'id' to the dependency array


  const fetchReservationHistory = async (userId: string) => {
    try {
      const reservationsResponse = await fetch(
        `/api/admin/resevation/${id}`
      );
      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        setReservationHistory(reservationsData);
      }
    } catch (error) {
      console.error("Error fetching reservation history:", error);
    }
  };

  const fetchFollowerCounts = async (userId: string) => {
    try {
      const followersCountResponse = await fetch(`/api/followers/${userId}`);
      const followingCountResponse = await fetch(`/api/following/${userId}`);
  
      if (followersCountResponse.ok && followingCountResponse.ok) {
        const followersData = await followersCountResponse.json();
        const followingData = await followingCountResponse.json();
  
        const followersNamesResponse = await fetch(`/api/getfollowing/${userId}`);
      if (followersNamesResponse.ok) {
        const followersNamesData = await followersNamesResponse.json();
        setFollowersNames(followersNamesData.followers);  // Assuming names are returned in this format
      }
        // Fetch names of the users you're following
        const followingNamesResponse = await fetch(`/api/getfollowers/${userId}`);
        if (followingNamesResponse.ok) {
          const followingNamesData = await followingNamesResponse.json();
          setFollowingNames(followingNamesData.followers);  // Assuming names are returned in this format
        }
        
        setFollowerCount(followersData.followerCount);
        setFollowingCount(followingData.following_count);
      }
    } catch (error) {
      console.error("Error fetching follower counts:", error);
    }
  };
  
  

  const fetchUserPosts = async (userId: string) => {
    try {
      console.log(userId)
      const response = await fetch(`/api/post?userid=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const postsData = await response.json();
      setUserPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleUpvote = async (postId: number) => {
    try {
      // Don't allow upvoting if user has already upvoted
      const post = userPosts.find(p => p.id === postId);
      if (post?.has_upvoted) {
        return;
      }
  
      const primaryEmail = user?.primaryEmailAddress?.emailAddress;
      if (!primaryEmail) return;
  
      const userResponse = await fetch(
        `/api/auth/${encodeURIComponent(primaryEmail)}`
      );
      if (!userResponse.ok) throw new Error("Failed to get user data");
      const userData = await userResponse.json();
  
      console.log({
        postid: postId,
        upvote: true,
        downvote: false,
      });

      const response = await fetch(`/api/postUser/${userData.userid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postid: postId,
          upvote: true,
          downvote: false,
        }),
      });

      const reader = response.body?.getReader();
      if (reader) {
        const { done, value } = await reader.read();
        if (!done && value) {
          console.log(new TextDecoder().decode(value));
        } else {
          console.log("Response body is empty");
        }
      } else {
        console.log("No response body");
      }
  
      if (response.ok) {
        const data = await response.json();
        setUserPosts((posts) =>
          posts.map((post) =>
            post.id === postId
              ? { ...post, upvotes: data.upvotes, has_upvoted: true }
              : post
          )
        );
      } else {
        const error = await response.json();
        console.error("Failed to upvote:", error.message);
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleShowComments = async (postId: number) => {
    console.log(postId)
    setSelectedPost(postId);
    try {

      const response = await fetch('/api/showComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postid: postId }),
      });

      if (response.ok) {
        const comments = await response.json();
        setPostComments(comments);
        if (comments.length > 0) {
          setShowCommentDialog(true);
        } else {
          // If there are no comments, show the add comment form directly
          setComment("");
          setShowCommentDialog(true);
        }
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !comment.trim()) return;

    try {
      const primaryEmail = currentUser?.email;
      if (!primaryEmail) return;

      const userResponse = await fetch(
        `/api/auth/${encodeURIComponent(primaryEmail)}`
      );
      if (!userResponse.ok) throw new Error("Failed to get user data");
      const userData = await userResponse.json();

      const response = await fetch("/api/postComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postid: selectedPost,
          user_id: id,
        comment_content: comment.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setPostComments([...postComments, newComment]);
        setUserPosts((posts) =>
          posts.map((post) =>
            post.id === selectedPost
              ? { ...post, comment_count: (post.comment_count || 0) + 1 }
              : post
          )
        );
        setComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user || !newPost.content.trim()) return;

    try {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      if (!primaryEmail) return;

      const userResponse = await fetch(
        `/api/auth/${encodeURIComponent(primaryEmail)}`
      );
      if (!userResponse.ok) throw new Error("Failed to get user data");
      const userData = await userResponse.json();

      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userData.userid,
          content: newPost.content.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const createdPost = await response.json();
      setUserPosts([createdPost, ...userPosts]);
      setShowPostDialog(false);
      setNewPost({ content: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-center">
            <Image
              src={user?.imageUrl || "/default-avatar.png"}
              alt={currentUser?.name || "User"}
              width={128}
              height={128}
              className="rounded-full"
            />
            <div className="ml-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {currentUser?.name || "Loading..."}
              </h1>
              <p className="text-gray-600 mt-2">
                {currentUser?.email || "Loading..."}
              </p>
              <div className="mt-4 flex space-x-4">
                <div className="text-center">
                  <span className="block font-bold text-gray-800">
                    {userPosts.length}
                  </span>
                  <span className="text-gray-600">Posts</span>
                </div>
                <div className="text-center">
                <Button onClick={() => setShowFollowingNames(true)} className="bg-blue-600 text-white hover:bg-blue-700">
  Following: {followingCount}
</Button>

<Dialog open={showFollowerNames} onOpenChange={setShowFollowerNames}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Followers</DialogTitle>
    </DialogHeader>
    <ul>
      {followerNames.map((name, index) => (
        <li key={index} className="text-gray-800">{name}</li>
      ))}
    </ul>
  </DialogContent>
</Dialog>

                </div>
                <div className="text-center">
                <Button onClick={() => setShowFollowerNames(true)} className="bg-blue-600 text-white hover:bg-blue-700">
          Followers: {followerCount}
</Button>

<Dialog open={showFollowingNames} onOpenChange={setShowFollowingNames}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Following</DialogTitle>
    </DialogHeader>
    <ul>
  {followingNames && followingNames.length > 0 ? (
    followingNames.map((name, index) => (
      <li key={index} className="text-gray-800">{name}</li>
    ))
  ) : (
    <li>No following</li>
  )}
</ul>

  </DialogContent>
</Dialog>

                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => setShowHistory(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              View Reservation History
            </Button>
          </div>
        </Card>

        {/* User's Posts */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
          <Button
            onClick={() => setShowPostDialog(true)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Post
          </Button>
        </div>
        <div className="space-y-6">
          {userPosts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={user?.imageUrl || "/default-avatar.png"}
                  alt={user?.fullName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">
                    {user?.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-800 mb-4">{post.content}</p>

              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center space-x-1 ${
                    post.has_upvoted ? "text-blue-600" : "text-gray-500"
                  } hover:text-blue-600`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={post.has_upvoted ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>{post.upvotes || 0}</span>
                </button>

                <button
                  onClick={() => handleShowComments(post.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.comment_count || 0}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        reservations={reservationHistory}
      />
<Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
  <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg p-6">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-800">
        {postComments.length > 0 ? "Comments" : "Add Comment"}
      </DialogTitle>
    </DialogHeader>
    {postComments.length > 0 ? (
      <div className="max-h-[300px] overflow-y-auto space-y-4 mt-4">
        {postComments.map((comment: any) => (
          <div key={comment.comment_id} className="border-b pb-2">
            <p className="font-semibold text-gray-700">{comment.user_name}</p>
            <p className="text-gray-600">{comment.comment_content}</p> {/* Ensure this line is present */}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 mt-4">No comments yet.</p> // Optional message when there are no comments
    )}
    <form onSubmit={handleAddComment} className="space-y-4 mt-4">
      <div className="space-y-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Write your comment..."
        />
      </div>
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={() => setShowCommentDialog(false)}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 transition duration-200"
        >
          Close
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 transition duration-200"
        >
          {postComments.length > 0 ? "Add Comment" : "Post Comment"}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>



      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
                rows={4}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={() => setShowPostDialog(false)}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

