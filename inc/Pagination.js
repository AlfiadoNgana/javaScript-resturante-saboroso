let conn = require("./db");

class Pagination{

    constructor(query, params=[], itensPerPage = 10){

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentePage = 1;

    }

    getPage(page){
        this.currentePage = page-1;
        this.params.push(this.currentePage * this.itensPerPage ,this.itensPerPage);

        return new Promise((resolve, reject)=>{
            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(';'), this.params, (err, results)=>{
                if(err) reject(err);
                else{
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(results[1][0].FOUND_ROWS / this.itensPerPage);
                    this.currentePage++;

                    resolve(this.data);
                }
            });
        });
    }

    getTotal(){
        return this.total;
    }

    getCurrentePage(){
        return this.currentePage;
    }

    getTotalPages(){
        return this.totalPages;
    }

}

module.exports = Pagination;