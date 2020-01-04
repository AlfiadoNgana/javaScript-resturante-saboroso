var express = require("express");
var users = require("./../inc/users");
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
var moment = require('moment');
var reservations = require('./../inc/reservations');
var router = express.Router();

moment.locale("pt-br");

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
  admin.dashboardCount().then(results=>{
    res.render("admin/index", {
      menus: req.menus,
      user: req.session.user,
      nrTotal: results
    });
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
 menus.getMenus().then(data=>{
  res.render("admin/menus", {
    menus: req.menus,
    user: req.session.user,
    data
  });
 });
});

router.post('/menus', (req, res, next)=>{
  menus.save(req.fields, req.files).then(results=>{
    res.send(results);
  }).catch(err=>{

    res.send(err)});
});

router.delete('/menus/:id', function(req, res, next){
  menus.delete(req.params.id).then(results=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });
});

router.get("/reservations", (req, res, next) => {
  reservations.getReservations().then(data=>{
    res.render("admin/reservations", {
      date:{},
      menus: req.menus,
      user: req.session.user,
      data,
      moment
    });
  });
  
});
router.post('/reservations', (req, res, next)=>{
  reservations.save(req.fields, req.files).then(results=>{
    res.send(results);
  }).catch(err=>{

    res.send(err)});
});

router.delete('/reservations/:id', function(req, res, next){
  reservations.delete(req.params.id).then(results=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });
});



router.get("/users", (req, res, next) => {
  users.getUsers().then(data=>{
    res.render("admin/users", {
      menus: req.menus,
      data,
      user: req.session.user
    });
  });
});
router.post("/users", (req, res, next) => {
  users.save(req.fields).then(result=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });

});
router.delete("/users/:id", (req, res, next) => {
  users.delete(req.params.id).then(result=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });
});

router.post("/users/password-change", (req, res, next)=>{
  users.changePassword(req).then(result=>{
    res.send(result);
  }).catch(err=>{
    res.send({error: err});
  });
});

router.get("/contacts", (req, res, next) => {
  contacts.getContacts().then(data=>{
    res.render("admin/contacts", {
      menus: req.menus,
      user: req.session.user,
      data
    });
  });
});

router.delete('/contacts/:id', (req, res, next)=>{
  contacts.delete(req.params.id).then(results=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });
});
router.get("/emails", (req, res, next) => {
  emails.getEmails().then(data=>{
    res.render("admin/emails", {
      menus: req.menus,
      user: req.session.user,
      data
    });
  });
});

router.delete('/emails/:id', (req, res, next)=>{
  emails.delete(req.params.id).then(results=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });
});

module.exports = router;
