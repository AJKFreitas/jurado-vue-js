<template>
  <div class="container-fluid mt-4">
  <h1>Notas</h1>
  <div>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Avaliar Musica"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <table class="table table-striped" :title="(model.id ? 'Editar Música ID#' + model.id : 'Nova Música')">
            <thead>
              <tr>
                <th>Melodia</th>
                <th>Letra</th>
                <th>Armonia</th>
                <th>Ritimo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b-form-input id="Melodia-input" type="number" v-model.number="melodia" :state="nameState" required></b-form-input></td>
                <td><b-form-input id="Letra-input" type="number" v-model.number="letra" :state="nameState" required></b-form-input></td>
                <td><b-form-input id="Armonia-input" type="number" v-model.number="armonia" :state="nameState" required></b-form-input></td>
                <td><b-form-input id="Ritimo-input" type="number" v-model.number="ritimo" :state="nameState" required></b-form-input></td>
              </tr>
            </tbody>
          </table>
           <b-col>
              <b-form-group label="Nota Final">
                <b-form-input v-model.number="model.notaTotal" type="text" desabled></b-form-input>
              </b-form-group>
            </b-col>
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
      melodia: 0,
      letra: 0,
      armonia: 0,
      ritimo: 0,
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
    calcFinalNote () {
      this.model.notaTotal = this.melodia + this.letra + this.armonia + this.ritimo + this.model.notaTotal
    },
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
      this.calcFinalNote()
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
