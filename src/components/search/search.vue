<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query='onQueryChange'></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll :refreshDelay='refreshDelay' class="shortcut" ref="shortcut" :data='shortData'>
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotSearch" :key="item.n">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete='deleteSearchHistory' :searches='searchHistory'></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @blurInput='blurInput' :query='query' @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text='是否删除所有的搜索历史记录' confirmBtnText='删除' @confirm='clearSearchHistory'></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import { getHotSearch } from 'api/search'
import { ERR_OK } from 'api/config'
import { shuffle } from 'common/js/util'
import Suggest from 'components/suggest/suggest'
import Confirm from 'base/confirm/confirm'
import { mapActions } from 'vuex'
import SearchList from 'base/search-list/search-list'
import { playlistMixin, searchMixin } from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
export default {
  name: 'Search',
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  created () {
    this._getHotSearch()
  },
  data () {
    return {
      hotSearch: []
    }
  },
  computed: {
    shortData () {
      return this.hotSearch.concat(this.searchHistory)
    }
  },
  methods: {
    showConfirm () {
      this.$refs.confirm.show()
    },
    handlePlayList (list) {
      const bottom = list.length ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotSearch() {
      getHotSearch().then((res) => {
        if (res.code === ERR_OK) {
          this.hotSearch = shuffle(res.data.hotkey).slice(0, 10)
        }
      })
    },
    ...mapActions(
      [
        'clearSearchHistory'
      ]
    )
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
            &:first-of-type
              color aqua
              border 1px solid aqua
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
