import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import counterReducer from './reducer';


const store = createStore(counterReducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log("tila ny", storeNow)
})

const Button = (props) => {

  const { handleClick, text } = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Statistic = ({name,value,tarkkuus}) => {

    let suffix = ""
    if (name==="positiivisia") {
      suffix = " %"
    }

    let result=0
    if (tarkkuus===0) { 
    return (
      <tr><td>{name}</td><td>{value}{suffix}</td></tr>
    ) 
    }

    result = Math.round (value * 10) / 10 
    return (
      <tr><td>{name}</td><td>{result}{suffix}</td></tr>
    )

}

const Statistics = ({valinnat,keskiarvo,pospros,arvolkm, emptyfu}) => {
  
  if (arvolkm===0) {
    return (
      <div>ei yhtään palautetta annettu.</div>
    )
  }
  return (
    <div>
      <table><tbody>
        <Statistic name = {valinnat[0]} value={store.getState().good} tarkkuus="0" />
        <Statistic name = {valinnat[1]} value={store.getState().ok} tarkkuus="0" />
        <Statistic name = {valinnat[2]} value={store.getState().bad} tarkkuus="0" />
        <Statistic name = {valinnat[3]} value={keskiarvo} tarkkuus="1" />
        <Statistic name = {valinnat[4]} value={pospros} tarkkuus="1" />
      </tbody>
      </table>
      <Button handleClick={emptyfu} text="nollaa tilasto"/>
    </div>
  )
}



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keskiarvo: 0,
      positiivisia: 0,
      arvolkm : 0,
      summa : 0,
      //tiedot : [0,0,0,0,0],
      valinnat: ["hyvä","neutraali","huono","keskiarvo","positiivisia"],
      emptyfu : this.emptyNew(),
      pospros: 0
    }
  }


  emptyNew = () => {

    console.log('New emptying') 
    return () => {

      store.dispatch({type: 'ZERO'})

      try { 
        let arvoja = this.state.arvolkm
  
        if (arvoja > 0 ) {
  
        this.setState({
          keskiarvo: 0, 
          positiivisia: 0,
          arvolkm : 0,
          summa : 0,
          pospros : 0
          //tiedot: [0,0,0,0,0],
        })
        }
      } catch (error) {
        console.log('nope') 
      }
  

    }


  }


  addValue = (idx) =>  {

    return () => {
      let val    = 0


    if (idx === 0) {
      store.dispatch({type: 'GOOD'})
      val = 1

    }
    if (idx === 1) {
      store.dispatch({type: 'OK'})
    }
    if (idx === 2) {
      store.dispatch({type: 'BAD'})
      val = -1
    }
    
    let arvoja = this.state.arvolkm+1 
    //tmp[idx]+=1
    let keskiarvox=(this.state.summa+val)/arvoja

    let goodi = store.getState().good

    let posprosx  =goodi/arvoja*100

    //console.log("Arvoja:",arvoja, "ka:",tmp[3], "pos:",tmp[4])
    
    this.setState({
      arvolkm : this.state.arvolkm+1,
      summa : this.state.summa+val,
      keskiarvo: keskiarvox,
      pospros : posprosx
    })
    //console.log("Tiedot:", this.state.tiedot)
  }

  }


  render() {

    return (
      <div>
        <div>
          <h1>Anna palautetta</h1>
          <Button handleClick={this.addValue(0)} text={this.state.valinnat[0]}/>
          <Button handleClick={this.addValue(1)} text={this.state.valinnat[1]}/>
          <Button handleClick={this.addValue(2)} text={this.state.valinnat[2]}/>
        </div>
        <h1>Statistiikka</h1>
        <div>{Statistics(this.state)}</div>
        </div>
    )
  }
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
