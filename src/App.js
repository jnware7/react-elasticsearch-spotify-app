import React, { Component } from "react";
import * as $ from "jquery";
import hash from "./hash";
import "./App.css";

import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import Card from "./Card";
import Title from "./Title";

import logo from "./logo.svg";
require('dotenv').config();

function searchFor(searchString){

    return function(x){
      return (x.name.toLowerCase()).includes(searchString.toLowerCase() || !searchString);
    }

}


class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      albums:[],
      searchString: '',
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
     this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }
  handleChangeSearch(e) {
  this.setState({searchString: e.target.value});
  console.log(this.state.searchString)
  }



  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
    }
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/browse/new-releases",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        console.log("Data", JSON.stringify(data.albums.items));

        const arrayOfAlbums = data.albums.items;
        let arrayToState = [];
        arrayOfAlbums.forEach( album => {
          let albumObj = {};
          albumObj.name = album.name;
          albumObj.artist = album.artists[0].name;
          albumObj.img = album.images[1].url;
          arrayToState.push(albumObj);
        })

        console.log(arrayToState);

        const name = data.albums.items[0].name;
        const artist = data.albums.items[0].artists[0].name;
        const img = data.albums.items[0].images[1].url;


         this.setState({albums: arrayToState });
      }
    });
  }



  render() {
    const {albums, searchString} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
              <h1 className="spotify-btn"> <b>Login to Spotify</b> </h1>
            </a>
          )}
          {this.state.token && (
            <React.Fragment>
            <Title title="New Album Releases" />
            <form className="search-container">
              <input
                type="text"
                value={searchString}
                ref="search"
                onChange={this.handleChangeSearch}
                placeholder="    Search..."
               />
             </form>
            <div className="card-container">
            {
              searchString ? (
                albums.filter(searchFor(searchString)).map( (album, key)=> (
                  <Card
                    key={album.name}
                    name={album.name}
                    artist={album.artist}
                    img={album.img}
                  />

                ))
              ) : (
                albums.map( (album, key)=> (
                  <Card
                    key={album.name}
                    name={album.name}
                    artist={album.artist}
                    img={album.img}
                  />

                ))
              )
            }

            </div>
            </React.Fragment>
          )}
        </header>
      </div>
    );
  }
}

export default App;
