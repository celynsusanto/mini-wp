// const link = 'http://localhost:3000'
const link = 'http://writywrite-server.celyn-portfolio.world'

const app = new Vue({
    el: '#app',
    data: {
        user: null,
        page: "articles",
        articles: [],
    },
    methods: {
        addArticle: function(payload){
            this.allArticles()
        },
        checkUser: function(payload) {
            axios
                .get(`${link}/users`, {headers: {token: localStorage.getItem('token')}})
                .then(({data}) => {
                    if (data.source) {
                        this.user = data.source
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        allArticles: function() {
            axios
                .get(`${link}/articles`, {headers: {token: localStorage.getItem('token')}})
                .then(({data}) => {
                    this.articles = data
                })
                .catch((err) => {
                    console.log(err)
                }) 
        },
        changePage: function(page) {
            console.log('=====')
            console.log(page)
            this.page = page
        },
        logout: function() {
            if (this.user === "manual") {
                localStorage.removeItem('token')
                this.user = null
            } else {
                let auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                });
                localStorage.removeItem('token')
                this.user = null
            }

        }
    }, 
    created:  function() {
        if (localStorage.getItem('token')) {
            this.checkUser()
        }
        this.allArticles()
    }

}) 

