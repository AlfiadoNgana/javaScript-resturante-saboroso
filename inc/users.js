var conn = require("./db");

module.exports = {
  render(req, res, error) {
    res.render("admin/login", {
      body: req.body,
      error
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      conn.query(
        `
                SELECT * FROM tb_users WHERE email = ?
            `,
        [email],
        (err, results) => {
          if (err) reject(err);
          else {
            if (results.length > 0) {
              let row = results[0];
              if (row.password !== password)
                reject("O Email ou Password Incorectos");
              else resolve(row);
            } else {
              reject("O Email ou Password Incorectos");
            }
          }
        }
      );
    });
  },
  getUsers(){

    return new Promise((resolve, reject)=>{

        conn.query(`
            SELECT * FROM tb_users ORDER BY name
        `, (err, results)=>{
            if(err) reject(err);
            else resolve(results);
        });

    });

},

save(fields){

  return new Promise((resolve, reject)=>{

    let query; let params = [
        fields.name,
        fields.email
    ];

    if(parseInt(fields.id) > 0){
        query = `
            UPDATE tb_users
            SET 
                name=?,
                email=?
            WHERE id=?
        `;
        params.push(parseInt(fields.id));
    }else{
        query = `
            INSERT INTO tb_users(name, email, password)
            VALUES(?,?,?)
        `;
        params.push(fields.password);
    }

    conn.query(query, params, (error, results)=>{
        if(error) reject(error);
        else resolve(results);
    });
});


},

  delete(id){

      return new Promise((resolve, reject)=>{
          conn.query(`
              DELETE FROM tb_users WHERE id = ?
          `, [
              id
          ], (error, results)=>{
              if(error) reject(err);
              else resolve(results);
          });
      });

  }
};
