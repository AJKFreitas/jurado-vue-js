<template>
  <div class="container-fluid mt-4">
    <h1>Música</h1>
    <div>
      <b-container>
         <b-button v-b-toggle.collapse-1 variant="primary">Nova Música</b-button>
        <b-collapse id="collapse-1" class="mt-2">
        <b-card :title="(model.id ? 'Editar Música:' + model.nome : 'Nova Música')">
        <form @submit.prevent="saveMusic">
          <b-row>
            <b-col>
              <b-form-group label="Título">
                <b-form-input v-model="model.nome" type="text"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Autor">
                <b-form-input v-model="model.autor" type="text"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Grupo">
                <b-form-input v-model="model.grupo" type="text"></b-form-input>
                <b-form-input hidden v-model.number="model.notaTotal" type="text"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
              <b-col>
                  <b-form-group label="Toque">
                      <b-form-radio-group
                        id="radio-group-1"
                        v-model="model.toque" :options="options"
                        name="radio-options"></b-form-radio-group>
                  </b-form-group>
                  <b-form-group label="&nbsp;">
                    <b-btn type="submit" variant="success">Salvar</b-btn>
                  </b-form-group>
            </b-col>
          </b-row>
        </form>
        </b-card>
        </b-collapse>
        <b-col>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Grupo</th>
                <th>Toque</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="music in musics" :key="music.id">
                <td>{{ music.nome }}</td>
                <td>{{ music.autor }}</td>
                <td>{{ music.grupo }}</td>
                <td>{{ music.toque }}</td>
                <td class="text-right">
                  <b-button variant="warning" @click.prevent="populateMusicToEdit(music)">Editar</b-button>
                  <b-button variant="danger" @click.prevent="deleteMusic(music.id)">Deletar</b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-container>
    </div>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      musics: [],
      model: {},
      options: [
        { text: 'São Bendo Grande de Angola', value: 'São Bendo Grande de Angola' },
        { text: 'São Bento Grande', value: 'São Bento Grande' },
        { text: 'São Bento Pequeno', value: 'São Bento Pequeno' },
        { text: 'Benguela', value: 'Benguela' },
        { text: 'Angola', value: 'Angola' }
      ]
    }
  },
  async created () {
    this.refreshMusics()
  },
  methods: {
    async refreshMusics () {
      this.loading = true
      this.musics = await api.getMusics()
      this.loading = false
    },
    async populateMusicToEdit (music) {
      this.model = Object.assign({}, music)
    },
    async saveMusic () {
      if (this.model.id) {
        await api.updateMusic(this.model.id, this.model)
      } else {
        await api.createMusic(this.model)
      }
      this.model = {} // reset form
      await this.refreshMusics()
    },
    async deleteMusic (id) {
      if (confirm('Are you sure you want to delete this music?')) {
        // if we are editing a music we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteMusic(id)
        await this.refreshMusics()
      }
    }
  }
}
</script>

