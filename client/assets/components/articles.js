Vue.component('all-articles', {
    data() {
        return {
            search: "",
            articles:[],
            filter: [],
            status: "",
            tag: "",
            tags: []
        
        }
    },
    components: {
        wysiwyg: vueWysiwyg.default.component,
    },
    props: ['allarticles'],        
    computed: {
        filterArticle: function() {   
            let self = this
            console.log('==========',this.allarticles)
            let theArticle =  this.allarticles.filter(function(article){
                if (article.title.toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                    return article
                } 
                else {
                    let isMatch = false
                     for (let i = 0; i <= article.tags.length-1; i++) {
                        if(article.tags[i].toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                            isMatch = true
                        }
                     }
                   
                    if (isMatch) {
                        return article
                    }
                }
            })
            this.articles = theArticle
            if (this.filter.length > 0) {
                return this.filter
            } else {
                return theArticle
            }
        }
       
    },
    methods: {
        addTags: function() {
            this.tags.push(this.tag)
            this.tag = ""
        },
        searchByTag(name) {
            axios
                .get(`${link}/articles/${name}`, {headers: {token: localStorage.getItem('token')}})
                .then(({data}) => {
                    this.filter = data
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        deleteArticle: function(id) {
            axios
                .delete(`${link}/articles/` + id, {headers: {token: localStorage.getItem('token')}})
                .then((response) => {
                    console.log(response)

                    this.articles = response.data.articles
                    this.$emit('update-articlelist')
                    swal(response.data.status, "", "success")

                })
                .catch((err) => {
                    swal(err.response.data.status, "", "error")
                })
        },
        updateArticle: function(id, title, content) {
            this.status= "loading"
            this.title = title
            this.text = content
            axios
                .put(`${link}/articles/${id}`, {title: this.title, content: this.text}, {headers: {token: localStorage.getItem('token')}})
                .then((response) => {
                    this.$emit('update-articlelist')
                    swal(response.data.status, "", "success")
                    this.title = ""
                    this.content = ""
                    this.status = ""
                })
                .catch((err) => {
                    this.status = ""
                    swal(err.response.data.status, "", "error")
                })
        }
    },
    template: `
        <div class="col-12 scroll z-depth-4" style="color:black;width:100%">
            <hr>
                
            <hr>
            <!--Carousel Wrapper-->
            <div id="carousel-example-2" class="carousel slide carousel-fade" data-ride="carousel">
                <!--Indicators-->
                <ol class="carousel-indicators">
                    <li data-target="#carousel-example-2" data-slide-to="0" class="active"></li>
                    <li data-target="#carousel-example-2" data-slide-to="1"></li>
                    <li data-target="#carousel-example-2" data-slide-to="2"></li>
                </ol>
                <!--/.Indicators-->
                <!--Slides-->
                <div class="carousel-inner" role="listbox">
                    <div class="carousel-item active">

                        <div class="view hm-black-strong">
                            <img :src="filterArticle[0].featured_image" alt="First slide" style="width: 100%; height: 95vh">
                        </div>
                        <div class="carousel-caption">
                            <h1 class="h3-responsive">{{filterArticle[0].title}}</h1>
                        </div>
                    </div>

                    <div v-if="filterArticle[1]" class="carousel-item">
                        <!--Mask color-->
                        <div class="view hm-black-strong">
                            <img :src="filterArticle[1].featured_image" alt="Second slide" style="width: 100%; height: 95vh">
                        </div>
                        <div class="carousel-caption">
                            <h1 class="h3-responsive">{{filterArticle[1].title}}</h1>
                        </div>
                    </div>
                    <div v-if="filterArticle[2]" class="carousel-item">
                        <!--Mask color-->
                        <div class="view hm-black-strong">
                            <img :src="filterArticle[2].featured_image" alt="Third slide" style="width: 100%; height: 95vh">
                        </div>
                        <div class="carousel-caption">
                            <h1 class="h3-responsive">{{filterArticle[2].title}}</h1>
                        </div>
                    </div>
                </div>
                <!--/.Slides-->
                <!--Controls-->
                <a class="carousel-control-prev" href="#carousel-example-2" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carousel-example-2" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
                <!--/.Controls-->
            </div>
            <!--/.Carousel Wrapper-->

            <form @submit.prevent="" class="input-group md-form form-sm form-2 pl-0 z-depth-1" style="border-radius: 10px">
            <input v-model="search" class="form-control my-0 py-1 " type="text" placeholder="Search Title or Tag" aria-label="Search" >
            <div class="input-group-append ">
                <span class="input-group-text blue-gradient " id="basic-text1" style="cursor: pointer"><i class="fas fa-search" aria-hidden="true"></i></span>
            </div>
            </form>
            <div v-for="index in filterArticle">
                <div class="card text-center align-self-center z-depth-2" style="height:95%;border-radius: 15px;color:black">
                    <div class="card-header" style="color:white; background:linear-gradient(to left, #BFE6BA, #D3959B);">
                        <h5 class="card-title"><strong>{{index.title}}</strong></h5>
                    </div>
                    <div  class="card-body" >
                        <img v-if="index.featured_image" :src="index.featured_image" style="width:100%">
                        <div v-html="index.content">{{index.content}}</div>
                        <p>Author: {{index.author.fullname}}</p>
                        <ul v-for="tag in index.tags" style="display:inline">
                            <span class="badge badge-pill badge-default" style="cursor:pointer" @click.prevent="searchByTag(tag)">{{tag}}</span>
                        </ul>
                        <hr>
                        <i class="far fa-edit right fa-2x" style="cursor:pointer" data-toggle="collapse" :data-target="'#collapseExample' + index._id" aria-expanded="false" aria-controls="'collapseExample' + index._id"></i>
                        <i  v-on:click.prevent="deleteArticle(index._id)" class="far fa-trash-alt fa-2x" style="cursor:pointer;"></i>

                    </div>

                    <div class="collapse" :id="'collapseExample' + index._id">
                        <div class="card card-body ">
                            <form v-on:submit.prevent="updateArticle(index._id,index.title,index.content)">
                                <div class="md-form ">
                                    <input v-model="index.title" type="text" class="form-control z-depth-1" name="title" style="border-radius: 10px;"  >
                                </div>
                                <div class="z-depth-1" style="border-radius: 15px;" >
                                    <wysiwyg v-model="index.content" />
                                </div>
                                <form @submit.prevent="addTags">
                                    <input v-model="tag" type="text" class="form-control z-depth-1" name="title" style="border-radius: 10px;" placeholder="Tags">
                                </form>
                                <ul v-for="tag in index.tags" style="display:inline">
                                    <span class="badge badge-pill badge-default">{{tag}}</span>
                                </ul>
                                <div class="text-center">
                                    <hr>
                                    <button type="submit" class="btn blue-gradient z-depth-1a" style="border-radius: 15px;"><span v-if="status === 'loading'" class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>    Update Article</button>
                                </div>
                            </form>
                                
                        </div>
                    </div>
                                                    
                </div>
            <hr>
            </div>

        </div>
    `
})