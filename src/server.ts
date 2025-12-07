import app from "./app";
import config from "./config";

const port = config.port;

app.listen(5000, () => {
  console.log(`Server on running on port: ${port}`);
});
