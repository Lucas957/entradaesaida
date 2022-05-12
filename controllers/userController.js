class UserController{

    constructor(FormId, tableId){
        this.FormEl = document.getElementById(FormId);
        this.tableEL = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });
    }

    onSubmit(){

        this.FormEl.addEventListener('submit', event => {
            
            event.preventDefault();

            let btn = this.FormEl.querySelectorAll("[type=submit]");

            btn.disabled = true;

            let values = this.getValues();

            this.getPhoto().then(
                (content)=>{

                values.photo = content;
                this.Addline(values);
                this.FormEl.reset(); 

            },

            (e)=>{
                console.error(e);

            }

            );

                    
        });
    }

    getPhoto(){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

        let elements = [...this.FormEl.elements].filter(item =>{

            if (item.name === 'photo'){
                return item;
            }
        });

        let file = (elements[0].files[0]);
        console.log(file);
        fileReader.onload = ()=>{

            resolve(fileReader.result);

        };

        fileReader.onerror = (e)=>{
            reject(e)
        }

        if(file){
            fileReader.readAsDataURL(file);
        }else{
            resolve('dist/img/boxed-bg.jpg');
        }
        })

        l

    }

    getValues(){

        let user = {};

        [...this.FormEl.elements].forEach(function(field, index){

            if(field.name == "gender"){
                if(field.checked){
                    user[field.name] = field.value;
                }
            } else if(field.name == 'admin'){
                user[field.name] = field.checked;
            } else{
                user[field.name] = field.value;
            }
        
        });
    
        return new User(user.name,
            user.gender,
            user.birth,
            user.country,
            user.email, 
            user.password, 
            user.photo, 
            user.admin);

    }//fecha getValues

    Addline(dataUser){

        var tr  = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML =  `
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-edit btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
    
    `;

        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
            

            for (let name in json){
                
                let field = form.querySelector("[name=" + name.replace("_", "") + "]");

                if(field){

                    switch(field.type){
                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value="+json[name]+"]");
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        
                        default:
                            field.value = json[name];

                    }
 
                }
                

            }

            this.showPanelUpdate();
        });

        this.tableEL.appendChild(tr);

        this.updateCount();
    }

    

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){
        
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEL.children].forEach(tr=>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if(!user._admin){
                numberAdmin++;
            }
            console.log(user);
            console.log(numberAdmin, numberUsers);
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }

}