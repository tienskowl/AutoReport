"use strict";
exports.main_handler = async (event, context, callback) => {
  const axios = require("axios");
  const mailer = require("nodemailer");
  const dayjs = require("dayjs");
  let utc = require("dayjs/plugin/utc"); // dependent on utc plugin
  let timezone = require("dayjs/plugin/timezone");
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const mailFrom = "xxxxx@qq.com" // 发送邮箱
  const mailTo = "xxxx@gmail.com" // 接收邮箱
  const mailCode = "邮箱授权码 pop3/imap均可" // 发送邮箱的授权码，不是密码
  let formData = "你的 form Data"
  let username = "学号";
  let password = "密码";
  const trans = mailer.createTransport({
    service: "QQ", // 服务提供商
    port: 465, // 发送端口
    secureConnection: true, // 是否使用SSL
    auth: {
      user: mailFrom, // 邮箱账号
      pass: mailCode, // 邮箱授权码kldhogwheeuegjgj
    },
  });

  // 获取Cookie
  let res = await axios.post(
    "https://app.upc.edu.cn/uc/wap/login/check",
    `username=${username}&password=${password}`
  );
  if (res.status === 200) {
    let str = String(res.headers["set-cookie"]);
    let re1 = /eai-sess=\w*/g;
    let re2 = /UUkey=\w*/g;
    let cookie = (re1.exec(str)[0] + ";" + re2.exec(str)[0]).trim();
    let now = new Date();
    let day = "" + now.getFullYear() + (now.getMonth() + 1) + now.getDate();
    let data = formData.replace(/date=\d{8}/g, `date=${day}`);
    let config = {
      method: "post",
      url: "https://app.upc.edu.cn/ncov/wap/default/save",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        Referer: "https://app.upc.edu.cn/ncov/wap/default/index",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 Edg/83.0.478.45",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: cookie,
      },
      data: data,
    };

    let ret = await axios(config);
    let text = ret.data["m"];
    let message = {
      from: mailFrom,
      to: mailTo,
      subject: text,
      text: text,
    };
    if(dayjs().tz("Asia/Shanghai").isAfter(dayjs().tz("Asia/Shanghai").hour(7))){// 需要其他时间发送自行更改
      const res = await trans.sendMail(message, (err, info) => {
        if (err) return err;
        else return "发送成功";
      });
    }
    return ret;
  } else {
    return "登陆出错 ";
  }
};
