const request = require('request');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

var data = '';
const YYKEY = '7mgf5f8he941u28q';
const city = 'CH180501';//平顶山
const url = ' http://api.yytianqi.com/forecast7d?city=' + city + '&key=' + YYKEY;
const host = '345841634@qq.com';
const to = 'huipay@huipay.com'

var rule = new schedule.RecurrenceRule();
rule.hour = 16;
rule.minute = 6;
rule.second = 0;

var data = '';
var j = schedule.scheduleJob(rule, function () {
    console.log('发送天气预报。。。');
    sendWeather();
});

function sendWeather() {
    request(url, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        data = JSON.parse(body);
        var transporter = nodemailer.createTransport({
            host: "smtp.qq.com",//主机
            port: 465,
            secure: true,
            auth: {
                user: host,//你自己的邮箱，博主的是网易邮箱
                pass: 'zhulz@huipay'//邮箱的密码
            }
        });
        var mailOptions = {
            from: host,
            to: to,//要发送的邮箱地址
            subject: '今天天气',
            text: '城市 :' + data.data.cityName + '时间：' + data.data.sj,
            html: '<b>白天天气情况：' + data.data.list[0].tq1 + '</b><br/><b>城市：' + data.data.cityName + '</b><br/><b>夜间天气:' + data.data.list[0].tq2 + '</b><br/>白天温度' + data.data.list[0].qw1 + '度<br/>夜间温度' + data.data.list[0].qw2
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return console.log(err);
            }
            console.log('Message %s sent %s', info.messageId, info.response);
        });
    });
}

