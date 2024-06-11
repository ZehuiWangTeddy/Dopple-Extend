import React from 'react';
import { useNavigate } from "react-router-dom";

const NextPageButton = ({link}) => {

    const navigate = useNavigate();

    const handleNextPage = () => {
        // navigate("/stats");
        navigate(link);
    };

    return (
        <button className="next-page-button" onClick={handleNextPage}>
            Next Page
        </button>
    )
}

export default NextPageButton;
