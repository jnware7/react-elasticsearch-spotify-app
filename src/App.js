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
      elasticSearchRes:null
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
     this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }
  handleChangeSearch(e) {
  this.setState({searchString: e.target.value});
  // console.log(this.state.searchString)
  }



  componentDidMount() {
  //elastic search call
  this.performQuery(this.state.elasticSearchRes);
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
         console.log("DATA", JSON.stringify(data.albums.items));

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


  // Handles the `onChange` event every time the user types in the search box.
  updateQuery = e => {
    const elasticSearchRes = e.target.value;
    this.setState(
      {
        elasticSearchRes // Save the user entered query string
      },
      () => {
        this.performQuery(elasticSearchRes); // Trigger a new search
      }
    );
  };


    performQuery = elasticSearchRes => {
    client.search(elasticSearchRes, {}).then(
      elasticSearchRes => {
        this.setState({
          elasticSearchRes
        });
      },
      error => {
        console.log(`error: ${error}`);
      }
    );
  };




  render() {
    const {albums, searchString,elasticSearchRes} = this.state;
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
            <form className="search-container">
              <input
                type="text"
                value={searchString}
                ref="search"
                onChange={this.handleChangeSearch}
                onChange={this.updateQuery}
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
             elasticSearchRes ?
            </div>
            {/* Show the total count of results for this query */}
      
        {elasticSearchRes.results.map(result => (
          <div key={result.getRaw("id")}>
            <p>Released: {result.getRaw("Release_date")}</p>
            <a href={result.getRaw("external_urls.raw")}>Listen</a>
            <br />
          </div> :
          null
        ))}
            </React.Fragment>
          )}
        </header>
      </div>
    );
  }
}



// We can query for anything -- `foo` is our example.
// const query = 'beyonc'
// const options = {};
// client.search(query, options)
//   .then(resultList => console.log(resultList.rawResults, "elasticsearch"))
//   .catch(error => console.log(error))

export default App;
