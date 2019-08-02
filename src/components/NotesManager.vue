<template>
  <div class="container-fluid mt-4">
  <h1>Notas</h1>
  <div>
    

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Submit Your Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
    <b-container>
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
                  <b-button v-b-modal.modal-prevent-closing @click.prevent="populateMusicToEdit(music)">Pontuar</b-button>
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
      model: {},
      name: '',
      nameState: null,
      submittedNames: []
    }
  },
  async created () {
    this.refreshMusics()
  },
  methods: {
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid ? 'valid' : 'invalid'
      return valid
    },
    resetModal () {
      this.name = ''
      this.nameState = null
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      this.saveMusic()
      this.$nextTick(() => {
        this.$refs.modal.hide()
      })
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
