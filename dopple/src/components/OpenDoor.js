import React from 'react';
import eventEmitter from './utils/eventEmitter';

const OpenDoor = ({ doorIndex, doorLabel, stopFocus }) => {
  const handleOpenDoor = (id) => {
    // Define different hosts for different buttons
    const front_host = process.env.REACT_APP_OPEN_FRONT_DOOR_HOST;
    const back_host = process.env.REACT_APP_OPEN_BACK_DOOR_HOST;
    let selectedHost;

    // Choose the appropriate host based on the id
    if (id === 1) {
      selectedHost = front_host;
    } else if (id === 2) {
      selectedHost = back_host;
    }

    // Send a request to the server to open the door
    fetch(selectedHost, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error === "PIN_INCORRECT") {
          eventEmitter.emit('toast', 'Door opened');
        } else {
          eventEmitter.emit('toast', 'Door open failed');
        }
        if (stopFocus) {
          stopFocus(); // Stop focus after opening the door
        }
      })
      .catch((error) => {
        console.error("Failed to open door", error);
        eventEmitter.emit('toast', 'Failed to open door');
        if (stopFocus) {
          stopFocus();
        }
      });
  };

  return (
    <button
      className="open-door-button"
      onClick={() => handleOpenDoor(doorIndex)}
    >
      {doorLabel}
    </button>
  );
};

export default OpenDoor;
