import React,{useRef, useEffect} from 'react';
import mapboxgl from 'mapbox-gl';

import './Map.css';

mapboxgl.accessToken = process.env.REACT_APP_GOOGLE_API_KEY;

const Map = props => {

    const mapRef = useRef(null);

    const  {center, zoom } = props;

    useEffect (()=>{
        const map = new mapboxgl.Map({
            container : mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center : center,
            zoom : zoom
        })

        new mapboxgl.Marker({color: "red"}).setLngLat([center[0],center[1]]).addTo(map);
        map.addControl(new mapboxgl.FullscreenControl());
        map.addControl(new mapboxgl.NavigationControl());
        
        const scale = new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'metric'
        });
        map.addControl(scale);
    },[center,zoom])

    return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>;
}

export default Map;