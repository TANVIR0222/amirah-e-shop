# 🛒 Amirah E-Shop — Comprehensive API Documentation & Backend Specifications

This document outlines all RESTful API endpoints, request bodies, query parameters, response structures, and architectural suggestions required for the **Amirah E-Shop** mobile application (Expo / React Native).

---

## 📌 General Conventions & System Headers

> ⚠️ **IMPORTANT BACKEND NOTICE (MOBILE SPECIFIC)**:
> This application is a native React Native (Expo) mobile app. Native mobile apps do **NOT** rely on Web Browser Cookies (`Set-Cookie` or HTTP-Only cookies). 
> All authentication tokens (`access_token` and `refresh_token`) **MUST** be returned directly in the JSON response body upon login/registration/refresh. The mobile app stores tokens securely on-device (MMKV / SecureStore) and sends the access token via the standard `Authorization: Bearer <JWT_TOKEN>` HTTP header for protected endpoints.

- **Base URL**: `https://api.amiraheshop.com/api/v1`
- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **Authentication Header**: `Authorization: Bearer <JWT_TOKEN>` (for all protected routes)
- **Cookie Usage**: **NONE / NOT SUPPORTED** (Do NOT use `Set-Cookie` headers)
- **Recommended Mobile Headers**:
  - `X-Platform`: `android` | `ios`
  - `X-App-Version`: `1.0.0`

### Standard Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Validation failed / Unauthorized access",
  "errors": {
    "phone_number": ["Enter a valid 11-digit Bangladeshi phone number."]
  }
}
```

---

## 🔐 1. Authentication & Authorization APIs

### 1.1 Register User
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "full_name": "Tanvir Islam",
  "email": "tanvir@example.com",
  "phone_number": "01700000000",
  "password": "Password123!"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful. OTP sent to phone.",
  "data": {
    "user_id": "usr_99218",
    "require_otp_verification": true
  }
}
```

### 1.2 Login with Email / Phone & Password
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "identifier": "01700000000", // Can be email or phone_number
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJKV1Qi...",
    "refresh_token": "def456...",
    "expires_in": 604800,
    "user": {
      "id": "usr_99218",
      "full_name": "Tanvir Islam",
      "email": "tanvir@example.com",
      "phone_number": "01700000000",
      "avatar_url": "https://amiraheshop.com/avatar.jpg"
    }
  }
}
```

### 1.3 Request OTP (Phone Authentication)
- **Endpoint**: `POST /auth/otp/request`
- **Access**: Public
- **Request Body**:
```json
{
  "phone_number": "01700000000",
  "purpose": "login" // "login" | "register" | "reset_password"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "OTP code sent via SMS to 01700000000",
  "data": {
    "otp_expires_in_seconds": 120
  }
}
```

### 1.4 Verify OTP & Authenticate
- **Endpoint**: `POST /auth/otp/verify`
- **Access**: Public
- **Request Body**:
```json
{
  "phone_number": "01700000000",
  "otp_code": "582194"
}
```
- **Response (200 OK)**: Token & User profile payload.

### 1.5 Social Authentication (Google / Apple)
- **Endpoint**: `POST /auth/social-login`
- **Access**: Public
- **Request Body**:
```json
{
  "provider": "google", // "google" | "apple"
  "id_token": "oauth_id_token_string"
}
```

### 1.6 Refresh Access Token
- **Endpoint**: `POST /auth/refresh-token`
- **Access**: Public
- **Request Body**:
```json
{
  "refresh_token": "def456..."
}
```

### 1.7 Forgot / Reset Password
- **Endpoints**:
  - `POST /auth/forgot-password` (Sends OTP/Link)
  - `POST /auth/reset-password` (Verifies token/OTP & sets new password)

### 1.8 Logout
- **Endpoint**: `POST /auth/logout`
- **Access**: Protected (`Bearer <TOKEN>`)

---

## 👤 2. User & Profile Management APIs

### 2.1 Get Current User Profile
- **Endpoint**: `GET /user/profile`
- **Access**: Protected

### 2.2 Update Profile
- **Endpoint**: `PUT /user/profile`
- **Access**: Protected
- **Request Body**:
```json
{
  "full_name": "Tanvir Islam",
  "email": "tanvir@example.com",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

### 2.3 Get Profile Summary Stats
- **Endpoint**: `GET /user/stats`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "orders_count": 12,
    "wishlist_count": 5,
    "reviews_count": 8,
    "wallet_balance": 150.00
  }
}
```

### 2.4 User Saved Address Book APIs
- `GET /user/addresses` (List saved addresses)
- `POST /user/addresses` (Add new address)
- `PUT /user/addresses/:id` (Update address)
- `DELETE /user/addresses/:id` (Delete address)

---

## 📦 3. Categories & Products APIs

### 3.1 Get All Categories
- **Endpoint**: `GET /categories`
- **Access**: Public
- **Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "title": "Fresh Vegetables",
      "image_url": "https://amiraheshop.com/categories/veg.jpg",
      "product_count": 120
    }
  ]
}
```

