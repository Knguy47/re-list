import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

const google = window.google;

const GoogleMapWrapper = withGoogleMap((props) =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={8}
    defaultCenter={{ lat: 30.267153, lng: -97.743061 }}
  >
    {props.children}
  </GoogleMap>
);

class MarkerWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  onToggleOpen = () => {
    this.setState((prevState, props) => {
      return { isOpen: !prevState.isOpen };
    });
  }

  render() {
    const { place, currentPlaceId, hoverId, onPlaceChange, onPlaceHover } = this.props;

    return (
      <Marker
        position={{
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }}
        onClick={() => onPlaceChange(place.id)}
        onMouseOver={() => onPlaceHover(place.id)}
        onMouseOut={() => onPlaceHover('')}
      >
        {(place.id === currentPlaceId || place.id === hoverId)
          &&
          <InfoWindow onCloseClick={() => onPlaceChange('')}>
            <span>{place.name}</span>
          </InfoWindow>
        }
      </Marker>
    );
  }
}

class Map extends Component {
  componentWillUpdate(nextProps, nextState) {
    if (this.props.places !== nextProps.places) {
      let bounds = new google.maps.LatLngBounds();
      nextProps.places.forEach(function(place) {
        bounds.extend(place.geometry.location);
      });
      this._map.fitBounds(bounds);
    }
  }

  handleMapLoad = (ref) => {
    this._map = ref;
  }

  render() {
    return (
      <GoogleMapWrapper
        containerElement={<div className="App-map" />}
        mapElement={<div style={{ height: '100%' }} />}
        onMapLoad={this.handleMapLoad}
      >
        {this.props.places.map(place => (
          <MarkerWrapper
            key={place.id}
            place={place}
            currentPlaceId={this.props.currentPlaceId}
            hoverId={this.props.hoverId}
            onPlaceChange={this.props.onPlaceChange}
            onPlaceHover={this.props.onPlaceHover}
          />
        ))}
      </GoogleMapWrapper>
    );
  }
}

export default Map;
