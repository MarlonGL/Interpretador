const input = document.querySelector('input[type="file"]');
var docLines;
var readerDone = false;
var readingCounter = 0;
var currentLine;
var variableReading = false;
var methodReading = false;
var variables = [];
var rotules = [];
var codeLines = [];
var halt = false;
var accumulator;

input.addEventListener('change', function () {
    //console.log(input.files);
    const reader = new FileReader();
    reader.onload = function () {
        docLines = reader.result.split('\n');
        //.map(function(line){
        // return line.split(' ');
        //})
        //console.log(lines);
        readerDone = true;
    }
    reader.readAsText(input.files[0]);

})

function CheckCurrentLine() {

    if (currentLine.includes(".data")) {
        variableReading = true;
        //console.log(variableReading);
    }
    if (currentLine.includes(".code")) {
        methodReading = true;
        //console.log(methodReading);
    }
}

function ReadVariables() {
    while (variableReading === true) {
        readingCounter++;
        currentLine = docLines[readingCounter];
        if (!currentLine.includes(".enddata")) {

            var __stringSplit = currentLine.split(' ');
            var __name = GetBetween(__stringSplit[0], "", ":");
            var __pos = GetBetween(__stringSplit[2], "#", ",");

            if (__pos == null) {
                console.log("ERRO NA LEITURA, CHEQUE AS POSICOES DE MEMORIA");
                variableReading = false;
                halt = true;
            }
            var __value = __stringSplit[3].slice(1);
            variables.push({ name: __name, posM: __pos, value: __value });
        }
        else {
            variableReading = false;
            readingCounter++;
        }

    }
}

function ReadCode() {
    while (methodReading === true) {
        readingCounter++;
        currentLine = docLines[readingCounter];
        if (!currentLine.includes(".endcode")) {
            if (currentLine.search(":") !== -1) {

                var __name = GetBetween(currentLine, "", ":");
                var __stringSplit = currentLine.split(' ');

                rotules.push({ name: __name, posM: readingCounter });

                if (__stringSplit.length > 2) {
                    codeLines.push({ command: __stringSplit[1], variable: __stringSplit[2] });
                } else {
                    codeLines.push({ command: __stringSplit[1], variable: null });
                }
            } else {
                var __stringSplit = currentLine.split(' ');
                if (__stringSplit.length > 1) {
                    codeLines.push({ command: __stringSplit[0], variable: __stringSplit[1] });
                } else {
                    codeLines.push({ command: __stringSplit[0], variable: null });
                }
            }
        }
        else {
            methodReading = false;
            halt = true;
        }
    }

}
function read() {
    var __finished = false;
    while (__finished === false) {
        currentLine = docLines[readingCounter];
        CheckCurrentLine();
        if (variableReading === true) {
            ReadVariables();
        }
        if (methodReading === true) {
            ReadCode();
        }
        if (halt) {
            __finished = true;
            console.log("Variables:");
            console.log(variables);
            console.log("Rotules:");
            console.log(rotules);
            console.log("Code Lines:");
            console.log(codeLines);
            run();
        }
    }
}

function run() {
    var __running = true;
    var __programCounter = 0;
    var __command;
    var __var;
    while (__running) {
        __command = codeLines[__programCounter].command;
        __var = codeLines[__programCounter].variable;
        switch (__command) {
            case "LD":
                Load(__var);
                break;
            case "ST":
                ST(__var);
                break;
            case "SUB":
                Sub(__var);
                break;
            case "ADD":
                Add(__var);
                break;
            case "HALT":
                Halt();
                break;
            default:
            // code block
        }
        __programCounter++;
        if (__programCounter == codeLines.length) {
            __running = false;
        }
    }

}
function CheckMethod(p_var) {

}
function GetBetween(p_strSource, p_strStart, p_strEnd) {
    var __start, __end;
    if (p_strSource.includes(p_strStart) && p_strSource.includes(p_strEnd)) {
        __start = p_strSource.indexOf(p_strStart, 0) + p_strStart.length;
        __end = p_strSource.indexOf(p_strEnd, __start);
        return p_strSource.substr(__start, __end - __start);
    }
    else {
        return "";
    }
}

function Load(p_var) {
    //console.log(com, ' ', vari);
    var __currentVar;
    if (p_var !== null) {
        if (p_var.includes("#")) {
            console.log(p_var);
        }
        else {
            //console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                if (p_var.includes(variables[i].name)) {
                    __currentVar = variables[i];
                    console.log(__currentVar);
                    break;
                }
            }
        }
    }
}

function ST(p_var) {
    console.log("SET");
    if (p_var !== null) {
        if (p_var.includes("#")) {
            console.log(p_var);
        }
    }

}

function Sub(p_var) {
    console.log("SUB");
    if (p_var !== null) {
        if (p_var.includes("#")) {
            console.log(p_var);
        }
    }

}

function Add(p_var) {
    console.log("ADD");
    if (p_var !== null) {
        if (p_var.includes("#")) {
            console.log(p_var);
        }
    }
}

function Halt() {
    halt = true;
}