const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, Type, Brand} = require('../models/models')
const db = require('../dbPool')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, ip, role} = req.body
        console.log('ip ' + ip)
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        let point = 1000
        const user = await User.create({email, point, role, password: hashPassword})

        await User.findOne({where: {email}}).then(record => {
            console.log('record.ip ' + record.ip)
            //console.log(record.ip.match(ip))
            let IpJson = {0 : ip}
            let values = {ip : JSON.stringify(IpJson)}
            record.update(values).then(updatedRecord => {
                // console.log(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
            })})
            .catch((error) => {
                throw new Error(error)
            })
        //######################## ADD DATA MEDAL ####################################
        let medalUsersFull = []
            medalUsersFull.push({
                username: email,
                gold: 0,
                silver: 0,
                bronze: 0,
                platinum: 0
            })
        const userAllTypeField = await User.findOne({ attributes: {exclude: ['id', 'ip', 'email', 'point', 'password', 'role','createdAt', 'updatedAt']}})
        for (let k = 0; k < Object.keys(userAllTypeField.dataValues).length; k++) {
                await User.findOne({where: {email: email}}).then(record => {
                    record.update({[Object.keys(userAllTypeField.dataValues)[k]]: JSON.stringify(medalUsersFull[0])}).then(updatedRecord => {
                        console.log(`updated record ${JSON.stringify(updatedRecord, null, 2)}`)
                    })})
        }
        //################ END DATA MEDAL #######################
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {

        const {email, password, ip} = req.body
        console.log('ip ' + ip)

        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }

        await User.findOne({where: {email}}).then(record => {
            console.log('record.ip ' + record.ip)
            //console.log(record.ip.match(ip))
            let IpJson
            console.log('record.ip.match(ip) ' + record.ip.match(ip))
            if(record.ip.match(ip) === null){
                console.log('record.ip ' + record.ip)
                IpJson = JSON.parse(record.ip)
                console.log('IpJson 1 ' + IpJson)
                IpJson[Object.keys(IpJson).length]=ip
            }
            let values = {ip : JSON.stringify(IpJson)}
            record.update(values).then(updatedRecord => {
                // console.log(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
            })})
        .catch((error) => {
            throw new Error(error)
        })

        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)

        // const userAll = await User.findOne({
        //     where: {
        //         id : req.user.id
        //     }})

        // const user = {
        //     point : userAll.point
        // }


        //const user = await db.query('SELECT * FROM users WHERE req.user.id = $1', [id])

        //console.log(user)
        // console.log({
        //     token : token,
        //     user : user
        // })
        //return res.json({token, user})
        return res.json({token})
    }


    async getUsers(req, res) {


        const userAll = await User.findAll({
            attributes: {exclude: ['id', 'ip', 'email', 'point', 'password', 'role','createdAt', 'updatedAt']}
        })

        //console.log('11111111 ' + userAll)
        return res.json(userAll)
    }
}

module.exports = new UserController()
