var conn = require('./../inc/db');
var menus = require('./../inc/menus');
var express = require('express');
var router = express.Router();
const title = 'Restaurante Saboroso!';

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{
    res.render('index', { title, menus: results });
  });

});

router.get('/contacts', function(req, res, next){
  res.render('contact', {
    title,
    background: 'images/img_bg_3.jpg',
    h1: 'Diga oi!'
  });
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
  res.render('reservation', {
    title,
    background: 'images/img_bg_2.jpg',
    h1: 'Reserve uma Mesa!'
  });
});

router.get('/services', function(req, res, next){
  res.render('services', {
    title,
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});

module.exports = router;
