const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

const auth = require('../helpers/auth').checkAuth

router.get('/', postController.showPosts)
router.get('/dashboard',auth, postController.dashboard)
router.get('/paginaCriarPost',auth, postController.paginaCriacao)
router.post('/criarPost',auth, postController.criarPost)
router.post('/excluirPost', auth, postController.excluirPost)
router.get('/paginaEditar/:id',auth, postController.paginaEditar)
router.post('/modificarPost', auth, postController.auterarPost)

module.exports = router;