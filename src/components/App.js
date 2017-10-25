import React, { Component } from 'react';
import Map from './Map';
import Sidebar from './Sidebar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      currentPlaceId: '',
      hoverId: '',
    };
  }

  onPlacesChange = (places) => this.setState({ places });

  onPlaceChange = (placeId) => {
    if (placeId === this.state.currentPlaceId) {
      this.setState({ currentPlaceId: '' });
    } else {
      this.setState({ currentPlaceId: placeId });
    }
  }

  onPlaceHover = (placeId) => this.setState({ hoverId: placeId });

  render() {
    return (
      <div className="App">
        <Sidebar
          currentPlaceId={this.state.currentPlaceId}
          hoverId={this.state.hoverId}
          places={this.state.places}
          onPlacesChange={this.onPlacesChange}
          onPlaceChange={this.onPlaceChange}
          onPlaceHover={this.onPlaceHover}
        />
        <Map
          currentPlaceId={this.state.currentPlaceId}
          hoverId={this.state.hoverId}
          places={this.state.places}
          onPlaceChange={this.onPlaceChange}
          onPlaceHover={this.onPlaceHover}
        />
      </div>
    );
  }
}

export default App;
