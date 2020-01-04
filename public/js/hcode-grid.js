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
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data)=>{
                let input = form.querySelector('[name='+name+']');
                if(input) input.value = data[name];
            }
        }, configs);
        this.rows = [...document.querySelectorAll('table tbody tr')];
        this.initForms();
        this.initButtons();
    }

    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);
        if(this.formCreate){
            this.formCreate.save({
                success:()=>{
                    this.fireEvents('afterFormCreate');
                },
                failure:(err)=>{
                    this.fireEvents('afterFormCreateError');
                }
            });
        }
        
        this.formUpdate = document.querySelector(this.options.formUpdate);
        if(this.formUpdate){
            this.formUpdate.save({
                success:()=>{
                    this.fireEvents('afterFormUpdate');
                },
                failure:(err)=>{
                    this.fireEvents('afterFormUpdateError');
                }
            });
        }
        

    }

    fireEvents(name, args){

        if(typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);

    }

    getTrData(btn){
        let tr = btn.closest('tr');
        return JSON.parse(tr.dataset.row);
    }

    btnUpdateClick(e){
        this.fireEvents('beforeUpdateClick', [e]);
        let data = this.getTrData(e.target);
        for(let name in data){
            this.options.onUpdateLoad(this.formUpdate, name, data);
        }
        this.fireEvents('afterUpdateClick', [e]);
    }

    btnDeleteClick(e){
        let data = this.getTrData(e.target);
        
        if(confirm(eval('`'+ this.options.deleteMsg + '`'))){
        fetch(eval('`'+this.options.deleteUrl+'`'), {
            method: 'DELETE'
        })
            .then(response=>response.json())
            .then(json=>{
            this.fireEvents('afterDeleteClick');
            });
        }
    }

    initButtons(){

        this.rows.forEach(row=>{
            [...row.querySelectorAll('.btn')].forEach(btn=>{
                btn.addEventListener('click', e=>{
                    if(e.target.classList.contains(this.options.btnUpdate)){
                        this.btnUpdateClick(e);
                    } else if(e.target.classList.contains(this.options.btnDelete)){
                        this.btnDeleteClick(e);
                    }else{
                        this.fireEvents('buttonClick', [e.target, this.getTrData(e.target), e]);
                    }
                });
            });
        });      

    }

}