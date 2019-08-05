<template>
<div class="container-fluid">
  <b-container>
    <div class="hello">
      <h1>{{ msg }}</h1>
    </div>
    <b-table striped hover small :items="musics" :fields="fields"></b-table>
    <!-- <b-img src="../assets/fundo.jpeg" center  alt="Festival"></b-img> -->
  </b-container>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      msg: 'Festival de Cantigas 2019',
      loading: false,
      musics: [],
      model: {},
      fields: {
        nome: {
          label: 'Nome',
          sortable: true
        },
        autor: {
          label: 'Autor',
          sortable: true
        },
        grupo: {
          label: 'Grupo',
          sortable: true
        },
        toque: {
          label: 'Toque',
          sortable: true
        },
        notaTotal: {
          label: 'Nota Final',
          sortable: true
        }
      }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
div.container-fluid{
  height: 785px;
  background-image:linear-gradient( rgba(255,255,255,.8) 0%,rgba(255,255,255,.8) 100%), url("../assets/fundo.jpeg"); 
  background-repeat: no-repeat;
  background-size: 100% 100%;
 
}
</style>
