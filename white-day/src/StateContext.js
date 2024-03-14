import {createContext} from 'react';

const emptySolveArray = [
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  ]

export const StateContext = createContext({
  row: 1,
  col: 2,
  solved: emptySolveArray,
  lastMoved: "·",
  metaOpen: false,
  metaSolved: false
}


)

export const stringifySolves = (arr) => {
  return arr.reduce( (x,y) => x.concat(y), []).map(b => b?"1":"0").reduce( (x,y) => x+y)
}

export const destringifySolves = (str) =>  {
  const solves = emptySolveArray
  for(const i in str) {
    solves[Math.floor(i/9)][i%9] = (str.charAt(i) === '1')
  }
  return solves
}