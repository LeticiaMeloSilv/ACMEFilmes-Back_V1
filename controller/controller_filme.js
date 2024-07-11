/****************************************************
 * OBJETIVO: Arquivo responsavel pelas validacoes e consistencias de dados de filmes
 * Data:01/02/2024
 * Autor: Letícia Melo
 * Versão: 1.0
 ****************************************************/

const filmesDAO = require('../model/DAO/filme.js')//import do arquivo responsavel pela interacao com o BD(model)
const message = require('../modulo/config.js')//import do arquivo de configuracao do projeto

//funcao para inserir um novo filme
const setInserirNovoFilme = async function (dadosFilme, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novoFilmeJSON = {}

            if (dadosFilme.nome == '' || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
                dadosFilme.sinopse == '' || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
                dadosFilme.duracao == '' || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
                dadosFilme.data_lancamento == '' || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                dadosFilme.foto_capa == '' || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa > 200 ||
                dadosFilme.valor_unitario.length > 6
            ) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let validateStatus = false
                if (dadosFilme.data_relancamento != null &&
                    dadosFilme.data_relancamento != '' &&
                    dadosFilme.data_relancamento != undefined) {
                    if (dadosFilme.data_relancamento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS//400
                    }
                    else {
                        validateStatus = true
                    }
                }
                else {
                    validateStatus = true
                }
                if (validateStatus) {
                    let novoFilme = await filmesDAO.insertFilme(dadosFilme)

                    if (novoFilme) {
                        let ultimoID = await filmesDAO.getIDFilme()
                        dadosFilme.id = Number(ultimoID[0].id)

                        novoFilmeJSON.filme = dadosFilme
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status//201
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code//201
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message//201                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        return novoFilmeJSON
                    }
                    else {
                        return message.ERROR_INTERNAL_SERVER_DB//500
                    }
                }
            }
        }
        else {
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500-erro na controller
    }
    
}
//funcao para atualizar um filme
const setAtualizarFilme = async function (id, dadoAtualizado, contentType) {
    if (String(contentType).toLowerCase() == 'application/json') {
        let atualizarFilmeJSON = {}
        let dadosFilmes = await filmesDAO.selectAllFilmes()
        let validateStatus = false
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else if (id>dadosFilmes.length==0) {
            return message.ERROR_NOT_FOUND//404
        }
        else {
            if (dadoAtualizado.nome == '' || dadoAtualizado.nome == undefined || dadoAtualizado.nome == null || dadoAtualizado.nome.length > 80 ||
                dadoAtualizado.sinopse == '' || dadoAtualizado.sinopse == undefined || dadoAtualizado.sinopse == null || dadoAtualizado.sinopse.length > 65000 ||
                dadoAtualizado.duracao == '' || dadoAtualizado.duracao == undefined || dadoAtualizado.duracao == null || dadoAtualizado.duracao.length > 8 ||
                dadoAtualizado.data_lancamento == '' || dadoAtualizado.data_lancamento == undefined || dadoAtualizado.data_lancamento == null || dadoAtualizado.data_lancamento.length != 10 ||
                dadoAtualizado.foto_capa == '' || dadoAtualizado.foto_capa == undefined || dadoAtualizado.foto_capa == null || dadoAtualizado.foto_capa > 200 ||
                dadoAtualizado.valor_unitario.length > 6
            ) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                if (dadoAtualizado.data_relancamento != null &&
                    dadoAtualizado.data_relancamento != '' &&
                    dadoAtualizado.data_relancamento != undefined) {
                    if (dadoAtualizado.data_relancamento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS//400
                    }
                    else {
                        validateStatus = true
                    }
                }
                else {
                    validateStatus = true
                }
            }
            if (validateStatus) {
                let novoFilme = await filmesDAO.updateFilme(id,dadoAtualizado)
                if (novoFilme) {
                    atualizarFilmeJSON.filme = dadoAtualizado
                    atualizarFilmeJSON.status = message.SUCCESS_UPDATED_ITEM.status//200
                    atualizarFilmeJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code//200
                    atualizarFilmeJSON.message = message.SUCCESS_UPDATED_ITEM.message//200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    return atualizarFilmeJSON
                }
                else{
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
            else{
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
    else{
        return message.ERROR_CONTENT_TYPE
    }
}
//funcao para excluir um filme
const setExcluirFilme = async function (id) {
    try {
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else {
            let idFilme = await filmesDAO.deleteFilme(id)
            if (idFilme) {
                return message.SUCCESS_DELETED_ITEM//200
            }
            else {
                return message.ERROR_NOT_FOUND//404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }
}

//funcao para retornar todos os filmes
const getListarFilmes = async function () {
    let filmesJSON = {}

    let dadosFilmes = await filmesDAO.selectAllFilmes()

    if (dadosFilmes) {
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.length
        filmesJSON.status_code = 200
        return filmesJSON
    }
    else {
        return false
    }
}
const getNomeFilme = async function (nome) {
    let nomeFilme = nome
    let filmeJSON = {}

    if (nomeFilme == '' || nomeFilme == undefined) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosFilme = await filmesDAO.selectbyNameFilme(nomeFilme)
        if (dadosFilme) {
            if (dadosFilme.length > 0) {
                filmeJSON.filme = dadosFilme
                filmeJSON.quantidade = dadosFilme.length
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//funcao para buscar filme
const getBuscarFilme = async function (id) {
    let idFilme = id
    let filmeJSON = {}

    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosFilme = await filmesDAO.selectByIdFilme(id)
        if (dadosFilme) {
            if (dadosFilme.length > 0) {
                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}

module.exports = {
    setAtualizarFilme,
    setExcluirFilme,
    setInserirNovoFilme,
    getBuscarFilme,
    getNomeFilme,
    getListarFilmes
}