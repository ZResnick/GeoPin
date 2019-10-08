import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 40.783,
  longitude: -73.96,
  zoom: 13,
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9" //can edit style by changing this.
        mapboxApiAccessToken="pk.eyJ1IjoienJlc25pY2siLCJhIjoiY2p4YWp4YWtxMDF3aTNubWFsNjU1enZxNSJ9.bNgUO8YtMSS4825b6BiIPQ"
        onViewportChange={newViewport => setViewport(newViewport)}
        {...viewport}
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
      </ReactMapGL>
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
