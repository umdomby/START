const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const myDeviceRouter = require('./myDeviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const typeBrandRouter = require('./typeBrandRouter')
const medalRouter = require('./medalRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/typebrand', typeBrandRouter)
router.use('/devicemy', myDeviceRouter)
router.use('/medal', medalRouter)

module.exports = router
