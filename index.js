'use strict'
exports.main_handler = async (event, context, callback) => {
  let cookie = '替换为你自己的Cookie'
  let formData = '替换为form data'
  let apiKey = 'Server酱的Key'
  const axios = require('axios')
  let now = new Date()
  let day = '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() - 1
  let data = formData.replace(/date=\d{8}/g, `date=${day}`)
  let config = {
    method: 'post',
    url: 'https://app.upc.edu.cn/ncov/wap/default/save',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Referer: 'https://app.upc.edu.cn/ncov/wap/default/index',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 Edg/83.0.478.45',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: cookie,
    },
    data: data,
  }

  let ret = await axios(config)
  let text = ret.data['m']
  let dat = await axios.post(
    encodeURI(`https://sc.ftqq.com/${apiKey}.send?text=${text}`)
  )
  return text
}
