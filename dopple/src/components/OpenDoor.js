import React from 'react';

const OpenDoor = ({ doorIndex, doorLabel }) => {
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
          alert("Door opened");
        } else {
          alert("Door open failed");
        }
      })
      .catch((error) => {
        console.error("Failed to open door", error);
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
