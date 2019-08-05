<template>
  <div class="container-fluid mt-4">
  <h1>Notas</h1>
  <div>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      size="lg"
      :title="(model.id ? 'Avaliar Música: ' + model.nome : 'Nova Música')"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <table class="table table-striped" :title="(model.id ? 'Editar Música' + model.nome : 'Nova Música')">
            <thead>
              <tr>
                <th>Jure</th>
                <th>Melodia</th>
                <th>Letra</th>
                <th>Enredo</th>
                <th>Execução</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(jure, index) in jurados" :key="jure.id">
                  <td>{{ jure.nome }}</td>
                <td><b-form-input id="Melodia-input" type="number" v-model.number="melodia[index]" :state="nameState" ></b-form-input></td>
                <td><b-form-input id="Letra-input" type="number" v-model.number="letra[index]" :state="nameState" ></b-form-input></td>
                <td><b-form-input id="Enredo-input" type="number" v-model.number="enredo[index]" :state="nameState" ></b-form-input></td>
                <td><b-form-input id="Execucaoo-input" type="number" v-model.number="execucao[index]" :state="nameState" ></b-form-input></td>
              </tr>
            </tbody>
          </table>
           <b-col class="md">
              <b-input-group prepend="Nota Final" class="mt-3">
                <b-form-input v-model.number="model.notaTotal" type="text" readonly required></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-success" v-b-modal.modal-prevent-closing @click.prevent="calcFinalNote()">Calcular</b-button>
                </b-input-group-append>
              </b-input-group>
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
                  <b-button variant="primary" v-b-modal.modal-prevent-closing @click.prevent="populateMusicToEdit(music)">Pontuar</b-button>
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
      melodia: [],
      letra: [],
      enredo: [],
      execucao: [],
      loading: false,
      nota: [],
      musics: [],
      jurados: [],
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
      this.model.notaTotal = this.melodia.reduce((a, b) => a + b) + this.letra.reduce((a, b) => a + b) + this.enredo.reduce((a, b) => a + b) + this.execucao.reduce((a, b) => a + b)
      this.resetModal()
    },
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid ? 'valid' : 'invalid'
      return valid
    },
    resetModal () {
      this.name = ''
      this.nameState = null
      this.enredo = []
      this.melodia = []
      this.letra = []
      this.execucao = []
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
      this.jurados = await api.getPosts()
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
