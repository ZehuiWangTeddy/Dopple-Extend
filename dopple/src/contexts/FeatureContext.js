import React, { createContext, useState, useContext } from 'react';

const FeatureContext = createContext();

export const useFeature = () => useContext(FeatureContext);

export const FeatureProvider = ({ children }) => {
    const [features, setFeatures] = useState({
        OrderStatus: true,
        PrinterStatus: false,
        OperatorStatus: false,
        NetworkServices: true
    });

    const toggleFeature = (feature) => {
        setFeatures((prevFeatures) => ({
            ...prevFeatures,
            [feature]: !prevFeatures[feature]
        }));
    };

    return (
        <FeatureContext.Provider value={{ features, toggleFeature }}>
            {children}
        </FeatureContext.Provider>
    );
};
