import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonPokemon: '',
      listPokemon: [],
      listPokemonDetails: []
    };
    this.searchPokemon = this.searchPokemon.bind(this);
    this.detailsThisPokemon = this.detailsThisPokemon.bind(this);
  }

  callAllPokemon() {
    // Call the API page
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then((result) => {
      // Get the result
      // If we want text, call result.text()
      return result.json();
    }).then((jsonResult) => {
      // Do something with the result
      this.setState({ jsonPokemon: jsonResult });
    })
  }

  callPokemonDetails(url, name) {
    this.setState({listPokemonDetails: [] });
      // Call the API page
    fetch(url).then((result) => {
      // Get the result
      // If we want text, call result.text()
      return result.json();
    }).then((jsonPokemon) => {
      // Do something with the result
      let type = [];
      let baseStats = [];
      this.setState({ listPokemonDetails: [name, type, '', []] });

      //Call all types of this pokemon
      for(let i = 0; i < jsonPokemon.types.length; i++) {
        fetch(jsonPokemon.types[i].type.url).then((result) => {
          return result.json();
        }).then((jsonResult) => {
          let nbPokemon = jsonResult.pokemon.length;
          let hp = 0;
          let attack = 0;
          let speed = 0;
          let defense = 0;
          let special_attack = 0;
          let special_defense = 0;
          //Call all pokemons details of this type
          for(let x = 0; x < nbPokemon; x++) {
            fetch(jsonResult.pokemon[i].pokemon.url).then((result) => {
              return result.json();
            }).then((jsonOtherPokemon) => {
              for(let y = 0; y < jsonOtherPokemon.stats.length; y++) {
                let name = jsonOtherPokemon.stats[y].stat.name;
                if(name === 'hp') 
                  hp += jsonOtherPokemon.stats[y].base_stat;
                else if(name === 'attack')
                  attack += jsonOtherPokemon.stats[y].base_stat;
                else if(name === 'speed')
                  speed += jsonOtherPokemon.stats[y].base_stat;
                else if(name === 'defense')
                  defense += jsonOtherPokemon.stats[y].base_stat;
                else if(name === 'special-attack')
                  special_attack += jsonOtherPokemon.stats[y].base_stat;
                else if(name === 'special-defense')
                  special_defense += jsonOtherPokemon.stats[y].base_stat;
              }
              let obj = [{name: 'speed', value: speed/nbPokemon }, {name: 'speacial-defense', value:special_defense/nbPokemon}, {name: 'special-attack', value: special_attack/nbPokemon}, {name: 'defense', value: defense/nbPokemon }, {name: 'attack', value: attack/nbPokemon }, {name: 'hp', value: hp/nbPokemon}];
              this.setState(state => ( state.listPokemonDetails[1].splice(i, 1, ({name: jsonPokemon.types[i].type.name, stats: obj}))));
            })
          }
        })
      }

      // write each stats in array
      for(var x = 0; x < jsonPokemon.stats.length; x++) {
        baseStats.push({name: jsonPokemon.stats[x].stat.name, value: jsonPokemon.stats[x].base_stat});
      }

      // Push all data in array
      this.setState(state => ( state.listPokemonDetails.splice(2, 1, jsonPokemon.sprites.front_default)));
      this.setState(state => ( state.listPokemonDetails.splice(3, 1, baseStats)));
    })
  }

  searchPokemon(event) {
    if(this.state.jsonPokemon === '') {
      this.callAllPokemon();
    }
    const pokemon = event.target.value;
    if(pokemon.length >= 2) {
      let newArrayPokemon = [];
      for(var i = 0; i < this.state.jsonPokemon.results.length; i++) {
        if((this.state.jsonPokemon.results[i].name).includes(pokemon))
          newArrayPokemon.push(this.state.jsonPokemon.results[i]);
      }
      this.setState({ listPokemon: newArrayPokemon });
    }
  }

  detailsThisPokemon(event) {
    this.callPokemonDetails(event.currentTarget.dataset.url, event.currentTarget.dataset.name);
  }

  render() {
    return (
      <div className="App">
        <form className="SearchForm">
          Pokemon: <input type="text" className="InputForm" placeholder="Chercher votre pokémon..." onChange={ this.searchPokemon }/>
        </form>
        <ul className="PokemonList">
          { this.state.listPokemon.map(item => <li key={ item.name } className="PokemonName" onClick={this.detailsThisPokemon} data-name={item.name} data-url={item.url}> {item.name} </li>) }
        </ul>
        { this.state.listPokemonDetails.length > 0 &&
          <div className="PokemonDetails">
            <div className="PokemonImage">
              <img src={this.state.listPokemonDetails[2]} alt="Indisponible"/>
            </div>
            <div className="PokemonInfos">
              <div className="Name">
                { this.state.listPokemonDetails[0] }
              </div>
              <div className="Types">
                <ul className="UlTypes">
                Type(s): 
                  { this.state.listPokemonDetails[1].map(item => <li key={ item.name } className='LiTypes'> {item.name} </li>) }
                </ul>
              </div>
            </div>
            <div className="PokemonStats">
              <ul className="UlBaseStats">
              Stats de base:
                { this.state.listPokemonDetails[3].map(item => <li key={ item.name } className="LiBaseStats"> {item.name + ': ' + item.value} </li>) }
              </ul>
                { this.state.listPokemonDetails[1].map(type => <ul key={type.name} className="UlTypeStats"> Moyenne du type {type.name} : {type.stats.map( (stats,index) => <div><li key={type.name+'_'+stats.name} className="LiTypeStats"> {stats.name + ': ' + stats.value}</li><div className="myProgress"><div className="myBar" style={{width: (this.state.listPokemonDetails[3][index].value/stats.value)*100+'%'}}></div></div></div> )} </ul>) }
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;