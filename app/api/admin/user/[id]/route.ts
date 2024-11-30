import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { name, email, role } = await request.json();
        // Update user in your database here

        // Update user in Clerk
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');
        const updatedUser = await clerkClient.users.updateUser(params.id, {
            firstName,
            lastName,
            emailAddress: [email],
            publicMetadata: { role: role ? 'admin' : 'user' },
        });

        return NextResponse.json({
            id: updatedUser.id,
            name,
            email,
            role,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Delete user from your database here

        // Delete user from Clerk
        await clerkClient.users.deleteUser(params.id);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}

