/****************************************************
 * OBJETIVO: Arquivo responsavel pela manipulacao de dados no banco de dados MySQL, aqui realizamos o CRUD ultilizando a linguagem SQL
 * Data:01/02/2024
 * Autor: Letícia Melo
 * Versão: 1.0
 ****************************************************/
const { PrismaClient } = require('@prisma/client')//import da biblioteca do prisma/client
const prisma = new PrismaClient//instancia da classe prisma client

//funcao para inserir um novo filme no BD
const insertFilme = async function (dadosFilme) {
    let sql;
    try {
        if (dadosFilme.data_relancamento != '' && dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != undefined) {
            sql = `insert into tbl_filme (nome,sinopse,duracao,data_lancamento,data_relancamento,foto_capa,valor_unitario) 
            values(
                '${dadosFilme.nome}',
                '${dadosFilme.sinopse}',
                '${dadosFilme.duracao}',
                '${dadosFilme.data_lancamento}',
                '${dadosFilme.data_relancamento}',
                '${dadosFilme.foto_capa}',
                '${dadosFilme.valor_unitario}'
            )`
        }
        else {
            sql = `insert into tbl_filme (nome,sinopse,duracao,data_lancamento,data_relancamento,foto_capa,valor_unitario) 
                values(
                    '${dadosFilme.nome}',
                    '${dadosFilme.sinopse}',
                    '${dadosFilme.duracao}',
                    '${dadosFilme.data_lancamento}',
                    null,
                    '${dadosFilme.foto_capa}',
                    '${dadosFilme.valor_unitario}'
                )`
        }
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        return false
    }

}
//funcao para atualizar um filme no BD
const updateFilme = async function (id, dadoAtualizado) {
    let sql;

    try {
        if (dadoAtualizado.data_relancamento != '' && dadoAtualizado.data_relancamento != null && dadoAtualizado.data_relancamento != undefined) {
            sql = `UPDATE tbl_filme
                SET
                    nome = '${dadoAtualizado.nome}',
                    sinopse='${dadoAtualizado.sinopse}',
                    duracao='${dadoAtualizado.duracao}',
                    data_lancamento='${dadoAtualizado.data_lancamento}',
                    data_relancamento='${dadoAtualizado.data_relancamento}',
                    foto_capa='${dadoAtualizado.foto_capa}',
                    valor_unitario='${dadoAtualizado.valor_unitario}'
                WHERE
                    id = ${id}`
        }
        else {
            sql = `UPDATE tbl_filme
        SET
        nome = '${dadoAtualizado.nome}',
        sinopse='${dadoAtualizado.sinopse}',
        duracao='${dadoAtualizado.duracao}',
        data_lancamento='${dadoAtualizado.data_lancamento}',
        data_relancamento=null,
        foto_capa='${dadoAtualizado.foto_capa}',
        valor_unitario='${dadoAtualizado.valor_unitario}'
        WHERE
        id = ${id}`
        }
        let result = await prisma.$executeRawUnsafe(sql)
        if (result) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        return false
    }
}
//funcao para excluir um filme do BD
const deleteFilme = async function (id) {
    try {
        let sql = `delete from tbl_filme where id = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }
}
//funcao para listar todos os filmes do BD
const selectAllFilmes = async function () {
    try {
        let sql = 'select * from tbl_filme'
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        //da pra fzr desses dois tipos, de acordo c o marcel, o queryRawUnsafe é mlhr pra manutenção
        //$queryRawUnsafe(sql)
        //$queryRaw('select * from tbl_filme')
        return rsFilmes
    } catch (error) {
        return false
    }
}

const selectbyNameFilme = async function (nome) {
    try {
        let sql = `select * from tbl_filme where nome like'%${nome}%'`
        let rsFilme = await prisma.$queryRawUnsafe(sql)

        return rsFilme


    } catch (error) {
        return false

    }

}
//funcao para buscar um filme do BD pelo ID
const selectByIdFilme = async function (id) {
    try {
        let sql = `select * from tbl_filme where id=${id}`
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }
}

const getIDFilme = async function () {
    try {
        let sql_id = `select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1;`
        let rsFilme = await prisma.$queryRawUnsafe(sql_id)
        return rsFilme
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectbyNameFilme,
    selectByIdFilme,
    getIDFilme
}