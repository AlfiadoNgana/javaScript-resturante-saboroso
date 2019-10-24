var express = require("express");
var users = require("./../inc/users");
var admin = require('./../inc/admin');
var router = express.Router();

router.use((req, res, next) => {
  if (["/login"].indexOf(req.url) === -1 && !req.session.user) {
    res.redirect("/admin/login");
  } else {
    next();
  }
});

router.use(function(req, res, next){
  req.menus = admin.getMenus();
  for (let i = 0; i < req.menus.length; i++) {
    let href = req.menus[i].href.split('/')[2];
    if(req.url === '/'+href || req.url === '/'){
      req.menus[i].active = true;
      break;
    }
  }
  next();
});

router.get("/", (req, res, next) => {
  res.render("admin/index", {
    menus: req.menus
  });
});

router.get("/login", (req, res, next) => {
  users.render(req, res, []);
});

router.post("/login", (req, res, next) => {
  let errors = [];
  if (!req.body.email) {
    errors.push("O email e obrigatorio");
  }
  if (!req.body.password) {
    errors.push("A password e obrigatorio");
  }
  if (errors.length > 0) {
    users.render(req, res, errors);
  } else {
    users
      .login(req.body.email, req.body.password)
      .then(user => {
        req.body = {};
        req.session.user = user;
        res.redirect("/admin");
      })
      .catch(err => {
        users.render(req, res, err.message || err);
      });
  }
});

router.get("/logout", (req, res, next) => {
  delete req.session.user;
  res.redirect("/admin/login");
});

router.get("/menus", (req, res, next) => {
  res.render("admin/menus", {
    menus: req.menus
  });
});

router.get("/reservations", (req, res, next) => {
  res.render("admin/reservations", {
    date: {},
    menus: req.menus
  });
});

router.get("/users", (req, res, next) => {
  res.render("admin/users", {
    menus: req.menus
  });
});

router.get("/contacts", (req, res, next) => {
  res.render("admin/contacts", {
    menus: req.menus
  });
});

router.get("/emails", (req, res, next) => {
  res.render("admin/emails", {
    menus: req.menus
  });
});

module.exports = router;
