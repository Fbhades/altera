from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# User flight data
data = {
    'user_id': [1, 1, 2, 2, 3, 3],
    'flight_id': [101, 102, 101, 103, 102, 104],
    'rating': [5, 3, 4, 5, 2, 4]  # Example ratings/preferences
}
df = pd.DataFrame(data)

# Create a user-flight matrix
user_flight_matrix = df.pivot(index='user_id', columns='flight_id', values='rating').fillna(0)

# Calculate similarity
similarity = cosine_similarity(user_flight_matrix)
print("User similarity matrix:")
print(similarity)

# Recommend flights based on similar users
# Example: For user 1, suggest flights from similar users (e.g., user 2).
