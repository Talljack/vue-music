<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" v-model="query" class="box" :placeholder="placeholder" ref="query">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'

export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    },
    blur () {
      this.$refs.query.blur()
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 1000))
  }
}
</script>

<style lang='stylus' scoped>
  @import '~common/stylus/variable'
    .search-box
      display flex
      align-items center
      box-sizing border-box
      width 100%
      height 40px
      padding 0 6px
      background $color-highlight-background
      border-radius 6px
      .icon-search
        font-size 24px
        color $color-background
      .box
        flex 1
        margin 0 5px
        line-height 18px
        background $color-highlight-background
        font-size $font-size-medium
        color $color-text
        &::placeholder
          color $color-text-d
      .icon-dismiss
        font-size 16px
        color $color-background
</style>
