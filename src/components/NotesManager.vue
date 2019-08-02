<template>
  <div class="container-fluid mt-4">
  <h1>Notas</h1>
    <b-container>
        <div>
            <b-modal id="modal-1">
              <div class="d-block">Hello From My Modal!</div>
              <b-card :title="(model.id ? 'Editar Música ID#' + model.id : 'Nova Música')">
              <form @submit.prevent="saveMusic">
                <b-row>
                  <b-col>
                    <b-form-group label="Nome">
                      <b-form-input v-model="model.nome" type="text"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Autor">
                      <b-form-input v-model="model.autor" type="text"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Nota Final">
                      <b-form-input v-model="model.notaTotal" type="text"></b-form-input>
                    </b-form-group>
                    </b-col>
                    <b-col>
                    <b-form-group label="&nbsp;">
                      <b-btn type="submit" variant="success">Salvar</b-btn>
                    </b-form-group>
                  </b-col>
                </b-row>
              </form>
        </b-card>
            </b-modal>
        </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Autor</th>
                <th>Nota Total</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="music in musics" :key="music.id">
                <td>{{ music.nome }}</td>
                <td>{{ music.autor }}</td>
                <td>{{ music.notaTotal }}</td>
                <td class="text-right">
                  <b-button @click="showModal" @click.prevent="populateMusicToEdit(music)" ref="btnShow">Pontuar</b-button>
                  <!-- <b-button variant="warning" @click.prevent="populateMusicToEdit(music)">Editar</b-button>
                  <b-button variant="danger" @click.prevent="deleteMusic(music.id)">Deletar</b-button> -->
                </td>
              </tr>
            </tbody>
          </table>
    </b-container>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      nota: [],
      musics: [],
      model: {}
    }
  },
  async created () {
    this.refreshMusics()
  },
  methods: {
    showModal () {
      this.$root.$emit('bv::show::modal', 'modal-1', '#btnShow')
    },
    hideModal () {
      this.$root.$emit('bv::hide::modal', 'modal-1', '#btnShow')
    },
    toggleModal () {
      this.$root.$emit('bv::toggle::modal', 'modal-1', '#btnToggle')
    },
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
