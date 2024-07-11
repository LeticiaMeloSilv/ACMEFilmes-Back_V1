/*
 * Para realizar a integracao com o banco de dados, devemos ultilizar uma das seguintes bibliotecas
 *      -SEQUELIZE--biblioteca mais antiga
 *      -PRISMA ORM--biblioteca mais atual(ultilizaremos no projeto)
 *      -FASTFY ORM--biblioteca mais atual
 * 
 * 
 *  para instalacao do prisma:
 * npm install prisma --save (responsavel pela conexao com o BD)
 * npm install @prisma/client --save (responsavel por executar scripts SQL no banco)
 * npx prisma init (responsavel por inicializar o prisma)
 * npx prisma migrate dev
 * 
 * npm i
 * npx prisma generate
 * 
 * select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1;
 */


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    app.use(cors())

    next()
})
/**************************************************************Import dos aquivos de controller do projeto**************************************************************/

const controleDados = require('./controller/funcoes')
const controllerFilmes = require('./controller/controller_filme.js')

/*******************************************************************************ENDPOINTS*******************************************************************************/
//Criacao de um objeto para controlar a chegada de dados da requisicao em formato json
const bodyParserJSON = bodyParser.json()


//endPoint: Retorna todos os filmes cadastrados
app.get('/V1/ACMEFilmes/filmes', cors(), async function (request, response) {
    let listaFilmes = controleDados.getListaFilmes();

    if (listaFilmes) {
        response.json(listaFilmes)
        response.status(200)
    }
    else {
        response.status(404);
    }
})//Periodo de utilização 01/2024-02/2024
app.get('/V2/ACMEFilmes/filmes', cors(), async function (request, response) {
    let dadosFilmes = await controllerFilmes.getListarFilmes()

    response.json(dadosFilmes)
    response.status(200)

})//Ativo

//Retorna dados do flme filtrando pelo nome
app.get('/V2/ACMEFilmes/filmes/filtro', cors(), async function (request, response) {
    let nome = request.query.nome
    let dadosFilme = await controllerFilmes.getNomeFilme(nome)

    response.json(dadosFilme)
    response.status(200)
})

//Retorna dados do filme filtrando pelo id
app.get('/V1/ACMEFilmes/filme/1/:id', cors(), async function (request, response) {
    let id = request.params.id
    let filme = controleDados.getFilmeId(id)
    if (filme) {
        response.json(filme)
        response.status(200)

    }
    else {
        response.status(404);
        response.json({ erro: 'Item não encontrado' })
    }
})//Periodo de utilizacao 01/2024-02/2024
app.get('/V2/ACMEFilmes/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})//Ativo

//Manda pro DB dados de um novo filme
app.post('/V2/ACMEFilmes/filme', cors(), bodyParserJSON, async function (request, response) {

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody,contentType)

    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})
app.delete('/V2/ACMEFilmes/filme/:id', cors(), async function (request,response) {
    let idFilme = request.params.id

    let resultDados = await controllerFilmes.setExcluirFilme(idFilme)

    response.status(resultDados.status_code)
    response.json(resultDados)
})

app.put('/V2/ACMEFilmes/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    let idFilme = request.params.id

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoFilme = await controllerFilmes.setAtualizarFilme(idFilme,dadosBody,contentType)

    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})

/***********************************************************************************************************************************************************************/

app.listen('8080', function () {
    console.log('API funcionando!!!! Bom trabalho, dá uma descançada, um cafezinho nunca cai mal!!')
})

