const http = require("http");
const app = require("./app");

const port = process.env.PORT || '80';    // default port of the hosting provider
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on localhost:${port}`));
