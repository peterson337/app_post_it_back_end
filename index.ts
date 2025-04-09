import express from "express";

const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});
