import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest) => {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM flight;';
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
      const body = await req.json();
      const { destination, depart, airline, date } = body;
  
      if (!destination || !depart || !airline || !date) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const query = `
        INSERT INTO flight (destination, depart, airline, date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [destination, depart, airline, date];
      const result = await client.query(query, values);
      await client.release();
  
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error('Error creating flight:', error);
      return NextResponse.json({ message: 'Error creating flight' }, { status: 500 });
    }
  };
  

  
  