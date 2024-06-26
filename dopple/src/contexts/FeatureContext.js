import React, { createContext, useState, useContext, useEffect } from 'react';

const FeatureContext = createContext();

export const useFeature = () => useContext(FeatureContext);

export const FeatureProvider = ({ children }) => {
    const initialFeatures = JSON.parse(localStorage.getItem('features')) || {
        OrderStatus: true,
        PrinterStatus: true,
        OperatorStatus: true,
        NetworkServices: true,
        ChiselServer: true
    };

    const [features, setFeatures] = useState(initialFeatures);

    const toggleFeature = (feature) => {
        setFeatures((prevFeatures) => {
            const updatedFeatures = {
                ...prevFeatures,
                [feature]: !prevFeatures[feature]
            };
            localStorage.setItem('features', JSON.stringify(updatedFeatures));
            return updatedFeatures;
        });
    };

    useEffect(() => {
        localStorage.setItem('features', JSON.stringify(features));
    }, [features]);

    return (
        <FeatureContext.Provider value={{ features, toggleFeature }}>
            {children}
        </FeatureContext.Provider>
    );
};
