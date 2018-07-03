const http = require("http");
const fs = require("fs");

http
  .createServer((request, response) => {
    request.on('end', () => {
      console.log("request end");

      fs.readFile("test.txt", "utf-8", function(error, v) {
        response.writeHead(200, {
          "Content-Type": "text/plain"
        });
        console.log(v);
        v = parseInt(v) + 1;
  
        fs.writeFile("test.txt", v);
        response.end("test: " + v);

        
      });
    });

    

    //response.end("test");
  })
  .listen(8080);