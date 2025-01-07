'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchIcon } from "lucide-react"
import { user as UserInterface } from "../Interface/interface";

export default function SocialPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserInterface[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbUserId, setDbUserId] = useState<number | null>(null);

  useEffect(() => {
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
    console.log(user);
    fetchDbUserId();
  }, [user]);

  // Search users
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/user');
      const users = await response.json();
      // Filter users based on search term and exclude the signed-in user
      const filtered = users.filter((user: UserInterface) => 
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        user.id !== dbUserId
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Follow user
  const handleFollow = async (userId: number) => {
    try {
      console.log(userId);
      console.log(user?.id);
      const response = await fetch('/api/following/${user?.id}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          follower_id: user?.id,
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
      const response = await fetch('/api/follwers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          follower_id: user?.id,
        }),
      });
      console.log(userId);
      console.log(user?.id);

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