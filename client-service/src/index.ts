// src/index.ts
import app from "./app";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Client Service listening on port ${PORT}`);
});
