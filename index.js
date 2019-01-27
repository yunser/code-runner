// var router=require("./router");
// var server=require("./server");
// var requestHandlers=require("./requestHandlers");

// var handle={};
// handle["/"]=requestHandlers.start;
// handle["/start"]=requestHandlers.start;
// handle["/uploadJava"]=requestHandlers.uploadJava;
// handle["/uploadC"]=requestHandlers.uploadC;
// handle["/uploadPython"]=requestHandlers.uploadPython;
// handle["/uploadCPP"]=requestHandlers.uploadCPP;
// handle["/uploadBash"]=requestHandlers.uploadBash;

// server.start(router.route,handle);

const express = require('express')
const app = express()
const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const uuid = require('uuid/v1')

function getId() {
    return uuid().replace(/-/g, '')
}

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: false})) // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/asd', (req, res) => {
    let {lang, code} = req.body

    function runCode(ext, cmd) {
        console.log('ip', req.ip)
        // let filePath = '/tmp/123'
        let uuid = getId()
        // let filePath = '/home/code/tmp/123'
        let filePath = `/tmp/code/${uuid}`
        let fileName = 'test.' + ext
        let p = path.resolve(filePath, fileName)
        fs.mkdirSync(filePath)
        fs.writeFileSync(p, code, 'utf-8')
        exec(`cd ${filePath};${cmd.replace('xxx', fileName)}`, (error, stdout, stderr) => {
            console.log('执行完2')
            console.log(error, stdout)
            res.json({
                result: stdout || stderr
            })
        })
    }
    let langs = {
        'python2.7': {
            ext: 'py',
            cmd: 'python xxx'
        },
        'python3.6': {
            ext: 'py',
            cmd: '/usr/local/python3.6.3/bin/python3 xxx'
        },
        'rust': {
            ext: 'rs',
            cmd: '/root/.cargo/bin/rustc xxx;./test'
        },
        'java8': {
            ext: 'java',
            cmd: 'javac xxx;java test'
        },
        'java11': {
            ext: 'java',
            cmd: '/usr/local/jdk-11.0.1/bin/javac xxx;/usr/local/jdk-11.0.1/bin/java test'
        },
        'c': {
            ext: 'c',
            cmd: 'gcc xxx;./a.out'
        },
        'cpp': {
            ext: 'cpp',
            cmd: 'g++ xxx;./a.out'
        },
        'cpp11': {
            ext: 'cpp',
            cmd: 'g++ -std=c++11 xxx;./a.out'
        },
        'r': {
            ext: 'r',
            cmd: 'R -f xxx --slave'
        },
        'golang': {
            ext: 'go',
            cmd: 'go xxx'
        },
        'nodejs': {
            ext: 'js',
            cmd: 'node xxx'
        },
        'php54': {
            ext: 'php',
            cmd: 'php xxx'
        },
        'php72': {
            ext: 'php',
            cmd: '/usr/local/php72/bin/php xxx'
        },
        'lisp': {
            ext: 'lisp',
            cmd: 'sbcl --script xxx'
        },
        'scala': {
            ext: 'scala',
            cmd: '/usr/local/scala-2.12.4/bin/scala  xxx'
        },
        'perl': {
            ext: 'pl',
            cmd: 'perl xxx'
        },
        'bash': {
            ext: 'sh',
            cmd: 'bash xxx'
        },
        'golang': {
            ext: 'go',
            cmd: 'go run xxx'
        },
        'ruby20': {
            ext: 'rb',
            cmd: 'ruby xxx'
        },
        'typescript': {
            ext: 'ts',
            cmd: 'tsc xxx;node test.js' // TODO
        },
        'csharp': {
            ext: 'cs',
            cmd: 'mcs xxx;mono test.exe' // TODO
        },
        'lua': {
            ext: 'lua',
            cmd: 'lua xxx'
        },
        'less': {
            ext: 'less',
            cmd: 'lessc xxx'
        },
        'sass': {
            ext: 'scss',
            cmd: 'sass xxx'
        },
        'stylus': {
            ext: 'styl',
            cmd: 'stylus xxx -p'
        },
    }
    if (langs[lang]) {
        runCode(langs[lang].ext, langs[lang].cmd)
    } else {
        res.json({
            result: 'lang 参数错误，请通知管理员修复。'
        })
    }
})

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Total, X-Total-Page, Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    next()
})

app.listen(8887, () => console.log('Example app listening on port 8887!'))