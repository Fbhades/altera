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
    try {
        const { name, email, role } = await request.json();
        // Create user in your database here

        // Create user in Clerk
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');
        const clerkUser = await clerkClient.users.createUser({
            firstName,
            lastName,
            emailAddress: [email],
            password: Math.random().toString(36).slice(-8), // Generate a random password
            publicMetadata: { role: role ? 'admin' : 'user' },
        });

        return NextResponse.json({
            id: clerkUser.id,
            name,
            email,
            role,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}

