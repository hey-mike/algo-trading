// src/index.ts

import app from './app'; // Import the Express app

// Start the server
const port = process.env.PORT || 3000; // Use environment variable or default

// Additional setup (optional)
// You can add pre-startup tasks here (e.g., database connection)

app.listen(port, () => {
  console.log(`Data Acquisition Service running on http://localhost:${port}`);
});
