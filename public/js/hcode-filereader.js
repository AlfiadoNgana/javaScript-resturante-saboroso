
class HcodeFileReader{

    constructor(inputEl, imgEl){

        this.inputEl = document.querySelector(inputEl);
        this.imgEl = document.querySelector(imgEl);

        this.initInputEvents();

    }

    initInputEvents(){

        this.inputEl.addEventListener("change", e=>{

            this.reader(e.target.files[0]).then(result=>{
                this.imgEl.src = result;
            });

        });

    }

    reader(file){

        return new Promise((resolve, reject)=>{

            let reader = new FileReader();

            reader.onload = ()=>{
                resolve(reader.result);
            }

            reader.onerror = ()=>{
                reject("nao foi possivel ler a imagem.");
            }

            reader.readAsDataURL(file);

        });

    }

}