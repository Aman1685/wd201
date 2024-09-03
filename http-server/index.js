const http = require("http");
const fs = require("fs");
const minimist = require('minimist');

const args = minimist(process.argv.slice(2), {
  default: {
    port: 2000
  }
});

let regscont = "";
let projectcontent = "";


fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectcontent = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) {
    throw err;
  }
  regscont = registration;
});


const port = parseInt(args.port);

console.log(`Parsed port: ${port}`);

http
  .createServer((request,response) => {
    let url = request.url;
    response.writeHeader(200, {"Content-Type": "text/html"});
    switch (url) {
      case "/registration":
        response.write(regscont);
        response.end;
        break;
      default:
        response.write(projectcontent);
        response.end;
        break;
        }
    })
    .listen(port);
