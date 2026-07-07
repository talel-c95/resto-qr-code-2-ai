# 🍽️ Restaurant QR System with AI

A complete AI-powered Restaurant QR Code Ordering System built with **React**, **Node.js**, **Express**, **MongoDB**, and **OpenAI**.

Customers can scan a QR code, browse the digital menu, chat with an AI waiter, place orders, and track them in real time. Restaurant owners can manage menus, orders, tables, and access AI-powered business analytics from a dedicated dashboard.

---

# 🚀 Features

## 👨‍🍳 Restaurant Owner

- Authentication (Register/Login)
- Dashboard Overview
- Restaurant Management
- Menu Management (CRUD)
- Category Management
- Table Management
- QR Code Generation
- Download QR Codes
- Order Management
- Live Order Tracking
- Waiter Call Management
- Receipt Management
- Revenue Dashboard
- AI Restaurant Analytics
- Restaurant Settings

---

## 👤 Customer

### Continue as Guest
Customers can use the application without creating an account.

### Customer Account
- Register
- Login
- Order History
- Personalized Experience

---

### QR Menu

- Scan QR Code
- Browse Menu
- Search Food
- Filter by Category
- Add to Cart
- Checkout
- Live Order Tracking
- Call Waiter
- View Receipt

---

# 🤖 AI Features

## AI Waiter

Customers can chat with an AI assistant that can:

- Recommend dishes
- Explain ingredients
- Detect allergens
- Suggest vegetarian/vegan meals
- Recommend meals based on budget
- Pair drinks and desserts
- Translate menu items
- Answer restaurant questions

Example:

> Customer:
> I have €20 and I'm vegetarian.

AI:

> I recommend the Veggie Pizza, Mushroom Pasta, or Caesar Salad without chicken.

---

## AI Restaurant Analytics

Restaurant owners receive AI-generated insights such as:

- Daily Revenue Analysis
- Weekly Revenue Analysis
- Monthly Revenue Analysis
- Most Ordered Dishes
- Least Ordered Dishes
- Peak Ordering Hours
- Customer Statistics
- Sales Trends
- Business Recommendations

Example Insights:

- Burger sales increased by 20% this week.
- Friday evenings generate the highest revenue.
- Pasta sales are decreasing.
- Consider creating a Burger + Fries combo.

---

## AI Dynamic Menu

The menu automatically highlights:

- 🔥 Trending Today
- ⭐ Chef Recommendation
- ❤️ Best Sellers
- 🥗 Healthy Choices
- 🌱 Vegetarian Meals
- 🤖 AI Recommended For You

The recommendations change depending on:

- Popular dishes
- Customer preferences
- Previous orders
- Time of day

---

# ⚙️ Tech Stack

## Frontend

- React.js
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MVC Architecture
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Socket.IO
- OpenAI API
- QRCode

---

# 📁 Project Structure

```
restaurant-qr-system/

├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── routes/
│   ├── utils/
│   └── App.tsx
│
└── backend/

    ├── src/
    │
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── services/
    ├── socket/
    ├── utils/
    ├── app.ts
    └── server.ts
```

---

# 🗂 MongoDB Collections

```
admins
restaurants
customers
guestSessions
tables
categories
menuItems
carts
orders
orderItems
receipts
waiterCalls
conversations
messages
analytics
```

---

# 🔐 Authentication

## Restaurant Owner

- Register
- Login
- JWT Authentication

---

## Customer

- Continue as Guest
- Register
- Login

---

# 📱 Main Customer Flow

```
Landing Page

↓

Continue as Guest
or
Login/Register

↓

Scan QR Code

↓

Browse Menu

↓

Chat with AI Waiter

↓

Add Items to Cart

↓

Checkout

↓

Track Order

↓

Receive Receipt
```

---

# 🖥️ Admin Dashboard Flow

```
Login

↓

Dashboard

├── Overview
├── Restaurant
├── Menu
├── Categories
├── Tables
├── Orders
├── Waiter Calls
├── Revenue
├── AI Analytics
└── Settings
```

---

# 🔄 Order Status

- Pending
- Accepted
- Preparing
- Ready
- Served
- Completed
- Cancelled

---

# 📡 API Modules

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

---

## Restaurant

```
GET /api/restaurants

PUT /api/restaurants/:id
```

---

## Categories

```
GET /api/categories

POST /api/categories

PUT /api/categories/:id

DELETE /api/categories/:id
```

---

## Menu

```
GET /api/menu

GET /api/menu/:id

POST /api/menu

PUT /api/menu/:id

DELETE /api/menu/:id
```

---

## Tables

```
GET /api/tables

POST /api/tables

DELETE /api/tables/:id

GET /api/tables/:id/qrcode
```

---

## Orders

```
POST /api/orders

GET /api/orders

GET /api/orders/:id

PATCH /api/orders/:id/status
```

---

## Cart

```
GET /api/cart

POST /api/cart

PUT /api/cart/:id

DELETE /api/cart/:id
```

---

## Waiter Calls

```
POST /api/waiter-call

GET /api/waiter-call

PATCH /api/waiter-call/:id
```

---

## AI

```
POST /api/ai/chat

POST /api/ai/recommend

POST /api/ai/translate

GET /api/ai/analytics

GET /api/ai/trending
```

---

# 📊 Real-Time Features

Using Socket.IO

- Live Orders
- Live Order Status
- Waiter Calls
- Notifications
- Dashboard Updates

---

# 👨‍💻 Internship Distribution

## 👨‍💻 Mahdi

### Admin Dashboard

- Authentication
- Restaurant Management
- Menu Management
- Categories
- Tables
- QR Codes
- Orders Dashboard
- Waiter Calls
- Revenue Dashboard
- AI Analytics
- Settings

Backend

- Admin Authentication
- Restaurant APIs
- Menu APIs
- Category APIs
- Table APIs
- Order Management APIs
- AI Analytics APIs

---

## 👨‍💻 Khaled

### Customer Process

- Landing Page
- Guest Mode
- Customer Authentication
- QR Menu
- AI Waiter
- Dynamic Menu
- Shopping Cart
- Checkout
- Order Tracking
- Receipt
- Waiter Call

Backend

- Customer Authentication
- Guest Sessions
- Cart APIs
- Customer Orders
- AI Chat APIs
- Recommendation APIs
- Waiter APIs
- Receipt APIs

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Input Validation
- MongoDB Validation
- Error Handling
- Environment Variables

---

# 📦 Future Improvements

- Online Payments (Stripe)
- Loyalty Points
- Multi-Restaurant Support
- Multi-Language Support
- Kitchen Display System
- Inventory Management
- AI Sales Forecasting
- AI Review Analysis
- AI Voice Ordering
- Push Notifications

---

# ❤️ Built With

- React
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- OpenAI API
- Tailwind CSS
- TypeScript
