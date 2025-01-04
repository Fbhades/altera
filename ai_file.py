import pandas as pd
from sklearn.cluster import KMeans
import psycopg2

# Connect to your SQL database
conn = psycopg2.connect("dbname=your_db user=your_user password=your_password")

# Fetch user travel history
user_id = 1  # Example user ID
travel_history_query = f"""
SELECT d.name, d.region, d.activities 
FROM travel_history th 
JOIN destinations d ON th.destination_id = d.id
WHERE th.user_id = {user_id};
"""
travel_data = pd.read_sql(travel_history_query, conn)

# Feature Engineering: Create a DataFrame for clustering
# Example: Count of visits per region
region_counts = travel_data['region'].value_counts().reset_index()
region_counts.columns = ['region', 'visit_count']

# Clustering similar regions (K-Means)
kmeans = KMeans(n_clusters=3)
region_counts['cluster'] = kmeans.fit_predict(region_counts[['visit_count']])

# Now you can query your SQL database for recommendations based on clusters
