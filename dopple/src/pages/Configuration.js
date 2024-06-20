import React from "react";
import { useNavigate } from "react-router-dom";
import "./Configuration.css";
import DoppleHeader from "../components/DoppleHeader";
import { useFeature } from '../contexts/FeatureContext';

const Configuration = () => {
    const navigate = useNavigate();
    const { features, toggleFeature } = useFeature();

    return (
        <div className="configuration-container">
            <DoppleHeader />
            <div className="config-content">
                <div className="config-heading">
                    <h1>Dashboard Configuration</h1>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Button</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(features).map((feature, index) => (
                            <tr key={index}>
                                <td>{feature.replace(/([A-Z])/g, ' $1').trim()}</td>
                                <td>
                                    <button
                                        className={`toggle-button ${features[feature] ? 'on' : 'off'}`}
                                        onClick={() => toggleFeature(feature)}
                                    >
                                        {features[feature] ? 'ON' : 'OFF'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="config-button-container">
                <button className="config-button" onClick={() => navigate("/")}>Done</button>
            </div>
        </div>
    );
};

export default Configuration;
