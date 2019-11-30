const conn = require('./db');

module.exports = {

    render(req, res, error, success){

        res.render('reservation', {
            title: "Restaurante Saboroso!-reservation",
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body,
            error,
            success
        });

    },
    save(fields){

        return new Promise((resolve, reject)=>{

            if(fields.date.indexOf('/') > -1){
                let date = fields.date.split('/');
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
            }

            let query; let params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ];

            if(parseInt(fields.id) > 0){
                query = `
                    UPDATE tb_reservations
                    SET 
                        name=?,
                        email=?,
                        people=?,
                        date=?,
                        time=?
                    WHRE id=?
                `;
                params.push(fields.id);
            }else{
                query = `
                    INSERT INTO tb_reservations(name, email, people, date, time)
                    VALUES(?,?,?,?,?)
                `;
            }

            conn.query(query, params, (error, results)=>{
                if(error) reject(error);
                else resolve(results);
            });
        });

    },
    getReservations(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_reservations ORDER BY date DESC
            `, (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });

        });

    }

}