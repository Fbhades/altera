import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest) => {
    try {
      const client = await pool.connect();
      const query = 'SELECT id, name, email, role FROM users;';
      const result = await client.query(query);
      const users = result.rows;
      await client.release();
      
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
  };

  export const POST = async (req: NextRequest) => {
    try {
      const client = await pool.connect();
      const { name, email, role } = await req.json(); // role should be a boolean (true/false)
  
      const query = `
        INSERT INTO users (name, email, role)
        VALUES ($1, $2, $3);
      `;
      
      const result = await client.query(query, [name, email, role]);
      const newUser = result.rows[0];
      await client.release();
      
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.error('Error inserting user:', error);
      return NextResponse.json({ message: 'Error inserting user' }, { status: 500 });
    }
  };

  export const PUT = async (req: NextRequest) => {
    try {
      const client = await pool.connect();
      const { id, name, email, role } = await req.json(); // role is a boolean
  
      const query = `
        UPDATE users
        SET name = $1, email = $2, role = $3
        WHERE id = $4
        RETURNING *;
      `;
      
      const result = await client.query(query, [name, email, role, id]);
  
      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      const updatedUser = result.rows[0];
      await client.release();
      
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
  };