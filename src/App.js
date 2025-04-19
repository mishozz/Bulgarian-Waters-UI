import { useQuery, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});

const WATER_FEATURES_QUERY = gql`
  query WaterFeatures(
    $type: WaterFeatureType
    $minSurfaceArea: Float
    $minCapacity: Float
    $region: String
  ) {
    waterFeatures(
      type: $type
      minSurfaceArea: $minSurfaceArea
      minCapacity: $minCapacity
      region: $region
    ) {
      id
      name
      type
      location {
        latitude
        longitude
      }
      surfaceArea
      capacity
      wikidataUrl
    }
  }
`;

const icons = {
  LAKE: new L.Icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png', iconSize: [35, 41], iconAnchor: [12, 41] }),
  DAM: new L.Icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png', iconSize: [35, 41], iconAnchor: [12, 41] }),
  RESERVOIR: new L.Icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png', iconSize: [35, 41], iconAnchor: [12, 41] }),
  RIVER: new L.Icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png', iconSize: [35, 41], iconAnchor: [12, 41] })
};

function MapView({ filters }) {
  const { loading, error, data } = useQuery(WATER_FEATURES_QUERY, {
    variables: filters,
  });

  if (loading) return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255,255,255,0.7)', // optional white overlay
      }}
    >
      <CircularProgress />
    </Box>
  );

  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.waterFeatures) return null;

  return (
    <MapContainer
      center={[42.7339, 25.4858]}
      zoom={7}
      zoomControl={false}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.waterFeatures.map(
        (feature) =>
          feature.location && (
            <Marker
              key={feature.id}
              position={[feature.location.latitude, feature.location.longitude]}
              icon={icons[feature.type] || icons.LAKE}
            >
              <Popup>
                <strong>{feature.name}</strong>
                <br />
                Type: {feature.type}
                <br />
                Area: {feature.surfaceArea ?? 'N/A'} km²
                <br />
                Capacity: {feature.capacity ?? 'N/A'} m³
                <br />
                <a href={feature.wikidataUrl} target="_blank" rel="noopener noreferrer">
                  Wikidata
                </a>
              </Popup>
            </Marker>
          )
      )}
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}

function FiltersPanel({ onUpdateFilters }) {
  const [type, setType] = useState('');
  const [minSurfaceArea, setMinSurfaceArea] = useState('');
  const [minCapacity, setMinCapacity] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onUpdateFilters({
      type: type || undefined,
      minSurfaceArea: minSurfaceArea ? parseFloat(minSurfaceArea) : undefined,
      minCapacity: minCapacity ? parseFloat(minCapacity) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="filters-panel">
      <h3>Filter Waters</h3>
      <label>Type:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Any</option>
          <option value="LAKE">Lake</option>
          <option value="DAM">Dam</option>
          <option value="RESERVOIR">Reservoir</option>
          <option value="RIVER">River</option>
        </select>
      </label>
      <label>Min Surface Area (km²):
        <input type="number" value={minSurfaceArea} onChange={e => setMinSurfaceArea(e.target.value)} />
      </label>
      <label>Min Capacity (m³):
        <input type="number" value={minCapacity} onChange={e => setMinCapacity(e.target.value)} />
      </label>
      <button type="submit">Apply Filters</button>
    </form>
  );
}

export default function App() {
  const [filters, setFilters] = useState({});
  return (
    <ApolloProvider client={client}>
      <div className="app-wrapper">
        <header className="app-header">Bulgarian Waters</header>
        <FiltersPanel onUpdateFilters={setFilters} />
        <MapView filters={filters} />
      </div>
    </ApolloProvider>
  );
}
