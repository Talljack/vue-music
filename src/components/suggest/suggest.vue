<template>
  <scroll
    class="suggest"
    :pullup='pullup'
    :data='result'
    :beforeScroll='beforeScroll'
    @scrollToEnd='searchMore'
    @beforeScroll='handleBeforeScroll'
    ref="scroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="item + '-' + index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length && !hasMore">
      <no-result></no-result>
    </div>
  </scroll>
</template>

<script>
import {getSongBySearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'
import { mapMutations, mapActions } from 'vuex'

const SING_TYPE = 'singer'
const perpage = 20
export default {
  name: 'Suggest',
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    getIconCls(item) {
      if (item.type && item.type === SING_TYPE) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === SING_TYPE) {
        return item.singername
      } else {
        return `${item.name}--${item.singer}`
      }
    },
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.scroll.scrollTo(0, 0, 0)
      getSongBySearch(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkHasMore(res.data)
        }
      })
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      getSongBySearch(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkHasMore(res.data)
        }
      })
    },
    selectItem (item) {
      if (item.type === SING_TYPE) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    handleBeforeScroll () {
      this.$emit('blurInput')
    },
    refresh() {
      this.$refs.scroll.refresh()
    },
    _checkHasMore(data) {
      let song = data.song
      if (!song.list.length || song.curnum * song.curpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(list) {
      let ret = []
      if (list.zhida && list.zhida.singerid) {
        ret.push({...list.zhida, ...{type: SING_TYPE}})
      }
      if (list.song) {
        ret = ret.concat(this._normalize(list.song.list))
      }
      return ret
    },
    _normalize(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          // getMusic(musicData.songmid).then((res) => {
          //   const songVkey = res.midurlinfo[0].purl
          //   ret.push(createSong(musicData, songVkey))
          // })
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (newQuery) {
      this.search(newQuery)
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
