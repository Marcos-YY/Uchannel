// PostController.js
const Post = require('../models/post');
const User = require('../models/user');
const { Op } = require('sequelize')

module.exports = class PostController {
  static async showPosts(req, res) {
    let busca = ''
    if (req.query.busca) {
      busca = req.query.busca
    }
    let ordem = 'DESC'
    if (req.query.ordem === 'maisAntigo') {
      ordem = 'ASC'
    } else {
      ordem = 'DESC'
    }

    const PostData = await Post.findAll({
      include:User,
      where: {conteudo:{[Op.like]: `%${busca}%`}},
      order: [['createdAt',ordem]]
    })
    const PostResgatado = PostData.map((resultado)=>resultado.get({plain:true}))
    let postsQtdd = PostResgatado.length

    if (postsQtdd===0) {
      postsQtdd = false
    }
    res.render('posts/home', { titulo: 'Home',PostResgatado, busca,postsQtdd});
  }

  static async dashboard(req, res) {

    const userId = req.session.userid;
  
    const user = await User.findOne({ where: { id: userId }, include: Post, plain: true });
    console.log('Usuário encontrado:', user);
  
    if (!user) {
      res.redirect('/paginaLogin');
    }
    //resgatando datavalues
    const PostsResgatados = user.posts.map((result)=> result.dataValues)
    //verificando se há algum post para dashboard
    let postsVazio = false
    if (PostsResgatados.length === 0) {
      postsVazio = true
    }

    res.render('posts/dashboard', { titulo: 'Dashboard', PostsResgatados, postsVazio});

  }

  static paginaCriacao(req,res){
    res.render('posts/criar', {titulo: 'Criar post'})
  }

  static async paginaEditar(req,res){
    const id = req.params.id
    const PostResgatado =  await Post.findOne({where:{id:id},raw:true})
    res.render('posts/editar', { titulo: 'Alterar postagem', PostResgatado });
  }

  static async auterarPost(req,res){
    const id = req.body.id
    const novoPost = {
      conteudo:req.body.conteudo
    }
    try {
      await Post.update(novoPost,{where:{id:id}})
      req.flash('aviso','Publicação alterada com sucesso')
      req.session.save(()=>{
        res.redirect('/dashboard')
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async excluirPost(req,res){
    const id = req.body.id
    const user = req.session.userid
    
    try {
      await Post.destroy({where: {id:id, userId:user}})
      req.flash('erro', 'Post excluído com sucesso ')
      req.session.save(()=>{
        res.redirect('/dashboard')
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async criarPost(req,res){
    const PostResgatado = {
      conteudo: req.body.conteudo,
      userId: req.session.userid
    }
    // Encontre o usuário correspondente ao userId na sessão
    const user = await User.findOne({ where: { id: PostResgatado.userId } })
    
    if (!user) {
        req.flash('erro', 'Ops, ocorreu um erro')      
        res.redirect('/paginaLogin')
        req.session.destroy()
        return;
    }
    try {
      await Post.create(PostResgatado);
      req.flash('aviso', 'Post publicado com sucesso!')
      req.session.save(()=>{
        res.redirect('/dashboard')
      })
    } catch (error) {
      console.log(error)
    }
  }
};
