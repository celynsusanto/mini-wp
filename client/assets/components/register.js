
Vue.component('register-user', {
    data() {
        return {
            fullname:"",
            email:"",
            password:"",
            msg:null,
            status:""
        }
    },
    methods: {
        register() {
            this.status="loading"

            let user = {
                fullname: this.fullname,
                email: this.email,
                password: this.password
            }
            axios
                .post(`${link}/users/register`, user)
                .then(({data}) => {
                    this.status = ""
                    this.fullname = ""
                    this.email = ""
                    this.password = ""
                    swal(data.status, "", "success")
                })
                .catch((err) => {
                    this.status =""
                    this.msg = err.response.data.status
                    swal(err.response.data.status, "", "error")
                })
        }

    },
    template: `
            
    <div class="card-body">
        <form @submit.prevent="register">
            <div class="md-form form-sm mb-5">
                <i class="fas fa-user prefix"></i>
                <input v-model="fullname" type="text" class="form-control form-control-sm">
                <label>Your fullname</label>
            </div>

            <div class="md-form form-sm mb-5">
                <i class="fas fa-envelope prefix"></i>
                <input v-model="email" type="email" class="form-control form-control-sm validate">
                <label>Your email</label>
            </div>

            <div class="md-form form-sm mb-5">
                <i class="fas fa-lock prefix"></i>
                <input v-model="password" type="password" class="form-control form-control-sm validate">
                <label>Your password</label>
            </div>

            <div class="text-center form-sm mt-2">
                <button  type="submit"class="btn btn-info"><span v-if="status === 'loading'" class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>   Sign up <i class="fas fa-sign-in ml-1"></i></button>
            </div>
        </form> 

    </div>

    `
})