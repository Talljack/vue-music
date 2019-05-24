export const singer = state => state.singer

export const playing = state => state.playing

export const fullscreen = state => state.fullscreen

export const playlist = state => state.playlist

export const sequencelist = state => state.sequencelist

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = (state) => {
  return state.disc
}

export const topList = (state) => {
  return state.topList
}

export const searchHistory = state => {
  return state.searchHistory
}

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList