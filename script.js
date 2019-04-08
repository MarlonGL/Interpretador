const input = document.querySelector('input[type="file"]');
var lines;
var arqPronto = false;
var programCounter = 0;
var atual;
var leituraVariaveis = false;
var variaveis = [];
var data = [];
var teste = ".data";

input.addEventListener('change', function(){
    //console.log(input.files);
    const reader = new FileReader();
    reader.onload = function(){
        lines = reader.result.split('\n');
        //.map(function(line){
           // return line.split(' ');
        //})
        console.log(lines);
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
        console.log(leituraVariaveis);
    }
    
}

function read()
{
    var terminou = false;
    while(terminou === false)
    {
        atual = lines[programCounter];
        console.log(typeof atual);
        //console.log(atual);
        check();
        while(leituraVariaveis === true)
        {  
            programCounter++;
            atual = lines[programCounter];
            if(!atual.includes(".enddata"))
            {
                //var nome = atual.split(fimv);
                var teste = atual.split(' ');
                //console.log(teste);
                var n = getBetween(teste[0], "", ":");
                var pos = getBetween(teste[2], "#", ",");
                var v = teste[3].slice(1);
                //console.log(n);
                data.push({nome:n,posM:pos, valor:v});

                /*var posm = teste[2].substr(0,3);
                console.log(posm);*/
                //console.log(WordInBetween(atual,"", ":"));
                //console.log(WordInBetween(atual, "DB", ","));
                variaveis.push(atual);
                //console.log(atual);
            }
            else
            {
                leituraVariaveis = false;
            }
                
        }
        terminou = true;
        //console.log(variaveis);
        console.log(data);

    }
}

function data(varia){
    for(var i; i< variaveis.length; i++)
    {
        //var varia = {'nome':variaveis[i], 'posMemo':0, 'valor':}
    }

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

function WordInBetween(sentence, wordOne, wordTwo)
        {

            var start = sentence.indexOf(wordOne) + wordOne.length + 1;

            var end = sentence.indexOf(wordTwo) - start - 1;

            return sentence.substring(start, end);


        }
