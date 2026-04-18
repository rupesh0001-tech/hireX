import app from "./app.js";
import { connectDB } from "./db/connect.js";
import { config } from "./config/env.js";

const PORT = config.port;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});