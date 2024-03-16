// client-api/src/index.ts
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../client/build")));

// API endpoint
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

// Handle React routing, return all requests to React app
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
