const fs = require('fs')
const _ = require('lodash')

const __schema = process.argv[2].toLowerCase()
const __name = process.argv[3]
let __src = './src/main-module'
let __extendBase = false
let __entities
let __hasRecycleBin = false

process.argv.forEach(arg => {
    if (arg.startsWith('--src')) {
        __src = arg.split('=')[1]
    } else if (arg.startsWith('--extend-base')) {
        __extendBase = true
    } else if (arg.startsWith('--junction-model') || arg.startsWith('associative-entity')) {
        __entities = arg.split('=')[1].split(",")
    } else if (arg.startsWith('--has-recycle-bin')) {
        __hasRecycleBin = true
    }
})

if (__schema === 'all') {
    genEntity(__name)
    genService(__name)
    genController(__name)
} else if (__schema === 'entity') {
    genEntity(__name)
} else if (__schema === 'service') {
    genService(__name)
} else if (__schema === 'controller') {
    genController(__name)
}

function genEntity(name) {
    fs.mkdirSync(`${__src}/entity/${_.kebabCase(name)}`, { recursive: true })

    let __filePath = `${__src}/entity/${_.kebabCase(name)}/${_.kebabCase(name)}.entity.ts`
    let rs = fs.existsSync(__filePath)
    if (rs) {
        console.log(`err: file '${__filePath}' existed`)
        return
    }

    console.log(`=============== gen entity ===============`)
    let __templatePath = './src/common-module/.template/entity.temp'
    if (__extendBase) {
        __templatePath = './src/app/common/.template/entity-extend-base.temp'
    }
    let __content = fs.readFileSync(__templatePath)?.toString()
    __content = __content.replaceAll(/@@schema@@/g, __name)
    __content = __content.replaceAll(/@@tableName@@/g, `tbl_${_.snakeCase(name)}`)
    __content = __content.replaceAll(/@@hasRecycleBin@@/g, __hasRecycleBin)
    console.log(__content)
    fs.writeFileSync(__filePath, __content, { encoding: 'utf8', flag: 'w' })
}

function genController(name) {
    fs.mkdirSync(`${__src}/controller/${_.kebabCase(name)}`, { recursive: true })

    let __filePath = `${__src}/controller/${_.kebabCase(name)}/${_.kebabCase(name)}.controller.ts`
    let rs = fs.existsSync(__filePath)
    if (rs) {
        console.log(`err: file '${__filePath}' existed`)
        return
    }

    console.log(`=============== gen controller ===============`)
    let __content = fs.readFileSync('./src/common-module/.template/controller.temp')?.toString()
    __content = __content.replaceAll(/@@entity@@/g, __name)
    __content = __content.replaceAll(/@@entityKebabCase@@/g, _.kebabCase(name))
    // console.log(__content)
    fs.writeFileSync(__filePath, __content, { encoding: 'utf8', flag: 'w' })
}

function genService(name) {
    fs.mkdirSync(`${__src}/service/${_.kebabCase(name)}`, { recursive: true })

    let __filePath = `${__src}/service/${_.kebabCase(name)}/${_.kebabCase(name)}.service.ts`
    let rs = fs.existsSync(__filePath)
    if (rs) {
        console.log(`err: file '${__filePath}' existed`)
        return
    }

    console.log(`=============== gen service ===============`)
    let __content = fs.readFileSync('./src/common-module/.template/service.temp')?.toString()
    __content = __content.replaceAll(/@@entity@@/g, __name)
    __content = __content.replaceAll(/@@entityKebabCase@@/g, _.kebabCase(name))

    // console.log(__content)
    fs.writeFileSync(__filePath, __content, { encoding: 'utf8', flag: 'w' })
}