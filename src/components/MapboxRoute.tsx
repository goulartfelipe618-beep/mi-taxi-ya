import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZmVsaXBlZ291bGFydDIiLCJhIjoiY21qN2VzYTNlMDM3NjNkcHd3Y2k2cnoxZCJ9.7-STZWkuwiE74kLYzjhJ9g";

interface Props {
  pickupCoords: [number, number] | null;
  dropoffCoords: [number, number] | null;
}

const MapboxRoute = ({ pickupCoords, dropoffCoords }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const dropoffMarker = useRef<mapboxgl.Marker | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-48.6356, -26.9908],
      zoom: 13,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.on("load", () => setLoaded(true));
    return () => { map.current?.remove(); };
  }, []);

  useEffect(() => {
    if (!map.current || !loaded) return;
    pickupMarker.current?.remove();
    if (pickupCoords) {
      pickupMarker.current = new mapboxgl.Marker({ color: "#e2a308" })
        .setLngLat(pickupCoords).addTo(map.current);
      map.current.flyTo({ center: pickupCoords, zoom: 14 });
    }
  }, [pickupCoords, loaded]);

  useEffect(() => {
    if (!map.current || !loaded) return;
    dropoffMarker.current?.remove();
    if (dropoffCoords) {
      dropoffMarker.current = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(dropoffCoords).addTo(map.current);
    }
  }, [dropoffCoords, loaded]);

  useEffect(() => {
    if (!map.current || !loaded || !pickupCoords || !dropoffCoords) return;
    const drawRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (!data.routes?.length) return;
        const route = data.routes[0].geometry;
        if (map.current!.getSource("route")) {
          (map.current!.getSource("route") as mapboxgl.GeoJSONSource).setData({
            type: "Feature", properties: {}, geometry: route,
          });
        } else {
          map.current!.addLayer({
            id: "route", type: "line",
            source: { type: "geojson", data: { type: "Feature", properties: {}, geometry: route } },
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#e2a308", "line-width": 4, "line-opacity": 0.8 },
          });
        }
        const coords = route.coordinates as [number, number][];
        const bounds = new mapboxgl.LngLatBounds(coords[0], coords[0]);
        coords.forEach((c: [number, number]) => bounds.extend(c));
        map.current!.fitBounds(bounds, { padding: 40 });
      } catch (err) { console.error("Route error:", err); }
    };
    drawRoute();
  }, [pickupCoords, dropoffCoords, loaded]);

  return (
    <div ref={mapContainer} className="w-full h-52 rounded border border-border overflow-hidden" />
  );
};

export default MapboxRoute;
