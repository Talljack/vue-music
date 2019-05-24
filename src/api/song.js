import {commonParams} from './config'
import axios from 'axios'
// import jsonp from 'common/js/jsonp'

export function getLyric(mid) {
  let url = '/api/getLyric'
  // let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(),
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    // var ret = res.data
    // if (typeof ret === 'string') {
    //   var reg = /^\w+\(({[^()]+})\)$/
    //   var matches = ret.match(reg)
    //   if (matches) {
    //     ret = JSON.parse(matches[1])
    //     return Promise.resolve(ret)
    //   }
    // }
    return Promise.resolve(res.data)
  })
}
