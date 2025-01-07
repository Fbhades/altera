"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import { user as UserInterface } from "../Interface/interface";

export default function SocialPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserInterface[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbUserId, setDbUserId] = useState<number | null>(null);

  // Fetch the database user ID based on the logged-in user's email
  const fetchDbUserId = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const response = await fetch(`/api/auth/${user.primaryEmailAddress.emailAddress}`);
        const data = await response.json();
        setDbUserId(data.userid);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }
  };

  // Fetch users and their IDs
  const fetchUsersWithIds = async () => {
    try {
      // Fetch all users from admin endpoint
      const response = await fetch('/api/admin/user');
      const users = await response.json();

      // Fetch IDs for each user based on their email
      const usersWithIds = await Promise.all(users.map(async (user: UserInterface) => {
        try {
          const emailResponse = await fetch(`/api/auth/${user.email}`);
          const emailData = await emailResponse.json();
          return { ...user, id: emailData.userid }; // Assuming userid is returned
        } catch (error) {
          console.error(`Error fetching ID for ${user.email}:`, error);
          return user; // Fallback to original user if error occurs
        }
      }));

      setSearchResults(usersWithIds); // Store combined data in state
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch user ID when the component mounts or when the user changes
  useEffect(() => {
    fetchDbUserId();
    fetchUsersWithIds(); // Fetch users when component mounts
  }, [user]);

  // Search users
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Filter users based on search term and exclude the signed-in user
    const filtered = searchResults.filter((user: UserInterface) => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      user.id !== dbUserId // Exclude the logged-in user
    );

    setSearchResults(filtered);
  };
// Follow user
const handleFollow = async (userId: number) => {
  if (dbUserId === null || userId === null) {
    console.error('User ID or follower ID is null');
    return; // Prevent proceeding if IDs are not set
  }

  try {
    const response = await fetch(`/api/followers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: dbUserId, // The ID of the user to follow
        followerId: userId, // The ID of the logged-in user
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to follow user');
    }

    setFollowing([...following, userId.toString()]);
  } catch (error) {
    console.error('Error following user:', error);
  }
};

  // Unfollow user
  const handleUnfollow = async (userId: string) => {
    try {
      const response = await fetch('/api/followers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          follower_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }

      setFollowing(following.filter(id => id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Find People</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <Card key={result.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{result.name}</h3>
                    <p className="text-sm text-gray-500">{result.email}</p>
                  </div>
                  <Button
                    onClick={() => handleFollow(result.id)}
                    variant={following.includes(result.id.toString()) ? "secondary" : "default"}
                  >
                    {following.includes(result.id.toString()) ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            searchTerm && (
              <div className="text-center text-gray-500">
                No users found. Try a different search term.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
