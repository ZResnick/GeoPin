import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 40.783,
  longitude: -73.96,
  zoom: 13,
};

const Map = ({ classes }) => {
  //state
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  //functions
  useEffect(() => {
    getUserPosition();
  }, []);

  const getUserPosition = () => {
    //use built in window tool called navigator
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: {
        longitude,
        latitude,
      },
    });
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9" //can edit style by changing this.  At somepoint, try to add options for switching betweren style.
        mapboxApiAccessToken="pk.eyJ1IjoienJlc25pY2siLCJhIjoiY2p4YWp4YWtxMDF3aTNubWFsNjU1enZxNSJ9.bNgUO8YtMSS4825b6BiIPQ"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
        {/* Pin for users current location */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color={'blue'} />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color={'red'} />
          </Marker>
        )}
      </ReactMapGL>

      {/* Blog Area to add pin content*/}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  navigationControl: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    margin: '1em',
  },
  deleteIcon: {
    color: 'red',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
};

export default withStyles(styles)(Map);
