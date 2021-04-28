import React, { useState, useEffect } from 'react';
import * as Papa from 'papaparse';
import Map from './Map';

export default function App(): React.Component {
    const [data, setData] = useState({ hospitals: [] });

    useEffect(async () => {
        const response = await fetch('./hospitals.csv');
        const text = await response.text();
        console.log("Response text: ", text);
        const result = Papa.parse(text, { header: true });
        setData(result.data);
        console.log(result.data);
    });

    return <div>
        <Map />
    </div>;
}