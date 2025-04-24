# Bulgarian Waters – React Frontend

This project is a React-based interactive dashboard for exploring water features (lakes, dams, rivers, reservoirs) in Bulgaria using a map interface. The data is sourced from Wikidata via a GraphQL API.

## ✨ Features

- 🗺️ Interactive Leaflet map of Bulgaria
- 📍 Colored pins for different types of water features
- 🔍 Filter by type, surface area, and capacity
- 🔄 Real-time querying via GraphQL
- 📡 Backend powered by Wikidata (served at `http://localhost:4000/`)
- 🌐 Click on pins to view details and link to Wikidata
- 🚀 Loading spinner for smooth UX
- 📱 Responsive design

---


## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bulgarian-waters-frontend.git
cd bulgarian-waters-frontend
npm install
make start
```

The app should now be available at http://localhost:3000/.

## 🖼️ Example map

![Bulgarian Waters Demo](docs/images/example-map.png)
