import './App.css';
import {useState} from 'react'
import {useContext} from 'react'
import {board,doors} from './map.js'
import {StateContext, stringifySolves, destringifySolves} from './StateContext.js'


function importAll(r) {
  return r.keys();
}

// const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

const BOARD_HEIGHT = 6
const BOARD_WIDTH = 9


const initialState = {
  row: 1,
  col: 2,
  solved: [
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
  ],
  lastMoved: "·",
  metaOpen: false,
  metaSolved: false
}

const solutions = [
  ["CASTLE","ZELDA","PUDDLE","CHARTS","FACING","DETER","CELLAR","PLANET","ROBED"],
  ["SOFT","GRUMBLE","START","KEYPUNCH","STANDING","VIGOR","SAWED","BORE","SIPS"],
  ["PORT","HOMELAND","BOOKCASE","FRACTIONS","LOATHE","NURSES", "SOLOIST","SNEER","THREE"],
  ["DIAPHANOUS","LOBES","SPICE","TIGER","CANE","APPLE","BLUR","HOARY","DOG"],
  ["HIRED","FACE","CUBA","EXAMINER","HEALER","ALLNIGHT","LIFE OF PI","RAMPS","ACTS"],
  ["UNLEASH","PHRASE","DRIED","ROYALTY","ABRUPTLY","ROTS","POUND","EARTH","THIRTY"],
]

const getCookie = (varName) => {
  var cookieVal = document.cookie.split("; ").find((row) => row.startsWith(varName+"=")) ? 
    document.cookie.split("; ").find((row) => row.startsWith(varName+"=")).split("=")[1] :
    null
  return cookieVal
}

function App() {
  const solvedCookie = getCookie("solved")
  var [state,setState] = useState(solvedCookie ? {...initialState, solved: destringifySolves(solvedCookie)} : initialState)
  
  function update (newState) {
    //set cookie to destringify(solves)
    document.cookie = "solved="+stringifySolves(newState.solved)+";"
    setState(newState)
  }
  return (
    <div className="App">
      <StateContext.Provider value={state}>
        <Stage update={update} metaOpen={state.metaOpen}/>
      </StateContext.Provider>
    </div>
  );
}


function Stage({update, metaOpen}) {

  if(!metaOpen) return (
    <div style={{margin: "auto"}}>
      <table><tbody>
        <tr>
          <td />
          <td><Arrow dir="↑" update ={update}/></td>
          <td />
        </tr>
        <tr>
          <td><Arrow dir="←" update ={update}/></td>
          <td><Puzzle /></td>
          <td><Arrow dir="→" update ={update}/></td>
        </tr>
        <tr>
          <td><Arrow dir="☆" update ={update}/></td>
          <td><Arrow dir="↓" update ={update}/></td>
          <td><Arrow dir="★" update ={update}/></td>
        </tr>
        <tr>
          <td></td>
          <td><AnswerBox update ={update} metaOpen={false}/></td>
          <td></td>
        </tr>
      </tbody></table>

    </div>
    
  )
  else return (
    <div style={{margin: "auto"}}>
      <table><tbody>
        <tr>
          <td />
          <td><Arrow dir="x" update ={update}/></td>
          <td />
        </tr>
        <tr>
          <td><Arrow dir="x" update ={update}/></td>
          <td><Metapuzzle /></td>
          <td><Arrow dir="x" update ={update}/></td>
        </tr>
        <tr>
          <td><Arrow dir="x" update ={update}/></td>
          <td><Arrow dir="x" update ={update}/></td>
          <td><Arrow dir="★" update ={update}/></td>
        </tr>
        <tr>
          <td></td>
          <td><AnswerBox update ={update} metaOpen={true}/></td>
          <td></td>
        </tr>
      </tbody></table>

    </div>
  )
}


function AnswerBox({update, metaOpen}) {
  const state = useContext(StateContext)

  function handleSubmit(e) {
    e.preventDefault()
    var ans = e.target[0].value.toUpperCase().replace(/[^A-Z0-9]*/g,'')
    if(ans === '3') ans = "THREE"
    if(ans === '30') ans = "THIRTY"

    console.log(ans)
    
    if(ans === "CLEARALLPROGRESS") document.cookie="solved=000000000000000000000000000000000000000000000000000000"
    if(metaOpen && ans === "REALSHARPCARD") update({
      row: state.row,
        col: state.col,
        lastMoved: state.lastMoved,
        metaOpen: state.metaOpen,
      solved: state.solved, metaSolved: true})

    if(ans === solutions[state.row][state.col].replace(/[^A-Z0-9]*/g,''))
    {
      update({
        row: state.row,
        col: state.col,
        lastMoved: state.lastMoved,
        solved: state.solved.map((boolrow,r) => r!==state.row ? boolrow : 
          boolrow.map((boolval,c) => c!==state.col ? boolval : true)
          )
    })
    }
  }

  const prefixString = metaOpen ? "A " : (state.row===4 && state.col===6) ? "THE ": ""
  const solution = metaOpen ? "A REAL SHARP CARD ♡" :prefixString + solutions[state.row][state.col]
  
  if((metaOpen && state.metaSolved)  || (!metaOpen && state.solved[state.row][state.col]))
    return ( 
      <input value={solution} disabled={true} />
    )
  else
     return (
      <form onSubmit={handleSubmit}>
        {prefixString}<input />
      </form>
    )
  
}


function Puzzle() {
  const state = useContext(StateContext)
  const filepath = "/img/puzzle-"+state.row.toString()+state.col.toString()+".png"
  return (
    <img src={filepath} width={700}/>

  )
}


function Metapuzzle() {
  const state = useContext(StateContext)
  const filepath = "/img/puzzle-★.png"
  return (
    <img src={filepath} width={700}/>

  )
}



function Arrow({dir, update}) {
  const state = useContext(StateContext)
  const row=state.row
  const col=state.col

  function opposite(d) {
    if(d==="↑") return "↓"
    if(d==="→") return "←"
    if(d==="↓") return "↑"
    if(d==="←") return "→"
    return "·"
  }

  function changeStage () {
    const newRow = dir==="↑" ? row-1 : dir==="↓" ? row+1 : row
    const newCol = dir==="←" ? col-1 : dir==="→" ? col+1 : col    
    const metaOpen = dir==="★" && ! state.metaOpen
    
    update({row:(newRow + BOARD_HEIGHT) % BOARD_HEIGHT, col: (newCol + BOARD_WIDTH) % BOARD_WIDTH, lastMoved: dir, solved: state.solved, metaOpen})
  }

  if(state.solved[4][6] && dir === '★') return (
    <img src={"/img/"+dir+"★.png" } width={50} onClick={() => changeStage()}></img>
  )
  else if(!(doors[board[row][col]].find(x => x===dir)))
  {
    return (
      <img src="/img/x.png" width={50} ></img>
    )
  }
  else if(state.solved[row][col] || dir === opposite(state.lastMoved)) return (
    <img src={"/img/" + dir + "k.png"} width={50}  onClick={() => changeStage()}></img>
  )
  else return (
    <img src={"/img/" + dir + "x.png"} width={50} ></img>
  )
}

export default App;

