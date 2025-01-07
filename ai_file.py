from fastapi import FastAPI, HTTPException
import pandas as pd
import asyncpg
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import euclidean_distances
import numpy as np
from datetime import datetime

app = FastAPI()

async def get_flight_recommendations(user_id: int):
    conn = await asyncpg.connect("postgres://postgres:1234@localhost:5432/Altera")
    
    # Get all flights with required fields
    flights = await conn.fetch("""
        SELECT 
            id,
            destination,
            depart,
            airline,
            date
        FROM flight
    """)
    
    # Get user's previous bookings
    user_bookings = await conn.fetch("""
        SELECT 
            f.id,
            f.destination,
            f.depart,
            f.airline,
            f.date
        FROM flight f
        JOIN reservation r ON f.id = r.id
        WHERE r.userid = $1
    """, user_id)
    
    # If user has no bookings, return popular flights
    if not user_bookings:
        popular_flights = await conn.fetch("""
            SELECT DISTINCT
                f.id,
                f.destination,
                f.depart,
                f.airline,
                f.date
            FROM flight f
            JOIN reservation r ON f.id = r.id
            GROUP BY f.id, f.destination, f.depart, f.airline, f.date
            ORDER BY COUNT(*) DESC
            LIMIT 5
        """)
        await conn.close()
        return [dict(flight) for flight in popular_flights]
    
    # Convert to DataFrame
    df = pd.DataFrame(flights)
    
    # Create features for similarity
    destinations = pd.get_dummies(df['destination'])
    airlines = pd.get_dummies(df['airline'])
    features = np.hstack([destinations, airlines])
    
    # Calculate similarity
    user_flight_ids = [booking['id'] for booking in user_bookings]
    user_flight_indices = df[df['id'].isin(user_flight_ids)].index
    
    similarities = []
    for idx in range(len(df)):
        if idx not in user_flight_indices:
            min_distance = float('inf')
            for user_idx in user_flight_indices:
                distance = euclidean_distances([features[idx]], [features[user_idx]])[0][0]
                min_distance = min(min_distance, distance)
            similarities.append((idx, min_distance))
    
    # Get top 5 most similar flights
    similar_indices = [idx for idx, _ in sorted(similarities, key=lambda x: x[1])[:5]]
    recommendations = df.iloc[similar_indices].to_dict('records')
    
    await conn.close()
    return recommendations

@app.get("/recommendations/{user_id}")
async def get_recommendations(user_id: int):
    return await get_flight_recommendations(user_id)