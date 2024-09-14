const express = require("express");
var csrf = require("csurf");
const app = express();
const { Todo } = require("./models");
var cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");
const { title } = require("process");
const { User } = require("./models");
const { password } = require("pg/lib/defaults");
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { request } = require("http");

const saltRounds = 10;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(session({
  secret: "my-super-secret-key-10203040506070809",
  cookie:{
    maxAge: 24*60*60*100
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {
  User.findOne({where: {email: username }})
  .then(async (user) => {
    const result = await bcrypt.compare(password, user.password)
    if (result) {
      return done(null, user);
    } else {
      return done("Invalid password");
    }
  }).catch((error) => {
    return (error)
  })
}
));

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id)
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
  .then(user => {
    done(null, user)
  })
  .catch(error => {
    done(error, null)
  })
});


app.put("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const todoId = request.params.id;
  const { completed } = request.body;
  try {
    const todo = await Todo.reverse(todoId);
    await todo.save();
    return response.json(todo)
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const todoId = parseInt(request.params.id, 10);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true })
  } catch (error) {
    return response.status(422).json(error);
  }
});
app.post("/todos",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("test");
  try {
      const todo = await Todo.create({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: request.body.completed,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get('/', async (request, response) => {
    response.render("index", {
      title: "Todo application",
      csrfToken: request.csrfToken(),
    });
    });
  app.get("/signup", async (request, response) => {
    response.render("signup", {title :"Signup", csrfToken: request.csrfToken()})
  });

  app.post("/users",connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    
    const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
    console.log(hashedPwd);
    try {
      console.log("Firstname", request.body.firstName);
      const user = await User.create({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: hashedPwd 
    });
    request.login(user, (err) => {
      if(err) {
        console.log(err)
      }
      response.redirect("/todos");
    })
  } catch(error) {
    console.log(error);
  }
  })

  app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const allTodos = await Todo.getTodos();
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();
    if (request.accepts("html")) {
      response.render("todo", {
        title: "Todo application",
        overdue,
        dueToday,
        dueLater,
        allTodos,
        csrfToken: request.csrfToken(),
      })
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
      }) 
    } 
    });

  app.get("/login", (request, response) => {
    response.render("login", {title: "Login", csrfToken: request.csrfToken()});
  });

  app.post("/session", passport.authenticate('local', { failureRedirect: "/login"}), (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  })

  app.get("/signout", (request, response) => {
    // Sign out
    request.logout((err) => {
      if (err) { return next(err); }
      response.redirect("/")
    })
  })

module.exports = app;
