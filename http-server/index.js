const http = require("http");
const fs = require("fs");
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));

let regscont = "";
let projectcontent = "";
let homecont = "";

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

fs.readFile("home.html" , (err ,home) => {
  if (err) {
    throw err;
  }
  homecont = home ;
})

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
      case"/project":
        response.write(projectcontent);
        response.end;
        break;
      default:
        response.write(homecont);
        response.end;
        break;
        }
    })
    .listen(port);
