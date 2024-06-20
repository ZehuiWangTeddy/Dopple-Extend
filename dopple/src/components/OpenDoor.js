// src/components/OpenDoor.js
import React, { useState } from 'react';
import Toast from './Toast';

const OpenDoor = ({ doorIndex, doorLabel, onClick }) => {
  const [toastMessage, setToastMessage] = useState('');

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
          setToastMessage("Door opened");
        } else {
          setToastMessage("Door open failed");
        }
        // Call the onClick function to stop the focus
        if (onClick) {
          onClick();
        }
      })
      .catch((error) => {
        console.error("Failed to open door", error);
        setToastMessage("Failed to open door");
        // Call the onClick function to stop the focus even if the request fails
        if (onClick) {
          onClick();
        }
      });
  };

  return (
    <>
      <button
        className="open-door-button"
        onClick={() => handleOpenDoor(doorIndex)}
      >
        {doorLabel}
      </button>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </>
  );
};

export default OpenDoor;
