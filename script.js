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
var stopReading = false;
var halt = false;
var accumulator;
var accumulator2;
var accumulator3;
var programCounter = 0;
var posMCodeStart = 0;
var running = false;


//Canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var height = 500, width = 500;
var x = 0, y = 0;

var xLine = 5, yLine = 40;
var lineSize = 20;

var canvasLog = document.getElementById("canvasLog");
var ctx1 = canvasLog.getContext("2d");
var height1 = 500, width1 = 500;
var x1 = 0, y1 = 0;

var xLine1 = 5, yLine1 = 40;
var lineSize1 = 20;




CLR(false);

input.addEventListener('change', function () {
    ////console.log(input.files);
    reset();
    const reader = new FileReader();
    reader.onload = function () {
        docLines = reader.result.split('\n');
        //.map(function(line){
        // return line.split(' ');
        //})
        ////console.log(lines);
        readerDone = true;
    }
    reader.readAsText(input.files[0]);

})
function CheckCurrentLine() {

    if (currentLine.includes(".data")) {
        variableReading = true;
        ////console.log(variableReading);
    }
    if (currentLine.includes(".code")) {
        methodReading = true;
        posMCodeStart = readingCounter + 1;
        ////console.log(methodReading);
    }
}
function ReadVariables() {
    while (variableReading === true) {
        readingCounter++;
        currentLine = docLines[readingCounter];
        if (!currentLine.includes(".enddata")) {

            var __stringSplit = currentLine.split(' ');
            var __name = GetBetween(__stringSplit[0], "", ":");
            var __pos = parseFloat(GetBetween(__stringSplit[2], "#", ","), 10);

            if (__pos == null) {
                console.log("ERRO NA LEITURA, CHEQUE AS POSICOES DE MEMORIA");
                variableReading = false;
                stopReading = true;
            }
            var __value = parseFloat(__stringSplit[3].slice(1), 10);
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

                rotules.push({ name: __name, posM: (readingCounter - posMCodeStart) });

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
            stopReading = true;
        }
    }

}
function Read() {
    var __finished = false;
    currentLine = null;
    readingCounter = 0;
    while (__finished === false) {
        currentLine = docLines[readingCounter];
        CheckCurrentLine();
        if (variableReading === true) {
            ReadVariables();
        }
        if (methodReading === true) {
            ReadCode();
        }
        if (stopReading) {
            __finished = true;
            console.log("Variables:");
            console.log(variables);
            console.log("Rotules:");
            console.log(rotules);
            console.log("Code Lines:");
            console.log(codeLines);
            Run();
        }
    }
}
function Step() {
    //CLR(false);
    CLRlog();
    Run();
    printStep("PC: " + programCounter + " | AC: " + accumulator + " | AC2: " + accumulator2 + " | AC3: " + accumulator3);
    for (var i = 0; i < variables.length; i++) {
        printStep(variables[i].name + ": " + variables[i].value);
    }
}
function DoAll() {
    //CLR(false);
    running = true;
    while (running) {
        Run();
    }
    printStep("PC: " + programCounter + " | AC: " + accumulator + " | AC2: " + accumulator2 + " | AC3: " + accumulator3);
    for (var i = 0; i < variables.length; i++) {
        printStep(variables[i].name + ": " + variables[i].value);
    }
}
function Run() {
    var __command;
    var __var;
    __command = codeLines[programCounter].command;
    //console.log(__command + ' PC ' + programCounter);

    if (__command.includes("HALT")) {
        Halt();
        running = false;
    }
    if (__command.includes("POS")) {
        POS();
    }
    if (__command.includes("PXL")) {
        PXL();
    }
    if (__command.includes("CLR")) {
        CLR(true);
    }

    __var = codeLines[programCounter].variable;
    //console.log(escape(__var));

    if (escape(__var).includes("%0D")) {
        var tempValue = __var.search("%0D");
        __var = __var.slice(0, tempValue);
        //console.log("Includes and sliced Name: " + __var);
        // console.log(escape(__var));
    }
    if (__command.includes("RND")) {
        RND(__var);
    }
    if (__command.includes("PRT")) {
        print(__var);
    }
    if (__command.includes("COS")) {
        COS(__var);
    }
    if (__command.includes("SIN")) {
        SEN(__var);
    }
    if (__command.includes("ADDF")) {
        ADDF(__var);
    }
    if (__command === "IN") {
        IN(__var);
    }
    switch (__command) {
        case "LD":
            Load(__var);
            break;
        case "LD2":
            Load2(__var);
            break;
        case "LD3":
            Load3(__var);
            break;
        case "ST":
            ST(__var);
            break;
        case "ST2":
            ST(__var);
            break;
        case "ST3":
            ST(__var);
            break;
        case "SUB":
            Sub(__var);
            break;
        case "ADD":
            Add(__var);
            break;
        case "JZ":
            JZ(__var);
            break;
        case "JNZ":
            JNZ(__var);
            break;
        case "JMP":
            Jump(__var);
            break;
        case "JN":
            JN(__var);
            break;
        case "JP":
            JP(__var);
            break;
        default:
    }
    if (programCounter == codeLines.length) {
        //console.log("Running = false");
        running = false;
    }
}
function CheckMethod(p_var) { }
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
    var __currentVar;
    if (p_var !== null) {
        if (p_var.includes("#")) {
            //console.log(p_var);
        }
        else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {

                //console.log()
                if (p_var === variables[i].name) {
                    __currentVar = variables[i];
                    //console.log("Variable found on Load command call");
                    //console.log(__currentVar);
                    accumulator = __currentVar.value;
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function Load2(p_var) {
    var __currentVar;
    if (p_var !== null) {
        if (p_var.includes("#")) {
            //console.log(p_var);
        }
        else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    __currentVar = variables[i];
                    //console.log("Variable found on Load command call");
                    //console.log(__currentVar);
                    accumulator2 = __currentVar.value;
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function Load3(p_var) {
    var __currentVar;
    if (p_var !== null) {
        if (p_var.includes("#")) {

            //console.log(p_var);
        }
        else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    __currentVar = variables[i];
                    //console.log("Variable found on Load command call");
                    //console.log(__currentVar);
                    accumulator3 = __currentVar.value;
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function ST(p_var) {
    if (p_var !== null) {
        if (p_var.includes("#")) {
            //console.log(p_var);
        } else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    variables[i].value = accumulator;
                    //console.log("Variable found on Set command call");
                    //console.log(variables[i]);
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function ST2(p_var) {
    if (p_var !== null) {
        if (p_var.includes("#")) {
            //console.log(p_var);
        } else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    variables[i].value = accumulator2;
                    //console.log("Variable found on Set command call");
                    //console.log(variables[i]);
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function ST3(p_var) {
    if (p_var !== null) {
        if (p_var.includes("#")) {
            //console.log(p_var);
        } else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    variables[i].value = accumulator3;
                    //console.log("Variable found on Set command call");
                    //console.log(variables[i]);
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function Sub(p_var) {
    if (p_var !== null) {
        if (p_var.includes("#")) {
            var __stringSplit = p_var.substr(1, p_var.length);
            var numSliced = parseFloat(__stringSplit, 10);
            accumulator -= numSliced;
            //console.log("AC:" + accumulator);
        } else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    accumulator -= variables[i].value;
                    //console.log("AC:" + accumulator);
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);

}
function Add(p_var) {
    if (p_var !== null) {
        if (p_var.includes("#")) {
            var __stringSplit = p_var.substr(1, p_var.length);
            var numSliced = parseFloat(__stringSplit, 10);
            accumulator += numSliced;
            //console.log("AC:" + accumulator);
        } else {
            ////console.log('passou do null');
            for (var i = 0; i < variables.length; i++) {
                //if (p_var.includes(variables[i].name)) {
                if (p_var === variables[i].name) {
                    accumulator += variables[i].value;
                    //console.log("AC:" + accumulator);
                    break;
                }
            }
        }
    }
    programCounter++;
    //console.log("PC: " + programCounter);
}
function JZ(p_var) {
    if (accumulator == 0) {
        if (p_var.includes("#")) {
            var __stringSplit = p_var.substr(1, p_var.length);
            var numSliced = parseFloat(__stringSplit, 10);
            programCounter = numSliced;
            //console.log("PC on JZ receives: " + programCounter);
        }
        else {
            for (var i = 0; i < rotules.length; i++) {
                //if (p_var.includes(rotules[i].name)) {
                if (p_var === rotules[i].name) {
                    programCounter = rotules[i].posM;
                    //console.log("PC on JZ with VAR receives: " + programCounter);
                    break;
                }
            }
        }
    }
    else {
        //console.log("Accumulator > 0 on JZ " + accumulator);
        programCounter++;
        //console.log("PC: " + programCounter);
    }
}
function JNZ(p_var) {
    if (accumulator > 0) {
        if (p_var.includes("#")) {
            var __stringSplit = p_var.substr(1, p_var.length);
            var numSliced = parseFloat(__stringSplit, 10);
            programCounter = numSliced;
            //console.log("PC on JNZ receives: " + programCounter);
        }
        else {
            for (var i = 0; i < rotules.length; i++) {
                //if (p_var.includes(rotules[i].name)) {
                if (p_var === rotules[i].name) {
                    programCounter = rotules[i].posM;
                    //console.log("PC on JNZ with VAR receives: " + programCounter);
                    break;
                }
            }
        }
    }
    else {
        //console.log("Accumulator >= 0 on JNZ " + accumulator);
        programCounter++;
        //console.log("PC: " + programCounter);
    }
}
function JN(p_var) {
    if (accumulator < 0) {
        if (p_var.includes("#")) {
            var __stringSplit = p_var.substr(1, p_var.length);
            var numSliced = parseFloat(__stringSplit, 10);
            programCounter = numSliced;
            //console.log("PC on JN receives: " + programCounter);
        }
        else {
            for (var i = 0; i < rotules.length; i++) {
                //if (p_var.includes(rotules[i].name)) {
                if (p_var === rotules[i].name) {
                    programCounter = rotules[i].posM;
                    //console.log("PC on JN with VAR receives: " + programCounter);
                    break;
                }
            }
        }
    }
    else {
        //console.log("Accumulator >= 0 on JN " + accumulator);
        programCounter++;
        //console.log("PC: " + programCounter);
    }
}
function JP(p_var) {
    if (accumulator >= 0) {
        if (p_var.includes("#")) {
            var __stringSplit = p_var.substr(1, p_var.length);
            var numSliced = parseFloat(__stringSplit, 10);
            programCounter = numSliced;
            //console.log("PC on JP receives: " + programCounter);
        }
        else {
            for (var i = 0; i < rotules.length; i++) {
                //if (p_var.includes(rotules[i].name)) {
                if (p_var === rotules[i].name) {
                    programCounter = rotules[i].posM;
                    //console.log("PC on JP with VAR receives: " + programCounter);
                    break;
                }
            }
        }
    }
    else {
        //console.log("Accumulator < 0 on JP " + accumulator);
        programCounter++;
        //console.log("PC: " + programCounter);
    }
}
function Jump(p_var) {
    if (p_var.includes("#")) {
        var __stringSplit = p_var.substr(1, p_var.length);
        var numSliced = parseFloat(__stringSplit, 10);
        programCounter = numSliced;
        //console.log("PC on Jump receives: " + programCounter);
    }
    else {
        for (var i = 0; i < rotules.length; i++) {
            // if (p_var.includes(rotules[i].name)) {
            if (p_var === rotules[i].name) {
                programCounter = rotules[i].posM;
                //console.log("PC on Jump with VAR receives: " + programCounter);
                break;
            }
        }
    }
}
function Halt() {
    console.log("### HALT ###");
    halt = true;
}
function CLR(codigo) {
    //console.log("clear");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 500, 500);
    yLine = 15;
    x = 0;
    y = 0;
    console.clear();

    ctx1.fillStyle = "#000554";
    ctx1.fillRect(0, 0, 500, 500);
    yLine1 = 15;
    x1 = 0;
    y1 = 0;
    console.clear();
    if (codigo) {
        programCounter++;
    }else{
        reset();
    }
}
function CLRlog(){
    ctx1.fillStyle = "#000554";
    ctx1.fillRect(0, 0, 500, 500);
    yLine1 = 15;
    x1 = 0;
    y1 = 0;
}
function print(p_var) {
    var texto;
    for (var i = 0; i < variables.length; i++) {
        //if (p_var.includes(variables[i].name)) {
        if (p_var === variables[i].name) {
            texto = variables[i].value;
            break;
        }
    }
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("-  " + texto, xLine, yLine);
    yLine += lineSize;
    programCounter++;
}

function printStep(p_var) {
    ctx1.font = "15px Arial";
    ctx1.fillStyle = "white";
    ctx1.fillText("-  " + p_var, xLine1, yLine1);
    yLine1 += lineSize1;
}
function POS() {
    x = accumulator;
    y = accumulator2;
    programCounter++;
}
function PXL() {
    ctx.fillStyle = 'rgb(' + accumulator + ',' + accumulator2 + ',' + accumulator3 + ')';
    //console.log(ctx.fillStyle);
    //console.log('rgb '+ accumulator,accumulator2,accumulator3);
    ctx.fillRect(x, y, 4, 4);
    programCounter++;
}
function RND(p_var) {
    var rand = Math.floor(Math.random() * (accumulator2 - accumulator + 1)) + accumulator;
    //console.log('rand ' + rand);
    for (var i = 0; i < variables.length; i++) {
        //if (p_var.includes(variables[i].name)) {
        if (p_var === variables[i].name) {
            variables[i].value = rand;
            break;
        }
    }
    programCounter++;
}
function COS(p_var) {
    for (var i = 0; i < variables.length; i++) {
        //if (p_var.includes(variables[i].name)) {
        if (p_var === variables[i].name) {
            accumulator = Math.cos(variables[i].value) * accumulator2;
            break;
        }
    }
    programCounter++;
}
function SEN(p_var) {
    for (var i = 0; i < variables.length; i++) {
        //if (p_var.includes(variables[i].name)) {
        if (p_var === variables[i].name) {
            accumulator = Math.sin(variables[i].value) * accumulator2;
            break;
        }
    }
    programCounter++;
}
function ADDF(p_var) {
    for (var i = 0; i < variables.length; i++) {
        //if (p_var.includes(variables[i].name)) {
        if (p_var === variables[i].name) {
            var f = variables[i].value.toFixed(2);
            accumulator += f;
            break;
        }
    }
    programCounter++;
}

function IN(p_var) {
    var inp;
    inp = prompt('entre o valor da variavel ' + p_var);

    for (var i = 0; i < variables.length; i++) {
        //if (p_var.includes(variables[i].name)) {
        if (p_var === variables[i].name) {
            variables[i].value = inp;
            break;
        }
    }
    programCounter++;
}
function reset() {
    readerDone = false;
    //docLines = [];
    readingCounter = 0;
    currentLine = 0;
    variableReading = false;
    methodReading = false;
    variables = [];
    rotules = [];
    codeLines = [];
    stopReading = false;
    halt = false;
    accumulator = 0;;
    accumulator2 = 0;
    accumulator3 = 0;
    programCounter = 0;
    posMCodeStart = 0;
    console.clear();
}
