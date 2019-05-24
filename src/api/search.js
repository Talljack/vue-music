import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotSearch () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getSongBySearch (query, page, zhida, prepage) {
  const url = '/api/getSearchSong'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    w: query,
    platform: 'h5',
    format: 'json',
    uin: 0,
    needNewCode: 1,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    ie: 'utf-8',
    flag: 1,
    sem: 1,
    aggr: 0,
    prepage,
    n: prepage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    // 已经是一个json数据返回了，不再需要处理
    // var ret = res.data
    // if (typeof ret === 'string') {
    //   var reg = /{.*}/
    //   var matches = ret.match(reg)
    //   if (matches) {
    //     ret = matches[1]
    //     return Promise.resolve(ret)
    //   }
    // }
    return Promise.resolve(res.data)
  })
}