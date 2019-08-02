import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:3000/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getPosts () {
    return this.execute('get', '/posts')
  },
  getPost (id) {
    return this.execute('get', `/posts/${id}`)
  },
  createPost (data) {
    return this.execute('post', '/posts', data)
  },
  updatePost (id, data) {
    return this.execute('put', `/posts/${id}`, data)
  },
  deletePost (id) {
    return this.execute('delete', `/posts/${id}`)
  },

  getMusics () {
    return this.execute('get', '/musics')
  },
  getMusic (id) {
    return this.execute('get', `/music/${id}`)
  },
  createMusic (data) {
    return this.execute('post', '/musics', data)
  },
  updateMusic (id, data) {
    return this.execute('put', `/musics/${id}`, data)
  },
  deleteMusic (id) {
    return this.execute('delete', `/musics/${id}`)
  }
}
