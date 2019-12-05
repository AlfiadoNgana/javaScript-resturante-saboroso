class HcodeGrid{

    constructor(configs){
        configs.listeners = Object.assign({
            afterUpdateClick: (e)=>{
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e)=>{
                window.location.reload();
            },
            afterFormCreate: (e)=>{
                window.location.reload();
            },
            afterFormUpdate: (e)=>{
                window.location.reload();
            },
            afterFormCreateError: (e)=>{
                alert('nao foi possivel enviar o formulario');
            },
            afterFormUpdateError: (e)=>{
                alert('nao foi possivel enviar o formulario');
            }
        }, configs.listeners);

        this.options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
        }, configs);
        this.initForms();
        this.initButtons();
    }

    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);
        this.formCreate.save().then(json=>{
            this.fireEvents('afterFormCreate');
        }).catch(err=>{
            this.fireEvents('afterFormCreateError');
        });
        this.formUpdate = document.querySelector(this.options.formUpdate);
        this.formUpdate.save().then(json=>{
            this.fireEvents('afterFormUpdate');
        }).catch(err=>{
            this.fireEvents('afterFormUpdateError');
        });

    }

    fireEvents(name, args){

        if(typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);

    }

    getTrData(btn){
        let tr = btn.closest('tr');
        return JSON.parse(tr.dataset.row);
    }

    initButtons(){

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn=>{
            btn.addEventListener('click', e=>{
              let data = this.getTrData(btn);
        
              if(confirm(eval('`'+ this.options.deleteMsg + '`'))){
                fetch(eval('`'+this.options.deleteUrl+'`'), {
                  method: 'DELETE'
                })
                  .then(response=>response.json())
                  .then(json=>{
                    this.fireEvents('afterDeleteClick');
                  });
              }
        
            });
          });
        
          
        
          [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn=>{
             btn.addEventListener('click', e=>{
                this.fireEvents('beforeUpdateClick', [e]);
                let data = this.getTrData(btn);
              for(let name in data){
                this.options.onUpdateLoad(this.formUpdate, name, data);
              }
              this.fireEvents('afterUpdateClick', [e]);
             });
          });
        

    }

}