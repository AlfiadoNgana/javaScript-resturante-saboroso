var conn = require('./../inc/db');
var menus = require('./../inc/menus');
var express = require('express');
var router = express.Router();
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
const title = 'Restaurante Saboroso!';

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{
    res.render('index', { title, menus: results });
  });

});

router.get('/contacts', function(req, res, next){
  contacts.render(req, res);
});

router.post('/contacts', function(req, res, next){

  let error = [];
  if(!req.body.name){
    error.push("O nome e obrigatorio");
  }
  if(!req.body.email){
    error.push("O email e obrigatorio");
  }
  if(!req.body.message){
    error.push("A messagem e obrigatorio");
  }

  if(error.length<=0){
    contacts.save(req.body).then(results=>{
      req.body = {};
      contacts.render(req, res, [], 'Contacto Registado com sucesso');
    }).catch(err=>{
      contacts.render(req, res, err);
    });
  }else{
    contacts.render(req, res, error);
  }
  
});

router.get('/menus', function(req, res, next){
  menus.getMenus().then(results =>{
    res.render('menu', {
      title,
      background: 'images/img_bg_1.jpg',
      h1: 'Saboreie nosso menu!',
      menus: results
    });
  });
});

router.get('/reservations', function(req, res, next){
  reservations.render(req, res);
});

router.post('/reservations', function(req, res, next){
  let error = [];
  if(!req.body.name){
    error.push("O nome e obrigatorio");
  } 
  if(!req.body.email){
    error.push("O email e obrigatorio");
  } 
  if(!req.body.people){
    error.push("O numero de pessoas e obrigatorio");
  } 
  if(!req.body.date){
    error.push("A data e obrigatorio");
  } 
  if(!req.body.time){
    error.push("A hora e obrigatorio");
  } 
  
  if(error.length>0){
    reservations.render(req, res, error);
  }else{
    reservations.save(req.body).then(results=>{
      req.body = {};
      reservations.render(req, res, [], "Reserva feita com sucesso");
    }).catch(err=>{
      reservations.render(req, res, err);
    });
  }

});

router.get('/services', function(req, res, next){
  res.render('services', {
    title,
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});

module.exports = router;
