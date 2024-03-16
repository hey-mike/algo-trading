# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install any needed packages specified in requirements.txt
# This assumes you have a requirements.txt file in your trading-strategy-service directory.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Make port available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV NAME World

# Run the application when the container launches
# Replace `app.py` with the file that runs your application
CMD ["python", "app.py"]
