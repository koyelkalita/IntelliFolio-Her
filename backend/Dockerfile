# Use a slim Python 3.9 image
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file first (caching layer)
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port (Render handles the actual port mapping)
EXPOSE 8000

# Start the application using Uvicorn
# Note: Since main.py is in 'app', we use app.main:app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]