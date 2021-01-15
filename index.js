'use strict'
exports.main_handler = async (event, context, callback) => {
  const axios = require('axios')
  const dayjs = require('dayjs')
  const utc = require('dayjs/plugin/utc') // dependent on utc plugin
  const timezone = require('dayjs/plugin/timezone')
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const username = '学号'
  const password = '密码'
  const apiKey = 'Server酱APIKEY'
  // 设置Headers
  const getHeaders = async () => {
    let res = await axios.post(
      'https://app.upc.edu.cn/uc/wap/login/check',
      `username=${username}&password=${password}`
    )
    let str = String(res.headers['set-cookie'])
    let re1 = /eai-sess=\w*/g
    let re2 = /UUkey=\w*/g
    let cookie = (re1.exec(str)[0] + ';' + re2.exec(str)[0]).trim()
    let headers = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Referer: 'https://app.upc.edu.cn/ncov/wap/default/index',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 Edg/83.0.478.45',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: cookie,
    }
    return headers
  }
  // 获取数据
  const getData = async () => {
    let res = await axios({
      method: 'get',
      url: 'https://app.upc.edu.cn/ncov/wap/default/index',
      headers,
    })
    let data = res.data.d.oldInfo
    // 移动标志位重置
    if (data.ismoved === '1') {
      data.ismoved = '0'
      data.bztcyy = ''
    }
    // 更新日期
    data.date = dayjs().tz('Asia/Shanghai').format('YYYYMMDD')
    return data
  }
  // 提交表单
  const postData = async () => {
    let ret = await axios({
      method: 'post',
      url: 'https://app.upc.edu.cn/ncov/wap/default/save',
      headers,
      data: data,
      transformRequest: [
        function (data) {
          let ret = ''
          for (let et in data) {
            ret +=
              encodeURIComponent(et) + '=' + encodeURIComponent(data[et]) + '&'
          }
          return ret
        },
      ],
    })
    return ret.data['m']
  }
  // 推送消息
  const postInfo = async () => {
    if (
      dayjs().tz('Asia/Shanghai').isAfter(dayjs().tz('Asia/Shanghai').hour(7))
    ) {
      return await axios({
        method: 'post',
        url: encodeURI(`https://sc.ftqq.com/${apiKey}.send?text=${text}`),
      }).catch((err) => console.log(err))
    }
  }

  const headers = await getHeaders()
  const data = await getData()
  const text = await postData()
  // 7点之后通知是否填表成功
  // 如果不想获取通知请注释该行
  const i = await postInfo()
  console.log(text)
  return text
}
