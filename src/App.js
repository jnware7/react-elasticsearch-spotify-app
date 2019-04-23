import React, { Component } from "react";
import * as $ from "jquery";
import hash from "./hash";
import * as SwiftypeAppSearch from "swiftype-app-search-javascript";
import "./App.css";

import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import Card from "./Card";
import Title from "./Title";

import logo from "./logo.svg";
require('dotenv').config();

const client = SwiftypeAppSearch.createClient({
  hostIdentifier: "host-8ciykn",
  apiKey: "search-xunm9zq9kudg3dihhffgqv66",
  engineName: "spotifynewreleasedalbums"
});




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
     this.handelSubmit = this.handelSubmit.bind(this);
  }
  handleChangeSearch(e) {
  this.setState({searchString: e.target.value});

  // console.log(this.state.searchString)
  }
handelSubmit(e){
  console.log(e)
  e.preventDefault();
  e.stopPropagation();
  const options = {};

  client.search(this.state.searchString, options)
    .then(resultList => {
      console.log(resultList, "elasticsearchresult");
      suggestSearchTerm(this.state.searchString)
    })
    .catch(error => console.log(error))

const suggestSearchTerm = (querystring) => {
    client.suggest({
  engine: 'spotifynewreleasedalbums',
  q: querystring,
  filters: {
    page: {
      'enumField': 'theFilter'
    }
  }
  }, function(err, res) {
  console.log(res,"autocomplete")
  })
}


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
         // console.log("DATA", JSON.stringify(data.albums.items));

        const arrayOfAlbums = data.albums.items;
        let arrayToState = [];
        arrayOfAlbums.forEach( album => {
          let albumObj = {};
          albumObj.name = album.name;
          albumObj.artist = album.artists[0].name;
          albumObj.img = album.images[1].url;
          arrayToState.push(albumObj);
        })

        // console.log(arrayToState);

        const name = data.albums.items[0].name;
        const artist = data.albums.items[0].artists[0].name;
        const img = data.albums.items[0].images[1].url;


         this.setState({albums: arrayToState });
      }
    });
  }



  render() {
    const {albums, searchString} = this.state;
    const lowerCasedSearchString = searchString.toLowerCase();
    const filteredData = albums.filter( album => {
      return Object.values(album).some( key => {
        return key.toLowerCase().includes(lowerCasedSearchString);
      })
    })
    // console.log("filteredData==>",filteredData)
    // console.log("album[ key ]",album[key])
    // console.log("lowerCasedSearchString",lowerCasedSearchString)
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
            <form className="search-container" type="submit" value="Submit" onSubmit={this.handelSubmit}>
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
                filteredData.map( (album, key)=> (
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
