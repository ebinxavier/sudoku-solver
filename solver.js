class Sudoku {
    constructor(state){ 
        /* Supported Format 
        [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,3,0,8,5],
            [0,0,1,0,2,0,0,0,0],
            [0,0,0,5,0,7,0,0,0],
            [0,0,4,0,0,0,1,0,0],
            [0,9,0,0,0,0,0,0,0],
            [5,0,0,0,0,0,0,7,3],
            [0,0,2,0,1,0,0,0,0],
            [0,0,0,0,4,0,0,0,9]
        ]
            OR 
        '497200000100400005000016098620300040300900000001072600002005870000600004530097061';
        */
        if(Array.isArray(state[0])){
            this.state = state;
        } else if(typeof state === 'string'){
            this.state =[];
            for(let i=0;i<9;i++) {
            const row = state.slice(i*9, i*9+9);
            this.state.push(row.split('').map(n=>Number(n)))
            }
        }
        this.allNumbers = [1,2,3,4,5,6,7,8,9];
    }

    getRow(row) {
        return this.state[row];
    }

    getColumn(column){
        return this.state.map(row=>row[column]);
    }

    chechNumberExistsInRow(row, number){
        return this.getRow(row).includes(number);
    }
    chechNumberExistsInColumn(column, number){
        return this.getColumn(column).includes(number);
    }

    getPossibleValues(row, column){
        if(this.state[row][column]) return [];
        return this.allNumbers.filter(number=>!this.chechNumberExistsInColumn(column, number) && !this.chechNumberExistsInRow(row, number))
    }

    print(){
        this.state.map(row=>console.log(JSON.stringify(row)))
    }

    getNextEmptyPosition(){
        let rowIndex, columnIndex;
        this.state.some((row, rowI)=>{
            return row.some((col, colI)=>{
                if(col===0) {
                    rowIndex = rowI;
                    columnIndex = colI;
                    return true;
                }
            })
        })
        return([rowIndex, columnIndex]);
    }
}

let count = 0;
let gameSolved = false;
const recursionLimit = 10000000;

const clone = (arr)=>{
    return arr.map(row=>[...row])
}

const solve = (sudoku)=>{
    if(gameSolved) return;
    const [row, column] = sudoku.getNextEmptyPosition();
    if(row === undefined || column === undefined) {
        sudoku.print();
        console.log("Iteration:",count)
        gameSolved = sudoku.state;
        return; // Means game solved.
    }
    const possibleValues = sudoku.getPossibleValues(row, column);
    possibleValues.forEach(number=>{
        if(count++<recursionLimit){
            const newState = clone(sudoku.state);
            newState[row][column] = number;
            const newSudoku = new Sudoku(newState);
            solve(newSudoku);
        }
    })
}

function solveHandler(){
    let str ='';
    try{
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                const number = Number(document.getElementById(''+i+j).value);
                if(number<0 || number>9 || isNaN(number)) throw new Error("Error")
                str+= number;
            }
        }
    } catch(e){
        alert("Please enter valid numbers!");
        return;
    }
    if(!str.split('').reduce((a,e)=>a+Number(e),0)){ // All Zeros
        alert("Enter at least one cell.");
        return;
    }
    console.log("Input",str);
    const sudoku = new Sudoku(str);
    sudoku.print();
    console.log("------------")
    solve(sudoku);
    if(!gameSolved) alert("Unable to solve..!");
    else {
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                document.getElementById(''+i+j).value = gameSolved[i][j];
            }
        }
    }
}

function clearHandler(){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            document.getElementById(''+i+j).value = '';
        }
    } 
}

const samples = [
    '004300209005009001070060043006002087190007400050083000600000105003508690042910300',
    '040100050107003960520008000000000017000906800803050620090060543600080700250097100',
    '600120384008459072000006005000264030070080006940003000310000050089700000502000190',
    '497200000100400005000016098620300040300900000001072600002005870000600004530097061',
    '005910308009403060027500100030000201000820007006007004000080000640150700890000420',
    '100005007380900000600000480820001075040760020069002001005039004000020100000046352',
    '009065430007000800600108020003090002501403960804000100030509007056080000070240090',
    '000000657702400100350006000500020009210300500047109008008760090900502030030018206',
    '503070190000006750047190600400038000950200300000010072000804001300001860086720005',
    '060720908084003001700100065900008000071060000002010034000200706030049800215000090',
    '004083002051004300000096710120800006040000500830607900060309040007000205090050803',
    '000060280709001000860320074900040510007190340003006002002970000300800905500000021',
    '004300000890200670700900050500008140070032060600001308001750900005040012980006005',
    '008070100120090054000003020604010089530780010009062300080040607007506000400800002',
    '065370002000001370000640800097004028080090001100020940040006700070018050230900060',
    '005710329000362800004000000100000980083900250006003100300106000409800007070029500',
    '200005300000073850000108904070009001651000040040200080300050000580760100410030096',
    '040800500080760092001005470056309000009001004320500010000200700700090030005008026',
    '050083017000100400304005608000030009090824500006000070009000050007290086103607204',
    '700084005300701020080260401624109038803600010000000002900000000001005790035400006',
]

function prePopulateRandom(){
    const str = samples[Math.floor(Math.random() * samples.length)];
    let count = 0;
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++, count++){
            document.getElementById(''+i+j).value = str[count]==='0'?'':str[count];
        }
    } 
}