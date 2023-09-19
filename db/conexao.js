const { Sequelize } = require('sequelize')

const db = new Sequelize('uchannel','root','',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    db.authenticate()
    console.log('conectado')
} catch (err) {
   console.log(err) 
}

module.exports = db;