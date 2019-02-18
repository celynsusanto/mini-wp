Vue.component('add-article', {
    data() {
        return{
            title: "",
            text: "",
            file: "",
            tag: "",
            tags: [],
            status: ""
        }
    },
    components: {
        wysiwyg: vueWysiwyg.default.component,

    },
    methods: {
        addTags: function() {
            this.tags.push(this.tag)
            this.tag = ""
        },
        addArticle: function() {
            this.status="loading"
            const formData = new FormData()
            formData.append('featured_image', this.file[0])
            formData.append('title', this.title)
            formData.append('content', this.text)
            formData.append('tags', this.tags)
            axios
                .post(
                    `${link}/articles`,
                    formData,
                    {headers: {"Content-Type" : 'multipart/form-data', token: localStorage.getItem('token')}})
                .then((response) => {
                    this.$emit('add-article')
                    this.title = ""
                    this.text = ""
                    this.tags = []
                    this.status = ""
                    swal(response.data.status, "", "success")
                })
                .catch((err) => {
                    this.status =""
                    console.log(err.message)
                })
        },
        previewFiles() {
            this.file = this.$refs.myFiles.files
        },
    },
    template: `
        <div  class="card-body z-depth-2" style="color:black; background-color: white">
            <form v-on:submit.prevent="addArticle()">
                <div class="md-form ">
                        <input v-model="title" type="text" class="form-control z-depth-1" name="title" style="border-radius: 10px;">
                        <label for="form106">Title</label>
                    </div>
                    <div class="z-depth-1" style="border-radius: 15px;" >
                        <wysiwyg v-model="text"/>
                    </div>
                    <div class="text-center">
                    <hr>
                    <input type="file" ref="myFiles" @change="previewFiles" multiple>
                    <hr>
                    <form @submit.prevent="addTags">
                        <input v-model="tag" type="text" class="form-control z-depth-1" name="title" style="border-radius: 10px;" placeholder="Tags">
                    </form>
                    <ul v-for="tag in tags" style="display:inline">
                        <span class="badge badge-pill badge-default">{{tag}}</span>
                    </ul>
                    <hr>
                    <div class="text-center">
                        <hr>
                        <button type="submit" class="btn blue-gradient z-depth-1a" style="border-radius: 15px;"><span v-if="status === 'loading'" class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>    Add Article</button>

                    </div>
                </div>
            </form>
        </div>
    `
})