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

    getNavegation(params){

        let limitPagesNav = 5;
        let links = [];
        let nrStart = 0;
        let nrEnd = 0;
        //se os registos forem poucos nao precisamos mostrar 5 paginas, apenas mostar 3 ou 4 ou 1 mesmo
        if(this.getTotalPages() < limitPagesNav) limitPagesNav = this.getTotalPages();

        //se estamos nas primeiras paginas
        if((this.getCurrentePage() - parseInt(limitPagesNav/2)) < 1){
            nrStart = 1;
            nrEnd = limitPagesNav;
        }
        //estamos chegando nas ultimas paginas
        else if((this.getCurrentePage() + parseInt(limitPagesNav/2)) > this.getTotalPages){
            nrStart = this.getTotalPages() - limitPagesNav;
            nrEnd = this.getTotalPages;
        }else{
            nrStart = (this.getCurrentePage() - parseInt(limitPagesNav/2));
            nrEnd = (this.getCurrentePage() + parseInt(limitPagesNav/2));
        }

        //pagina anterior
        if(this.getCurrentePage() > 1){
            links.push({
                text: '<',
                href: `?${this.getQueryString(Object.assign({}, params, {page: this.getCurrentePage()-1}))}`
            })
        }

        for(let x=nrStart; x<=nrEnd; x++){
            links.push({
                text: x,
                href: `?${this.getQueryString(Object.assign({}, params, {page: x}))}`,
                active: (x === this.getCurrentePage())
            });
        }
        //proxima pagina
        if(this.getCurrentePage() < this.getTotalPages()){
            links.push({
                text: '>',
                href: `?${this.getQueryString(Object.assign({}, params, {page: this.getCurrentePage()+1}))}`
            })
        }

        return links;

    }

    getQueryString(params){

        let queryString = [];
        for(let name in params){
            queryString.push(`${name}=${params[name]}`);
        }

        return queryString.join('&');

    }

}

module.exports = Pagination;