const express = require('express')
const router = express.Router()
const autController = require('../controllers/autController')

router.get('/paginaLogin', autController.paginaLogin)
router.post('/login', autController.login)
router.get('/paginaCadastrar', autController.paginaCadastro)
router.post('/cadastrar', autController.cadastrar)
router.get('/logout', autController.logout)

module.exports = router;