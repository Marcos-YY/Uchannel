const { DataTypes } = require('sequelize')
const db = require('../db/conexao')

const User = db.define('user',{
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = User;