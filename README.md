# Clinical Trial Similarity Viewer 🔬  
*A Full-Stack Platform for Intelligent Trial Analysis*

![Dashboard Preview](https://github.com/ChandanDev27/Clinical-Trial-Similarity-Viewer/blob/main/frontend/public/images/dashboard-preview.png)  
*Interactive dashboard with real-time visualizations*

![ListView Preview](https://github.com/ChandanDev27/Clinical-Trial-Similarity-Viewer/blob/main/frontend/public/images/ListView-preview.png)  
*Interactive ListView*

---

## 🌟 Overview  
The **Clinical Trial Similarity Viewer** empowers medical researchers to analyze and compare clinical trials through an intuitive interface backed by robust data processing. This full-stack solution combines:

- **📊 Rich visualizations** for trial characteristics and geographic distribution  
- **🔍 Smart filtering** across 10+ parameters  
- **🤖 Persistent user selections** with cross-view synchronization  
- **📈 Data-driven insights** through similarity scoring and statistical analysis  

---

## 🚀 Key Features  

### **Frontend Excellence**  
- **Multi-view exploration**: Switch between list/dashboard views seamlessly  
- **Animated visualizations**: Gradient charts, dynamic maps, sponsor logos  
- **Smart interactions**: Tooltips, error handling, mobile-responsive UI  
- **Performance**: Memoized components, lazy loading, optimized renders  

### **Backend Power**  
- **RESTful API**: 15+ endpoints for data operations  
- **Advanced filtering**: Phase/location/sponsor/date range capabilities  
- **Data integrity**: Caching, normalization, and validation layers  
- **Geo-analytics**: Country mapping, coordinate data, region tagging  

---

## 🛠 Tech Stack  

| **Layer**       | **Technologies**                                                                 |
|-----------------|----------------------------------------------------------------------------------|
| **Frontend**    | React, Redux Toolkit, Tailwind CSS, Chart.js, Leaflet                            |
| **Backend**     | Node.js, Express.js, CORS, Dotenv                                                |
| **Dev Tools**   | Postman, Git, npm, React DevTools                                                |
| **Data**        | JSON storage, custom normalization pipelines, statistical calculators            |

---

## 🏗 Architecture  

### **Frontend Structure**  
```
frontend/
├── src/
│   ├── features/         # Redux state management
│   ├── services/         # API communication
│   ├── utils/            # Data transformers
│   ├── components/       # 40+ reusable UI elements
│   └── pages/            # Core application views
```

### **Backend Structure**  
```
backend/
├── controllers/         # Business logic
├── middleware/          # Auth/logging/error handlers  
├── routes/              # API endpoints
├── data/                # Trial datasets
└── server.js            # Entry point
```

---

## 🚀 Getting Started  

### 1. Clone & Setup  
```bash
git clone https://github.com/ChandanDev27/Clinical-Trial-Similarity-Viewer
cd Clinical-Trial-Similarity-Viewer
```

### 2. Install Dependencies  
```bash
# Frontend
cd frontend && npm install

# Backend 
cd ../backend && npm install
```

### 3. Configure Environment  
Create `.env` in `/backend`:  
```ini
PORT=5000
NODE_ENV=development
```

### 4. Launch Servers  
```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm start
```

**Access the app at:** `http://localhost:3000`

---

## 📡 API Highlights  

| **Endpoint**            | **Method** | **Description**                      |
|-------------------------|------------|--------------------------------------|
| `/api/trials`           | GET        | Paginated trial data with sorting    |
| `/api/trials/filter`    | GET        | Multi-parameter filtered results     |
| `/api/trials/dashboard` | GET        | Aggregated metrics for visualizations|
| `/api/trials/selections`| POST       | Save user trial selections           |

**Sample Request:**  
```bash
curl "http://localhost:5000/api/trials?page=2&limit=5&phase=PHASE3"
```

---

## 🎨 Design Philosophy  

### **User-Centric UI**  
- Color-coded regions for quick geographic analysis  
- Animated transitions between data states  
- Contextual help tooltips across all components  

### **Data Integrity**  
- Input sanitization for all API parameters  
- Automatic data refresh on file changes  
- Comprehensive error logging  

### **Performance**  
- Cached API responses for frequent queries  
- Lightweight GeoJSON handling for maps  
- Tree-shaken dependencies  

---

## 🛠 Development Notes  

### **Frontend Tips**  
- Use `src/utils/dataHelpers` for complex transformations  
- Redux state persists to localStorage automatically  
- Component library in `src/components/ui`  

### **Backend Tips**  
- `controllers/analysisController` handles statistical logic  
- Middleware chain: Logger → Auth → Router → Error Handler  
- Postman collection available for API testing  

---

## 🌟 Future Roadmap  

| **Feature**                | **Status**   |
|----------------------------|--------------|
| Trial similarity scoring   | In Progress  |
| CSV/PDF export             | Planned      |
| User authentication        | Planned      |
| Advanced map clustering    | Researching  |

---

## 🤝 Contributing  
We welcome contributions! Please:  

1. Fork the repository  
2. Create feature branches (`git checkout -b feature/amazing-feature`)  
3. Submit PRs with detailed descriptions  
4. Follow our [code style guidelines](CONTRIBUTING.md)  

---

*Empowering clinical research through better data analysis* 🔍💊