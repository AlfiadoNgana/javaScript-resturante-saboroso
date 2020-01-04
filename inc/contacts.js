var conn = require('./db');

module.exports = {

    render(req, res, error, success){
        res.render('contact', {
            title:'Restaurante Saboroso!-contacts',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga oi!',
            body: req.body,
            error,
            success
        });
    },

    save(fields){

        return new Promise((resolve, reject)=>{
            conn.query(`
                INSERT INTO tb_contacts(name, email, message)
                VALUES(?,?,?)
            `,[
                fields.name,
                fields.email,
                fields.message
            ], (error, results)=>{
               if(error) reject(error);
               else resolve(results); 
            });
        })

    },

    delete(id){

        return new Promise((resolve, reject)=>{
            conn.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `, [
                id
            ], (error, results)=>{
                if(error) reject(err);
                else resolve(results);
            });
        });

    },

    getContacts(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_contacts ORDER BY id DESC
            `, (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });

        });

    }

}