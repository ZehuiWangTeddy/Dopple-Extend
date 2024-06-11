import React from 'react';
import { useNavigate } from "react-router-dom";

const PerviousPageButton = ({link}) => {

    const navigate = useNavigate();

    const handlePerviousPage = () => {
        // navigate("/stats");
        navigate(link);
    };

    return (
        <button className="previous-page-button" onClick={handlePerviousPage}>
          Previous Page
        </button>
    )
}

export default PerviousPageButton;
