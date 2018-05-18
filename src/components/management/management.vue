<template>
  <div class="management">
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="green" dark class="mb-2 add-file" @click="newItem">新建</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="manageList"
      hide-actions
      class="data-table"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-card>
            <v-card-media :src="addBase(props.item.posterKey)" height="200">
            </v-card-media>
          </v-card>
        </td>
        <td class="text-xs-left">{{ props.item.title }}</td>
        <td class="text-xs-left">{{ parseFloat(props.item.rate) }}</td>
        <td class="text-xs-left">{{ formateDate(props.item.meta.updatedAt) }}</td>
        <td class="text-xs-left">{{ formateDate(props.item.meta.createdAt) }}</td>
        <td class="text-xs-left">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
import {baseUrlMixin} from '../../common/js/mixin.js'

export default {
  name: 'management',
  mixins: [baseUrlMixin],
  data() {
    return {
      manageList: [],
      dialog: false,
      headers: [
        {
          text: '海报',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: '名字', value: 'title' },
        { text: '评分', value: 'rate' },
        { text: '修改时间', value: 'meta.updatedAt' },
        { text: '添加时间', value: 'meta.createdAt' },
        { text: '操作', value: 'name', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        title: '',
        rate: 0,
        url: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        title: '22',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '添加电影' : '编辑电影'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initData() // 所有电影数据
  },

  methods: {
    initData() { // 所有电影数据
      axios.get('/admin/movie/list').then(res => {
        this.manageList = res.data.movies
      })
    },
    formateDate(date) {
      let newDate = new Date(date)
      let year = newDate.getFullYear()
      let month = this.addZero(newDate.getMonth() + 1)
      let theDate = this.addZero(newDate.getDate())
      let hour  = this.addZero(newDate.getHours())
      let min = this.addZero(newDate.getMinutes())
      let sec = this.addZero(newDate.getSeconds())
      let ret = year + '/' + month + '/' + theDate + ' | | ' + hour+ ':' + min + ':' + sec
      return ret
    },
    addZero(d) {
      d = d.toString()
      return d.length < 2 ? '0' + d : d
    },
    newItem() {
      this.dialog = true
      this.editedIndex = -1
    },
    editItem (item) {
      this.dialog = true
      this.editedIndex = 0
    },
    deleteItem (item) {
      let confirm =  window.confirm('确定要删除' + item.title + '吗')
      if (confirm) {
        axios.delete(`admin/movies/?id=${item._id}`)
          .then(res => {
            this.manageList = res.data.data
            console.log(res.data.data)
          })
      }
    },
    close () {
      this.dialog = false
      // setTimeout(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem)
      //   this.editedIndex = -1
      // }, 300)
    },
    save () {
      // if (this.editedIndex > -1) {
      //   Object.assign(this.desserts[this.editedIndex], this.editedItem)
      // } else {
      //   this.desserts.push(this.editedItem)
      // }
      this.close()
    }
  }
}
</script>


<style media="screen">
.management .data-table thead{
  background: rgb(5, 147, 130);
}
.management .data-table .text-xs-left{
  font-size: 18px !important;
}
.management .data-table .card__media__content{
  width: 200px !important;
}

</style>