"use client"; 
import React, { useState, useEffect } from "react"; 
import Image from "next/image"; 
import { useUser } from "@clerk/nextjs"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card"; 
import { SearchIcon } from "lucide-react"; 
import { user as UserInterface } from "../Interface/interface"; 
import { useRouter } from "next/navigation";

export default function SocialPage() { 
    const { user } = useUser(); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [searchResults, setSearchResults] = useState<UserInterface[]>([]); 
    const [following, setFollowing] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false); 
    const [dbUserId, setDbUserId] = useState<number | null>(null); 
    const [userPosts, setUserPosts] = useState<any[]>([]); 
    const router = useRouter(); // Initialize router

    // Fetch the database user ID based on the logged-in user's email
    const fetchDbUserId = async () => { 
        if (user?.primaryEmailAddress?.emailAddress) { 
            try { 
                const response = await fetch(`/api/auth/${user.primaryEmailAddress.emailAddress}`); 
                const data = await response.json(); 
                setDbUserId(data.userid); 
                return data.userid; 
            } catch (error) { 
                console.error("Error fetching user ID:", error); 
                return null; 
            } 
        } 
    };

    // Fetch posts from followed users
    const fetchFollowedUsersPosts = async (userId: number) => { 
        try { 
            const response = await fetch(`/api/getfollowing/${userId}`); 
            if (!response.ok) { throw new Error('Failed to fetch following list'); } 

            const data = await response.json(); 
            const followedUserIds = data.followers.map(String); 

            const postsPromises = followedUserIds.map(async (followedUserId: string) => { 
                const response = await fetch(`/api/post?userid=${followedUserId}`); 
                if (!response.ok) throw new Error(`Failed to fetch posts for user ${followedUserId}`); 
                return response.json(); 
            }); 

            const postsData = await Promise.all(postsPromises); 
            const allPosts = postsData.flatMap(posts => posts); 
            setUserPosts(allPosts); 

        } catch (error) { console.error("Error fetching followed users' posts:", error); } 
    };

    // Fetch user's following list
    const fetchUserFollowing = async (userId: number) => { 
        try { 
            const response = await fetch(`/api/getfollowing/${userId}`); 
            if (!response.ok) { throw new Error('Failed to fetch following list'); }
            
            const data = await response.json();  
            setFollowing(data.followers.map((follower: { id: number }) => follower.id.toString())); 

        } catch (error) { console.error("Error fetching user following:", error); } 
    };

    // Initialize user data and fetch posts when component mounts
    useEffect(() => {
        const initializeUserData = async () => {
            const userId = await fetchDbUserId();
            if (userId) {
                await fetchUserFollowing(userId);
                await fetchFollowedUsersPosts(userId);
            }
        };
        initializeUserData();
    }, [user]);

    // Update following status in search results
    useEffect(() => {
        if (searchResults.length > 0 && following.length > 0) {
            const updatedResults = searchResults.map(result => ({
                ...result,
                isFollowing: following.includes(result.id.toString())
            }));
            setSearchResults(updatedResults);
        }
    }, [following]);

    // Search users
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (searchTerm.trim()) {
                const response = await fetch("/api/admin/user");
                const users = await response.json();

                // Get IDs for filtered users
                const usersWithIds = await Promise.all(
                    users.filter((user: UserInterface) =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(async (user: UserInterface) => {
                        try {
                            const emailResponse = await fetch(`/api/auth/${user.email}`);
                            const emailData = await emailResponse.json();
                            return {
                                ...user,
                                id: emailData.userid,
                                isFollowing: following.includes(emailData.userid.toString())
                            };
                        } catch (error) {
                            console.error(`Error fetching ID for ${user.email}:`, error);
                            return user;
                        }
                    })
                );

                // Filter out the current user
                const filteredUsers = usersWithIds.filter((user: UserInterface) => user.id !== dbUserId);
                setSearchResults(filteredUsers);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Follow user
    const handleFollow = async (userId: number) => {
        if (!dbUserId) return;
        try {
            const response = await fetch(`/api/followers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId, followerId: dbUserId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    console.log("Already following this user");
                    return;
                }
                throw new Error(errorData.message || "Failed to follow user");
            }
            setFollowing(prev => [...prev, userId.toString()]);
            await fetchFollowedUsersPosts(dbUserId);
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    // Unfollow user
    const handleUnfollow = async (userId: number) => {
        if (!dbUserId) return;
        try {
            const response = await fetch("/api/followers", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId, followerId: dbUserId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to unfollow user");
            }
            setFollowing(prev => prev.filter(id => id !== userId.toString()));
            await fetchFollowedUsersPosts(dbUserId);
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    // Navigate to user's profile page when name is clicked
    const handleNameClick = (userID: number) => {
        router.push(`/profile_page/${userID}`); // Navigate to the profile page with the user's ID
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Find People</h1>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
                    <Button type="submit" disabled={loading}>
                        <SearchIcon className="w-4 h-4 mr-2" /> Search
                    </Button>
                </form>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <div className="grid gap-4 mb-8">
                        {searchResults.map((result) => (
                            <Card key={result.id} className="p-4">
                                <div className="flex justify-between items-center">
                                    <div onClick={() => handleNameClick(result.id)} style={{ cursor: 'pointer' }}> {/* Clickable name */}
                                        <h3 className="font-semibold">{result.name}</h3>
                                        <p className="text-sm text-gray-500">{result.email}</p>
                                    </div>
                                    <Button onClick={() => following.includes(result.id.toString()) ? handleUnfollow(result.id) : handleFollow(result.id)}
                                        variant={following.includes(result.id.toString()) ? "secondary" : "default"}>
                                        {following.includes(result.id.toString()) ? "Unfollow" : "Follow"}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        {searchTerm && searchResults.length === 0 && (
                            <div className="text-center text-gray-500">No users found. Try a different search term.</div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold mb-4">Posts from People You Follow</h2>
                    <div className="grid gap-4">
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <Card key={post.id} className="p-6">
                                    <div className="flex items-center mb-4">
                                        <Image src={post.user_image || "/default-avatar.png"} alt={post.user_name || "User"} width={40} height={40} className="rounded-full" />
                                        <div className="ml-3">
                                            <h3 className="font-semibold text-gray-800">{post.user_name}</h3>
                                            <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800 mb-4">{post.content}</p>
                                    <div className="flex items-center space-x-6">
                                        {/* Add upvote and comment buttons here */}
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">Follow some users to see their posts here!</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
