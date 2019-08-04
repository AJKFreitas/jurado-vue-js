<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
<div>
  <b-img src="../assets/fundo.jpeg" center  alt="Festival"></b-img>
</div>

  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Festival de Cantigas 2019'
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
</style>