### 3.2 Get Products (Search, Filter, Pagination)
- **Endpoint**: `GET /products`
- **Access**: Public
- **Query Params**:
  - `page`: default `1`
  - `limit`: default `20`
  - `category_id`: optional string
  - `search`: optional string (e.g. `Tomato`)
  - `sort_by`: `price_low` | `price_high` | `popular` | `newest`
- **Response Example**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_101",
        "name": "Potato Regular (± 50 Gm)",
        "category": "Fresh Vegetables",
        "brand": "Amirah Farms",
        "price": 26.00,
        "original_price": 32.00,
        "currency": "BDT",
        "rating": 4.8,
        "sold_count": 340,
        "image": "https://amiraheshop.com/products/potato.jpg",
        "in_stock": true
      }
    ],
    "pagination": { "current_page": 1, "total_pages": 5, "total_items": 98 }
  }
}
```

### 3.3 Product Details by ID
- **Endpoint**: `GET /products/:id`
- **Access**: Public
- **Response**: Full details including images array, description, sizes/weights `["100g", "250g", "500g", "1kg"]`, ratings & reviews.

### 3.4 Get Related Products
- **Endpoint**: `GET /products/:id/related`
- **Access**: Public

### 3.5 Toggle Wishlist / Favorite
- **Endpoint**: `POST /user/favorites/toggle`
- **Access**: Protected
- **Request Body**: `{ "product_id": "prod_101" }`

---

## 🛒 4. Cart & Promo Code APIs

### 4.1 Get User Cart
- **Endpoint**: `GET /cart`
- **Access**: Protected / Session token
- **Response**: List of items, quantities, subtotal, potential delivery fee, and discount summary.

### 4.2 Add / Update / Delete Cart Items
- `POST /cart/items` — `{ "product_id": "prod_101", "quantity": 2, "selected_variant": "500g" }`
- `PUT /cart/items/:id` — `{ "quantity": 3 }`
- `DELETE /cart/items/:id`
- `DELETE /cart` (Clear entire cart)

### 4.3 Validate Coupon / Promo Code
- **Endpoint**: `POST /coupons/validate`
- **Access**: Protected
- **Request Body**:
```json
{
  "coupon_code": "SAVE50",
  "cart_subtotal": 550
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "coupon_code": "SAVE50",
    "discount_type": "fixed", // "fixed" | "percentage"
    "discount_amount": 50,
    "minimum_order_amount": 300,
    "message": "Coupon SAVE50 applied successfully!"
  }
}
```

---

## 💳 5. Checkout & Order Placement APIs

### 5.1 Get Bangladesh Districts & Areas List
- **Endpoint**: `GET /locations/districts`
- **Access**: Public
- **Response**: All 64 districts & nested areas/thana list.

### 5.2 Calculate Order Summary & Shipping
- **Endpoint**: `POST /checkout/calculate`
- **Access**: Protected
- **Request Body**:
```json
{
  "district": "Dhaka",
  "area": "Mirpur",
  "coupon_code": "SAVE50",
  "items": [{ "product_id": "prod_101", "quantity": 2 }]
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "subtotal": 520,
    "delivery_charge": 60, // ৳60 Inside Dhaka, ৳120 Outside Dhaka
    "discount_amount": 50,
    "total_payable": 530
  }
}
```

### 5.3 Place Order
- **Endpoint**: `POST /checkout/place-order`
- **Access**: Protected
- **Request Body**:
```json
{
  "full_name": "Tanvir Islam",
  "phone_number": "01700000000",
  "district": "Dhaka",
  "area": "Mirpur 10",
  "house_no": "House #45, Flat #4B, Road #11",
  "locality": "Near Mirpur 10 Circle",
  "full_address": "House #45, Road #11, Block-D, Mirpur 10, Dhaka",
  "delivery_type": "Cash on Delivery", // "Cash on Delivery" | "Online Delivery"
  "payment_method": "COD", // "COD" | "bKash" | "Card"
  "note": "Call before delivery",
  "items": [
    { "product_id": "prod_101", "quantity": 2, "unit_price": 145 }
  ],
  "coupon_code": "SAVE50"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Order placed successfully!",
  "data": {
    "order_id": "ORD-2026-88421",
    "total_amount": 530,
    "payment_status": "Pending",
    "delivery_status": "Processing"
  }
}
```

### 5.4 Online Payment Initiation (bKash / Nagad / SSLCommerz / Cards)
- **Endpoint**: `POST /checkout/payment/initiate`
- **Access**: Protected
- **Request Body**: `{ "order_id": "ORD-2026-88421", "gateway": "bKash" }`
- **Response**: `{ "payment_url": "https://checkout.bkash.com/payment/...", "redirect_url": "..." }`

---

## 📋 6. Orders & Delivery History APIs

### 6.1 Get My Orders
- **Endpoint**: `GET /orders`
- **Access**: Protected
- **Query Params**: `status` (`Processing` | `Shipped` | `Delivered` | `Cancelled` | `All`)
- **Response**: List of user orders with item summary, total, and status badge.

### 6.2 Get Single Order Details
- **Endpoint**: `GET /orders/:id`
- **Access**: Protected

### 6.3 Cancel Order
- **Endpoint**: `POST /orders/:id/cancel`
- **Access**: Protected
- **Request Body**: `{ "reason": "Changed my mind" }`

### 6.4 Get Delivery History
- **Endpoint**: `GET /deliveries`
- **Access**: Protected
- **Response**: Delivered items history, rider details (Name, Phone), delivery time, and receipt info.

### 6.5 Rate Order & Delivery Rider
- **Endpoint**: `POST /deliveries/:id/rate`
- **Access**: Protected
- **Request Body**:
```json
{
  "rating": 5,
  "review": "Fast delivery and fresh products!",
  "rider_rating": 5
}
```

---

## 🔔 7. Notifications APIs

### 7.1 Get User Notifications
- **Endpoint**: `GET /notifications`
- **Access**: Protected
- **Query Params**: `category` (`All` | `Orders` | `Promos` | `System`)
- **Response**: List of notifications with unread state, timestamp, icon category, and action route.

### 7.2 Notification Actions
- `PUT /notifications/:id/read` (Mark single notification as read)
- `PUT /notifications/read-all` (Mark all notifications as read)
- `DELETE /notifications/:id` (Delete notification)
- `POST /notifications/push-token` (Register FCM Expo Push Token `{ "expo_push_token": "ExponentPushToken[xxx]" }`)

---

## ℹ️ 8. Support & Information APIs

### 8.1 Support & Content Endpoints
- `GET /support/faqs` (Help & Support FAQ list)
- `POST /support/contact` (Submit contact form or support query)
- `GET /info/terms` (Terms & Conditions text content)
- `GET /info/privacy` (Privacy & Security Policy)
- `GET /info/about` (About Us content)

---


### 🚀 A. Backend & API Suggestions
1. **Automated Firebase / Expo Push Notifications**:
   - Automated server triggers when order state changes (`Order Placed` -> `Shipped` -> `Out for Delivery` -> `Delivered`).

### 📱 B. UI & App Screen Suggestions
1. **Live Order Tracking Screen (`src/app/checkout/order-tracking.tsx`)**:
   - A dedicated live status page showing visual stepper stages (Order Received -> Packing -> Out for Delivery -> Delivered) with a call button for the assigned rider.
2. **User Address Book Management Page (`src/app/profile/addresses.tsx`)**:
   - Allows users to add, edit, and select default Home/Work delivery addresses for faster 1-click checkout.
3. **Product Review & Rating Modal (`src/app/(modal)/add-review-modal.tsx`)**:
   - Interactive star rating and image attachment modal for delivered products.
