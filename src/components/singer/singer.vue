<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data='singers' ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const HOT_NAME = '热门'
const HOT_LEN = 10
export default {
  mixins: [playlistMixin],
  name: 'Singer',
  data () {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created () {
    this._getSingerList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSingerList(res.data.list)
        }
      })
    },
    _normalizeSingerList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表进行有序循环，需要有序化map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style lang='stylus' scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
