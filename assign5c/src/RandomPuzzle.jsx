import React from 'react';
import axios from 'axios';
import Board from './Board';

let squareDeets = []

export default class Puzzle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: [],
            msg: "",
            checked: false, 
        }
    }

    componentDidMount() {
        axios.get('https://threeinarowpuzzle.herokuapp.com/random')
        .then(res => {
            const squares = res.data;
            squareDeets = squares.rows;
            squareDeets.map(square => ({...square, isWrong: false}))
            this.setState({
                squares: squareDeets
            })
        })
    }

    handleClick = (row, col) =>{
        if (squareDeets[row][col].canToggle === true){
            squareDeets[row][col].currentState++;
            if (squareDeets[row][col].currentState === 3){
                squareDeets[row][col].currentState = 0;
            }

            this.setState({
                squares: squareDeets
            })
        }
    }

    checkAnswer = () => {
        let wonList = [];
        let gtList = [];
        let mistakesList = [];

        console.log(squareDeets[0]);
        for (let i = 0; i < squareDeets.length; i++){
            const curRow = squareDeets[i];
            wonList.push([...curRow].every(square => square.currentState === square.correctState));

            mistakesList.push([...curRow].filter(square => square.currentState != 0).some(square => square.currentState != square.correctState))
    
            gtList.push([...curRow].filter(square => square.currentState != 0).every(square => square.currentState === square.correctState))
        }

        let _msg;
        if (wonList.every(item => item === true)) {
            _msg = "You won!"
        }
        else if (mistakesList.some(item => (item === true))) {
            _msg = "Something is wrong"
        }
        else if (gtList.every(item => (item === true))) {
            _msg = "Getting there..."
        }

        this.setState({msg: _msg})
    }

    handleCheckbox = () => {
        if (!this.state.checked) {
            this.setState({checked: true});
        }
        else if (this.state.checked) {
            this.setState({checked: false});
        }
        this.seeWrongSquares();
    }

    seeWrongSquares = () => {
        if (!this.state.checked){
            for (let i = 0; i < squareDeets.length; i++){
                for (let j = 0; j < squareDeets[i].length; j++){
                    if ((squareDeets[i][j].currentState != squareDeets[i][j].correctState) && (squareDeets[i][j].currentState != 0)){
                        squareDeets[i][j].isWrong = true;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < squareDeets.length; i++){
                for (let j = 0; j < squareDeets[i].length; j++){
                    squareDeets[i][j].isWrong = false;
                }
            }
        }

        this.setState({
            squares: squareDeets
        })
    }

    render() {
        return(
            <div>
                <Board squares={this.state.squares} 
                    onClick={(row, col) => this.handleClick(row, col)}
                    isWrong={this.state.isWrong} />
                
                <input type="checkbox" 
                    name="wrongSquares"
                    onChange={this.handleCheckbox}/>
                <label htmlFor="wrongSquares">See Wrong Squares</label>
                <br/>
                <button onClick={this.checkAnswer}>Check Answer</button>
                <p>{this.state.msg}</p>
            </div>
        );
    }
}