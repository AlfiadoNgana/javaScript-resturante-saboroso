var conn = require('./db');

module.exports = {

    save(fields){

        return new Promise((resolve, reject)=>{
            conn.query(`
                INSERT INTO tb_emails(email)
                VALUES(?)
            `,[
                fields.email
            ], (error, results)=>{
               if(error) reject(error.message);
               else resolve(results); 
            });
        })

    },

    delete(id){

        return new Promise((resolve, reject)=>{
            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
            `, [
                id
            ], (error, results)=>{
                if(error) reject(err);
                else resolve(results);
            });
        });

    },

    getEmails(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_emails ORDER BY register DESC
            `, (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });

        });

    }

}