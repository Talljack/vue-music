<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent='progressTouchStart'
           @touchmove.prevent='progressTouchMove'
           @touchend.prevent='progressTouchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
const btnWidth = 16
const transform = prefixStyle('transform')
export default {
  name: 'ProgressBar',
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.inition = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.inition) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - btnWidth, Math.max(0, deltaX + this.touch.left))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.inition = false
      this._triggerPrecent()
    },
    progressClick (e) {
      // 当我们点击 progressBtn 的时候，进度条会跳转出错
      const reac = this.$refs.progressBar.getBoundingClientRect()
      let offsetWidth = e.pageX - reac.left
      this._offset(offsetWidth)
      this._triggerPrecent()
    },
    _triggerPrecent () {
      const barWidth = this.$refs.progressBar.clientWidth - btnWidth
      const precent = this.$refs.progress.clientWidth / barWidth
      this.$emit('progressPrecent', precent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    precent(newPrecent) {
      if (newPrecent >= 0 && !this.touch.inition) {
        const barWidth = this.$refs.progressBar.clientWidth - btnWidth
        const offsetWidth = newPrecent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '~common/stylus/variable'
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
