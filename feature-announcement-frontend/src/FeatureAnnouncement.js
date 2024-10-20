import React, { useEffect, useState } from "react";

function FeatureAnnouncement() {
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState(null);

    // Fetch existing features when the app loads
    useEffect(() => {
        fetch("/features")
            .then((res) => res.json())
            .then((data) => {
                setFeatures(data); // Set the existing features
            });
    }, []);

    // Set up WebSocket connection for new features
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');

        ws.onmessage = (event) => {
            const feature = JSON.parse(event.data);
            setNewFeature(feature); // Show new feature immediately
            setFeatures(prevFeatures => [...prevFeatures, feature]); // Append the new feature to the list
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            {newFeature && (
                <div className="feature-announcement">
                    <h2>New Feature: {newFeature.title}</h2>
                    <p>{newFeature.description}</p>
                </div>
            )}

            <div className="all-features">
                <h2>All Features</h2>
                    {features.map((feature) => (
                        <li key={feature.id}>
                            <strong>{feature.title}:</strong> {feature.description}
                        </li>
                    ))}
            </div>
        </div>
    );
}

export default FeatureAnnouncement;
