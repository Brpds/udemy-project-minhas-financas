class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar = d => {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        //array despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradsa em Lstorage
        for(let i = 1; i <= id; i++){
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //existem índices pulados/removidos?
            //checar e pular
            if(despesa === null){
                continue
            }

            //aqui é adicionado o atributo id ao objeto, fazendo com 
            //que cada registro seja identificável dentro da local storage
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = []

        despesasFiltradas = this.recuperarTodosRegistros()

        //console.log(despesasFiltradas)
        //console.log(despesa)

        //ano
        if(despesa.ano != ''){
            console.log('Fitro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != ''){
            console.log('Fitro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        console.log(despesasFiltradas)
        //dia
        if(despesa.dia != ''){
            console.log('Fitro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            console.log('Fitro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao

        if(despesa.descricao != ''){
            console.log('Fitro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != ''){
            console.log('Fitro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas


    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()


cadastrarDespesa = () => {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)
        document.getElementById('exampleModalLabel').innerHTML = 'Gravação feita com sucesso.'
        document.getElementById('exampleModalLabel').className = 'text-success'
        document.getElementById('modalText').innerHTML = 'Despesa adicionada'
        document.getElementById('validateDataButton').className = 'btn btn-success'
        document.getElementById('validateDataButton').innerHTML = 'Confirmar'
        $('#modalRegistrarDespesa').modal('show')
        limparCampos()
    }else{
        //diálogo de erro
        document.getElementById('exampleModalLabel').innerHTML = 'Erro de Gravação'
        document.getElementById('exampleModalLabel').className = 'text-danger'
        document.getElementById('modalText').innerHTML = 'Todos os campos devem ser preenchidos'
        document.getElementById('validateDataButton').className = 'btn btn-danger'
        document.getElementById('validateDataButton').innerHTML = 'Voltar e Corrigir'
        $('#modalRegistrarDespesa').modal('show')
    }
}

limparCampos = () =>{
    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('valor').value = ''
    /*
        ---otimizado:---
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''
    */
}


carregaListaDespesas = (despesas = [], filtro = false) => {
    
    //let despesas = Array()
    

    /*
        esse teste faz com que, caso a recuperação de despesas 
        não encontre o filtro, todos os registros serão retornados,
        ficando assim a lista completa na tela
    */
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

    //despesas = bd.recuperarTodosRegistros()
    //console.log(despesas)

    //selecionando o elemento Tbody
    let listaDespesas = document.getElementById('listaDespesas')
    //a linha abaixo elimina as linhas caso o filtro seja aplicado
    listaDespesas.innerHTML = ''
    /*
        <tr>
                <td>15/03/2018</td>
                <td>Alimentação</td>
                <td>Almoço</td>
                <td>200.00</td>
              </tr>
    */

    //percorrer o array despesa listando de forma dinâmica
    despesas.forEach(function(d) { 

        //console.log(d)

        //criando a linha
        let linha = listaDespesas.insertRow()

        //criando as colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustar o tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
            break
            case '2': d.tipo = 'Educação'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Saúde'
            break
            case '5': d.tipo = 'Transporte'
            break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão exclusão de despesa.
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        //aqui o botão recebe o id definido na função
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function removerDespesa (){
            //remove a despesa
            /*para remover a despesa, é necessário tratar o id
            para que o mesmo seja passado corretamente ao local
            storage.
            */

            let id = this.id.replace('id_despesa_','')

            bd.remover(id)

            window.location.reload()

        }
        linha.insertCell(4).append(btn)

    })
}


pesquisarDespesa = () => {
    let ano  = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    
    this.carregaListaDespesas(despesas, true)
}