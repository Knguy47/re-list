import React, { Component } from 'react';
import _ from 'lodash';
import haversine from 'haversine';
import classNames from 'classnames';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const google = window.google;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address1: 'Austin, TX',
      address2: 'University of Texas at Austin, Austin, TX',
    };
  }

  onChange1 = (address) => this.setState({ address1: address })
  onChange2 = (address) => this.setState({ address2: address })

  handleFormSubmit = (event) => {
    event.preventDefault();
    let latLng1;
    let latLng2;

    const calcDistances = (places) => {
      places.forEach(place => {
        const start1 = {
          latitude: latLng1.lat,
          longitude: latLng1.lng,
        };
        const start2 = {
          latitude: latLng2.lat,
          longitude: latLng2.lng,
        };
        const end = {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };

        place.distance = haversine(start1, end) + haversine(start2, end);
      });
      return places;
    };

    const places1 = geocodeByAddress(this.state.address1)
      .then(res => getLatLng(res[0]))
      .then(latLng => {
        latLng1 = latLng;
        return this.fetchPlaces(latLng);
      });
    const places2 = geocodeByAddress(this.state.address2)
      .then(res => getLatLng(res[0]))
      .then(latLng => {
        latLng2 = latLng;
        return this.fetchPlaces(latLng);
      });

    Promise.all([places1, places2])
      .then(_.flatten)
      .then(res => _.uniqBy(res, 'id'))
      .then(calcDistances)
      .then(places => {
        this.props.onPlacesChange(places.sort((a, b) => a.distance - b.distance));
      });
  }

  fetchPlaces = (latLng) => {
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: new google.maps.LatLng(latLng.lat, latLng.lng),
      radius: '16093',
      type: 'real_estate_agency',
    };

    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (res, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(res);
        } else {
          reject(google.maps.places.PlacesServiceStatus.ERROR);
        }
      });
    });
  }

  render() {
    const { places, currentPlaceId, hoverId, onPlaceHover } = this.props;
    const inputProps1 = {
      value: this.state.address1,
      onChange: this.onChange1,
    };
    const inputProps2 = {
      value: this.state.address2,
      onChange: this.onChange2,
    };
    const autocompleteClasses = {
      autocompleteContainer: 'autocomplete-container'
    };

    return (
      <div className="App-sidebar">
        <header>
          <p>
            Find local real estate agencies nearby!
          </p>

          <form onSubmit={this.handleFormSubmit}>
            <label>
              Address 1
              <PlacesAutocomplete
                inputProps={inputProps1}
                classNames={autocompleteClasses}
              />
            </label>
            <label>
              Address 2
              <PlacesAutocomplete
                inputProps={inputProps2}
                classNames={autocompleteClasses}
              />
            </label>
            <button type="submit">Find</button>
          </form>
        </header>

        <ul className="place-list">
          {places.map(place => {
            const liClasses = classNames({
              'place-selected': place.id === currentPlaceId,
              'place-hovered': place.id === hoverId,
            });

            return (
              <li
                key={place.id}
                onClick={() => this.props.onPlaceChange(place.id)}
                className={liClasses}
                onMouseEnter={() => onPlaceHover(place.id)}
                onMouseLeave={() => onPlaceHover('')}
              >
                <div className="place-content">
                  <h2>{place.name}</h2>
                  <p>{place.vicinity}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Sidebar;
