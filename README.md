
# Vehicle Rental App 🚗
Live URL: [https://vehicle-rent-one.vercel.app](https://vehicle-rent-one.vercel.app)

---

## 📖 Project Description
A Back-end vehicle rental system where customers can see,
book vehicles,cancel bookings, and admins can manage vehicles and bookings.
Includes role-based authentication and automatic price calculation.

---

## ✨ Features
- User authentication with JWT
- Role-based access (Admin & Customer)
- Create, update, get and cancel bookings
- Create, update, get and delete users
- login, register users,
- Automatic rental price calculation
- Vehicle availability management
- PostgreSQL database integration

---

## 🛠️ Technology Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Deployment:** Vercel
- **Other Tools:** PostgreSQL (Neon DB), dotenv, Postman, bcrypt

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/Rakib-Hasan1/L2-assignment-2.git

cd L2-assignment-2
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variable

```
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWTSECRET=your_jwt_secret
```

### 4. Run the project locally
```
npm run dev
```

🚀 Usage Instructions

- API Base URL: http://localhost:5000/api/v1
- Example: Create Booking


```bash- POST /api/v1/bookings
Authorization: Bearer <jwt_token>
Body:
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```
Response:

```
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Honda Civic 2023",
      "daily_rent_price": 45
    }
  }
}


