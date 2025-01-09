from fastapi import FastAPI, HTTPException
import pandas as pd
import asyncpg
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import euclidean_distances, cosine_similarity
import numpy as np
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_popular_flights(conn):
    popular = await conn.fetch("""
        SELECT f.* 
        FROM flight f
        JOIN reservation r ON f.id = r.id
        GROUP BY f.id
        ORDER BY COUNT(*) DESC
        LIMIT 5
    """)
    return popular

async def get_flight_recommendations(user_id: int) -> List[Dict]:
    try:
        conn = await asyncpg.connect("postgres://postgres:1234@localhost:5432/Altera")
        
        # Get user history with correct prices
        user_history = await conn.fetch("""
            SELECT 
                f.destination,
                f.airline,
                COALESCE(ef.flight_price, bf.flight_price) as price
            FROM reservation r
            JOIN flight f ON r.id = f.id
            LEFT JOIN economyflight ef ON f.id = ef.flight_id
            LEFT JOIN businessflight bf ON f.id = bf.flight_id
            WHERE r.userid = $1
        """, user_id)
        
        if not user_history:
            return await get_popular_flights(conn)
            
        # Get available flights with prices
        all_flights = await conn.fetch("""
            SELECT DISTINCT
                f.id,
                f.destination,
                f.airline,
                f.date,
                f.depart,
                COALESCE(ef.flight_price, bf.flight_price) as price
            FROM flight f
            LEFT JOIN economyflight ef ON f.id = ef.flight_id
            LEFT JOIN businessflight bf ON f.id = bf.flight_id
            WHERE f.date > CURRENT_DATE
            AND COALESCE(ef.flight_price, bf.flight_price) IS NOT NULL;
        """)

        print(all_flights)
        
        for f in all_flights:
            print(f"{f['id']} - {f['price']} - {type(f['price'])}")
  # Confirm it shows <class 'decimal.Decimal'>

        # Create feature matrices
        user_features = np.array([
            [hash(r['destination']), hash(r['airline']), float(r['price'])]
            for r in user_history
        ])
        print(f"User features shape: {user_features.shape}")
        print(f"User features dtype: {user_features.dtype}")
        print(f"User features:\n{np.array2string(user_features)}")
        
        flight_features = np.array([
            [hash(f['destination']), hash(f['airline']), float(f['price'])]
            for f in all_flights
        ])
        print(f"Flight features shape: {flight_features.shape}")
        print(f"Flight features dtype: {flight_features.dtype}")
        print(f"Flight features:\n{np.array2string(flight_features)}")
        
        # Scale and calculate similarities
        scaler = StandardScaler()
        user_profile = np.mean(scaler.fit_transform(user_features), axis=0).reshape(1, -1)
        flight_features_scaled = scaler.transform(flight_features)
        
        similarities = cosine_similarity(user_profile, flight_features_scaled)
        top_indices = np.argsort(similarities[0])[-5:][::-1]
        
        recommendations = [all_flights[i] for i in top_indices]
        await conn.close()
        return recommendations

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail={"message": "Internal server error", "error": str(e)}
        )

@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: int):
    try:
        recommendations = await get_flight_recommendations(user_id)
        
        # Convert datetime objects to strings
        formatted_recommendations = []
        for rec in recommendations:
            formatted_recommendations.append({
                "flight_id": rec['id'],
                "destination": rec['destination'],
                "airline": rec['airline'],
                "date": rec['date'].isoformat(),
                "depart": rec['depart'].isoformat()
            })
            
        return formatted_recommendations
        
    except Exception as e:
        print(f"Error in recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: int):
    try:
        recommendations = await get_flight_recommendations(user_id)
        return [
            {
                "flight_id": rec["id"],
                "destination": rec["destination"],
                "airline": rec["airline"],
                "date": rec["date"],
                "flight_price": rec["id"]
            }
            for rec in recommendations
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))