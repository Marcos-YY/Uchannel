const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = class AutController{
    static paginaLogin(req,res){
        res.render('auth/login', { titulo:'Login' })
    }
    static async login(req,res){
        const {email, senha} = req.body
        //encontrar usuario
        const user = await User.findOne({where:{email:email}})
        if (!user) {
            req.flash('erro','Este email não está cadastrado')
            res.render('auth/login', { titulo:'Login' })
            return
        }
        //verificar senha
        const verificarSenha = bcrypt.compare(senha, user.senha)
        if (!verificarSenha) {
            req.flash('erro','Senha inválida, tente novamente')
            res.render('auth/login', { titulo:'Login' })
            return
        }
        //Se login e senha conferem inicie a sessão
        try {
        req.session.userid = user.id
        req.flash('aviso', 'Logado com sucesso')          
        req.session.save(()=>{
        res.redirect('/')
        })
        
        } catch (error) {
            console.log(error)
        }

    }
    static paginaCadastro(req,res){
        res.render('auth/cadastro', { titulo:'Cadastro' })
    }
    static async cadastrar(req,res){
        const {nome, email, password, confirmpassword} = req.body
//verificar se senhas combinam
    if (password != confirmpassword) {
        req.flash('aviso', 'As senhas não possuem o mesmo valor')
        res.render('auth/cadastro')
        return
    }
//verificar se email já está em uso
    const checkEmail = await User.findOne({where:{email:email}})
        if (checkEmail) {
        req.flash('aviso', 'Este Email já está em uso')
        res.render('auth/cadastro')
        return 
    }
    //cryptografar senha
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)
//modelando usuario resgatado
const user = {
    nome,
    senha: hashedPassword,
    email,
}

try {
    const createdUser = await User.create(user)
    //iniciando sessão
    req.session.userid = createdUser.id
    req.flash('aviso', 'Usuário cadastrado com sucesso!')
    //salvando sessão e redirecionando para home
    req.session.save(()=>{
    console.log('Sessao salva')
    res.redirect('/')
    })

} catch (err) {
    console.log(err)
}

    }
    static logout(req,res){
        req.session.destroy()
        res.redirect('/paginaLogin')
    }

}