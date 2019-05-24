<template>
  <transition class="slide">
    <music-list :title="title" :bg-image="bgImage" :songs='songs'></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'common/js/songList'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
export default {
  name: 'Disc',
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters(['disc'])
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      getSongList().then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalize(res.cdlist[0].songlist)
        }
      })
    },
    _normalize(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songmid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '~common/stylus/variable'
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
