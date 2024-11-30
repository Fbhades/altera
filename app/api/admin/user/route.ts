import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
    try {
        // Fetch users from your database here
        // For this example, we'll fetch from Clerk
        const users = await clerkClient.users.getUserList();
        const formattedUsers = users.data.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            role: user.publicMetadata.role === 'admin',
        }));
        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }
}
export async function POST(request: Request) {
    
        const { name, email, role } = await request.json();
        try {
            const client = await clerkClient()
        
            const user = await client.users.createUser({
              emailAddress:[email],
              password: 'password1234',
            })
            return NextResponse.json({ message: 'User created', user })
          } catch (error) {
            console.log(error)
            return NextResponse.json({ error: 'Error creating user' })
          }
}