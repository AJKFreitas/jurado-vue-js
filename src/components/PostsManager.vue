<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Jurado</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Grupo</th>
              <th>Graduação</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.nome }}</td>
              <td>{{ post.grupo }}</td>
              <td>{{ post.graduacao }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populatePostToEdit(post)">Edit</a> -
                <a href="#" @click.prevent="deletePost(post.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Editar' + model.nome : 'Novo Jurado')">
          <form @submit.prevent="savePost">
            <b-form-group label="Nome">
              <b-form-input type="text" v-model="model.nome"></b-form-input>
            </b-form-group>
            <b-form-group label="Grupo">
              <b-form-input type="text" v-model="model.grupo"></b-form-input>
            </b-form-group>
            <b-form-group label="Graduação">
                <b-form-input type="text" v-model="model.graduacao"></b-form-input>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Salvar</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      posts: [],
      model: {}
    }
  },
  async created () {
    this.refreshPosts()
  },
  methods: {
    async refreshPosts () {
      this.loading = true
      this.posts = await api.getPosts()
      this.loading = false
    },
    async populatePostToEdit (post) {
      this.model = Object.assign({}, post)
    },
    async savePost () {
      debugger
      if (this.model.id) {
        await api.updatePost(this.model.id, this.model)
      } else {
        await api.createPost(this.model)
      }
      this.model = {} // reset form
      await this.refreshPosts()
    },
    async deletePost (id) {
      if (confirm('Are you sure you want to delete this post?')) {
        // if we are editing a post we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deletePost(id)
        await this.refreshPosts()
      }
    }
  }
}
</script>