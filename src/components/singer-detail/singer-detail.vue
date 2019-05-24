<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  name: 'SingerDetail',
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.data.list).slice()
        }
      })
    },
    _normalizeSong(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          // getMusic(musicData.songmid).then((res) => {
          //   console.log(res)
          //   const songVkey = res.midurlinfo[0].purl
          //   ret.push(createSong(musicData, songVkey))
          // })
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.5s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100% 0 0);
}
</style>
