<template>
  <scroll class="listview"
    :data='data'
    ref="listview"
    :listenScroll='listenScroll'
    @scroll='scroll'
    :probeType='probeType'
  >
    <ul>
      <li v-for="(group, index) in data" :key="group.title + '-' + index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" @click="selectItem(item)" :key="item.id" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart='onShortcutTouchStart' @touchmove.stop.prevent='onShortcutTouchMove'>
      <ul>
        <li class="item" v-for="(item, index) in scrollList"
          :key="item + '-' + index"
          :data-index='index'
          :class="{'current': currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      fixTop: 0
    }
  },
  computed: {
    scrollList() {
      return this.data.map((item) => {
        return item.title.substring(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      // 需要获取到当前点击的index
      let anchorIndex = getData(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当newY 大于0的时候直接让currentIndex等于0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 当newY滚动到中间部分时
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.diff = height2 + newY
          this.currentIndex = i
          return
        }
      }
      //  当滚动到最底部时
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixTop === fixTop) {
        return
      }
      this.fixTop = fixTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixTop}px, 0)`
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '~common/stylus/variable';
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -2px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
