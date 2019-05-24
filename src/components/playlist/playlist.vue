<template>
  <transition class="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="modeChange"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll :refreshDelay='refreshDelay' ref="scrollList" class="list-content" :data='sequencelist'>
          <transition-group name='list' tag="ul">
            <li ref="itemList" class="item" v-for="(item, index) in sequencelist" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIndex(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like"  @click.stop="toggleFavorite(item)">
                <i class="icon" :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到列表</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text='是否删除所有列表歌曲' confirmBtnText='删除' @confirm='deleteConfirm'></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { mapActions } from 'vuex'
import {playMode} from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'
export default {
  name: 'PlayList',
  mixins: [playerMixin],
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  data () {
    return {
      showFlag: false,
      refreshDelay: 120
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.scrollList.refresh()
        this.scrollToCurrentSong(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIndex (item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrentSong(current) {
      let index = this.sequencelist.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.scrollList.scrollToElement(this.$refs.itemList[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.sequencelist) {
        this.setPlayingState(false)
      }
      if (!this.playlist.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    deleteConfirm () {
      this.deleteSongList()
      this.hide()
    },
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapActions(
      ['deleteSong', 'deleteSongList']
    )
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrentSong(newSong)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
