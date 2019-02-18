
Vue.component('login-user', {
    data() {
        return {
            email: "",
            password: "",
            status:""
        }
    },
    mounted() {
        gapi.signin2.render('google-signin-button', {
          onsuccess: this.onSignIn
        })
    },
    methods: {
        login: function() {
            this.status ="loading"
            axios
                .post(`${link}/users/login`, {email: this.email, password: this.password})
                .then(({data}) => {
                    localStorage.setItem('token', data.token)
                    this.status =""
                    swal(data.status, "", "success")
                    this.$emit('login-success', "manual")
                })
                .catch((err) => {
                    this.status =""
                    swal(err.response.data.status, "", "error")
                })
        }, 
        onSignIn: function(googleUser) {
            this.status ="loading"
            let profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

            let id_token = googleUser.getAuthResponse().id_token;
            console.log('===', id_token)

            axios
                .post(`${link}/users/authentication/google`, {token: id_token})
                .then(({data}) => {
                    localStorage.setItem('token', `${data.token}`)
                    this.status =""
                    this.$emit('signin-google', "google")
                })
                .catch(err => {
                    this.status = ""
                    console.log(err)
                })
        }
    },
    template: `
        <form @submit.prevent="login">
            <div class="md-form form-sm mb-5">
                <i class="fas fa-envelope prefix"></i>
                <input v-model="email" type="email" class="form-control form-control-sm validate">
                <label>Your email</label>
            </div>

            <div class="md-form form-sm mb-4">
                <i class="fas fa-lock prefix"></i>
                <input v-model="password" type="password" class="form-control form-control-sm validate">
                <label>Your password</label>
            </div>
            <div class="text-center form-sm mt-2">
                <button type="submit"class="btn btn-info"><span v-if="status === 'loading'" class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>    Login <i class="fas fa-sign-in ml-1"></i></button>
            </div>
            <hr>
            <div class="justify-content-center form-sm mt-2" >
                <div id="google-signin-button"></div>
            </div>
        </form>
    </div>
    `
})