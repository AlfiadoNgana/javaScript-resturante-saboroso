var express = require("express");
var users = require("./../inc/users");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.render("admin/index", {});
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

router.get("/menus", (req, res, next) => {
  res.render("admin/menus", {});
});

router.get("/reservations", (req, res, next) => {
  res.render("admin/reservations", {
    date: {}
  });
});

router.get("/users", (req, res, next) => {
  res.render("admin/users", {});
});

router.get("/contacts", (req, res, next) => {
  res.render("admin/contacts", {});
});

router.get("/emails", (req, res, next) => {
  res.render("admin/emails", {});
});

module.exports = router;
