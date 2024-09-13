const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkEmail = require('../middleware/emailMiddleware')

router.post('/', deviceController.create)
router.post('/update/timestate', checkEmail.emailDatabaseEditDevices, deviceController.updateTimestate)
router.post('/update/file', checkEmail.emailDatabaseEditDevices, deviceController.updateFile)
router.post('/update/linkvideo', checkEmail.emailDatabaseEditDevices, deviceController.updateLinkVideo)
router.post('/delete', checkEmail.emailDatabaseEditDevices, deviceController.delete)

router.get('/username', deviceController.getDevicesUsername)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)



module.exports = router
