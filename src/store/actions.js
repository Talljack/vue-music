import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function({commit, state}, {list, index}) {
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
}

export const randomPlay = function({commit}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_MODE, playMode.random)
  const randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const insertSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找原来播放列表中是否还有与现在插入相同的歌曲
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以index++
  currentIndex++
  // 讲该歌曲插入到播放列表中
  playlist.splice(currentIndex, 0, song)
  // 如果原来列表中已经存在该歌曲
  if (fpIndex > -1) {
    // 如果该插入的歌曲在原来歌曲的后面
    if (currentIndex > fpIndex) {
      // 删除原来的歌曲
      playlist.splice(fpIndex, 1)
      // 当前索引index向前移一位
      currentIndex--
    } else {
      // 插入的歌曲在原来歌曲的前面，则删除原来的歌曲，因为插入歌曲所以索引值变化了
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequencelist, currentSong) + 1
  let fsIndex = findIndex(sequencelist, song)
  sequencelist.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequencelist.splice(fsIndex, 1)
    } else {
      sequencelist.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const deleteSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequencelist, song)
  sequencelist.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  const playState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playState)
}
export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSongList = function({commit, state}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayList = function({commit, state}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}