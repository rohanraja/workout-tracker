
const http = require("http");


const PORT = 5007;


const server = http.createServer(async (req, res) => {
    //set the request route
    if (req.url === "/api" && req.method === "GET") {
        //response headers

        console.log("Request recieved!");
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        res.write('["first", "second", "Barbell squats", "Lying dumbell"]');
        // res.write('{"list": ["first", "second", "Barbell squats", "Lying dumbell"] }');
        //end the response
        res.end();
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});