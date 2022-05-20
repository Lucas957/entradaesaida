class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){
        this.FormEl = document.getElementById(formIdCreate);
        this.FormUpdateEl = document.getElementById(formIdUpdate);
        this.tableEL = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });

        this.FormUpdateEl.addEventListener("submit", event=>{

            event.preventDefault();

            let btn = this.FormUpdateEl.querySelectorAll("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.FormUpdateEl);

            let index = this.FormUpdateEl.dataset.trIndex;

            let tr = this.tableEL.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);

           
            this.getPhoto(this.FormUpdateEl).then(
                (content)=>{

                    if(!values.photo){
                        result._photo = userOld._photo;
                    }else{
                        result._photo = content;
                    }
                    let user = new User(result);

                    user.loadFromJson(result);

                    user.save();

                    this.getTr(user, tr);
        
                    this.updateCount();

                    this.FormUpdateEl.reset(); 

                     this.showPanelCreate(); 

                     btn.disabled = false;

            },

            (e)=>{
                console.error(e);

            }

            );

        });
    }

    onSubmit(){

        this.FormEl.addEventListener('submit', event => {
            
            event.preventDefault();

            let btn = this.FormEl.querySelectorAll("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.FormEl);

            this.getPhoto(this.FormEl).then(
                (content)=>{

                values.photo = content;

                values.save();

                this.Addline(values);

                this.FormEl.reset(); 

            },

            (e)=>{
                console.error(e);

            }

            );

                    
        });
    }

    getPhoto(formEl){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

        let elements = [...formEl.elements].filter(item =>{

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

    getValues(FormEl){

        let user = {};

        [...FormEl.elements].forEach(function(field, index){

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

        let tr = this.getTr(dataUser);

        this.tableEL.appendChild(tr);

        this.updateCount();
    }

    getTr(dataUser, tr = null){

        if(tr === null) tr  = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML =  `
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-edit btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
    
    `;

    this.addEventsTr(tr);

    return tr;

    }

    getUserStorage(){

        let users = [];

        if(localStorage.getItem("users")){
            
            users = JSON.parse(localStorage.getItem("users"));
            
        }

        return users;

    }

    selectAll(){

        let users = this.getUserStorage();

        users.forEach(dataUser => {

            let user = new User();

            user.loadFromJson(dataUser);

            this.Addline(user);

        })

    }

    

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", event => {
            if(confirm("Deseja excluir esta pessoa?")){
                
                let user = new User();

                user.loadFromJson(JSON.parse(tr.dataset.user));

                user.remove();
                
                tr.remove();

                this.updateCount();
            }
        })

        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
            form.dataset.trIndex = tr.sectionRowIndex;

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

            this.FormUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();
        });
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