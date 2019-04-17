const input = document.querySelector('input[type="file"]');
var lines;
var arqPronto = false;
var programCounter = 0;
var atual;
var leituraVariaveis = false;
var leituraMetodos = false;
var variaveis = [];
var data = [];
var metodos = [];
var linhas = [];
var teste = ".data";
var halt = false;

var ac;
var n;
var z;

input.addEventListener('change', function(){
    //console.log(input.files);
    const reader = new FileReader();
    reader.onload = function(){
        lines = reader.result.split('\n');
        //.map(function(line){
           // return line.split(' ');
        //})
        //console.log(lines);
        arqPronto = true;
    }
    reader.readAsText(input.files[0]);

})

function check(){
    //atual = ".data";
    //console.log(atual);
    if(atual.includes(".data"))
    {
        leituraVariaveis = true;
        //console.log(leituraVariaveis);
    }
    if(atual.includes(".code"))
    {
        leituraMetodos = true;
        //console.log(leituraMetodos);
    }
}

function leituraDeVariaveis(){
    while(leituraVariaveis === true){  
        programCounter++;
        atual = lines[programCounter];
        if(!atual.includes(".enddata")){
            //var nome = atual.split(fimv);
            var teste = atual.split(' ');
            var n = getBetween(teste[0], "", ":");
            var pos = getBetween(teste[2], "#", ",");
            if(pos == null){
                console.log("ERRO NA LEITURA, CHEQUE AS POSICOES DE MEMORIA");
                leituraDeVariaveis = false;
                halt = true;
            }
            var v = teste[3].slice(1);
            //console.log(n);
            data.push({nome:n,posM:pos, valor:v});
            /*var posm = teste[2].substr(0,3);
            console.log(posm);*/
            //variaveis.push(atual);
        }
        else
        {
            leituraVariaveis = false;
            programCounter++;
        }
            
    }
}

function leituraCode(){
    while(leituraMetodos === true){
        programCounter++;
        atual = lines[programCounter];
        if(!atual.includes(".endcode")){
            if(atual.search(":")!== -1){
                var n = getBetween(atual ,"", ":");
                var teste = atual.split(' ');
                metodos.push({nome:n, posM:programCounter});
                var met = getBetween(atual ,": ", " ");
                //var s = atual.split(/(?<=^\S+)\s/);
                if(teste.length > 2){
                    linhas.push({comando:teste[1], variavel:teste[2]});
                }else{
                    linhas.push({comando:teste[1], variavel:null});
                }

                //console.log(met);
            }else{
                var teste = atual.split(' ');
                if(teste.length > 1){
                    linhas.push({comando:teste[0], variavel:teste[1]});
                }else{
                    linhas.push({comando:teste[0], variavel:null});
                }
            }
        }
        else{
            leituraMetodos = false;
            //programCounter++;
            halt = true;
        }
    }
    
}
function read(){
    var terminou = false;
    while(terminou === false){
        atual = lines[programCounter];
        //console.log(typeof atual);
        //console.log(atual);
        check();
        if(leituraVariaveis === true){
            leituraDeVariaveis();
        }
        if(leituraMetodos === true){
            leituraCode();
        }
        if(halt){
            terminou = true;
            console.log(data);
            console.log(metodos);
            console.log(linhas);
            run();
        }
        

    }
}

function run(){
    var rodando = true;
    var l = 0;
    var com;
    var vari;
    var objVar;
    while(rodando){
        com = linhas[l].comando;
        vari = linhas[l].variavel;
        //console.log(com, ' ', vari);
        if(vari !== null){
            //console.log('passou do null');
            for(var i=0;i<data.length;i++){
                //console.log(data[i].nome);
                if(vari.includes(data[i].nome)){
                    objVar = data[i];
                    //console.log(objVar);
                    break;
                }
            }
        }
        switch(com) {
            case "LD":
              ld(objVar.nome);
              break;
            case "ST":
              // code block
              break;
            case "SUB":
              // code block
              break;
            case "ADD":
              // code block
              break;
            case "HALT":
              // code block
              break;
            default:
              // code block
          }
        l++;
        if(l==linhas.length){
            rodando = false;
        }
    }
    
    
    //checkMetodo(com);
    //console.log(vari);

}
function checkMetodo(n){
    
}
function getBetween(strSource, strStart, strEnd)
{
    var Start, End;
    if (strSource.includes(strStart) && strSource.includes(strEnd))
    {
        Start = strSource.indexOf(strStart, 0) + strStart.length;
        End = strSource.indexOf(strEnd, Start);
        return strSource.substr(Start, End - Start);
    }
    else
    {
        return "";
    }
}

function ld(v){
    console.log(v);
}
function st(v){

}
function sub(v){

}
function add(v){

}
function halt(){

}