class Sudoku {
    constructor(state){
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


// Medium
const board = [
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

//Easy
// [
//     [5,3,0, 0,7,0,  0,0,0],
//     [6,0,0, 1,9,5,  0,0,0],
//     [0,8,9, 0,0,0,  0,6,0],
//     [8,0,0, 0,6,0,  0,0,3],
//     [4,0,0, 8,0,3,  0,0,1],
//     [7,0,0, 0,2,0,  0,0,6],
//     [0,6,0, 0,0,0,  2,8,0],
//     [0,0,0, 4,1,9,  0,0,5],
//     [0,0,0, 0,8,0,  0,7,9],
// ]

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
    console.log(str);
    // const str = '497200000100400005000016098620300040300900000001072600002005870000600004530097061';
    const sudoku = new Sudoku(str);
    sudoku.print();
    console.log("------------")
    solve(sudoku);
    if(!gameSolved) alert("Unable to solve in", recursionLimit, ' steps!');
    else {
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                document.getElementById(''+i+j).value = gameSolved[i][j];
            }
        }
        alert("Solved");
    }
}