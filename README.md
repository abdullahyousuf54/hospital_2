# 📚 Library Management System — Backend API

A production-ready REST API built with **Node.js**, **Express.js**, and **MongoDB** for managing a complete library workflow.

## Features

- Category management (create/update/delete/list)
- Book management (add/edit/delete/list/search)
- Member management (register/edit/delete/list/search)
- Book issue and return workflow
- Due-date tracking and overdue listing
- Member borrowing history

## 📁 Project Structure

```text
library-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── bookController.js
│   ├── borrowController.js
│   ├── categoryController.js
│   └── memberController.js
├── middleware/
│   └── errorMiddleware.js
├── models/
│   ├── Book.js
│   ├── BorrowRecord.js
│   ├── Category.js
│   └── Member.js
├── routes/
│   ├── bookRoutes.js
│   ├── borrowRoutes.js
│   ├── categoryRoutes.js
│   └── memberRoutes.js
├── .env
├── package.json
├── server.js
└── README.md
```

## Database Schema (MongoDB Collections)

### `categories`
- `name` (unique, required)
- `description`
- `createdAt`, `updatedAt`

### `books`
- `title`, `author`, `isbn` (unique)
- `category` (ObjectId -> categories)
- `totalCopies`, `availableCopies`
- `publishedYear`, `location`
- `createdAt`, `updatedAt`

### `members`
- `fullName`, `email` (unique), `phoneNumber`
- `membershipId` (unique), `membershipType`
- `status`
- `createdAt`, `updatedAt`

### `borrowrecords`
- `member` (ObjectId -> members)
- `book` (ObjectId -> books)
- `issueDate`, `dueDate`, `returnedAt`
- `status` (`Issued`, `Returned`, `Overdue`)
- `issuedBy`, `returnNotes`
- `createdAt`, `updatedAt`

## API Endpoints

### Categories
- `POST /api/categories` - Create category
- `GET /api/categories` - List categories
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Books
- `POST /api/books` - Add book
- `GET /api/books` - List books (supports `?category=<id>&availableOnly=true`)
- `GET /api/books/search?q=clean+code` - Search books
- `GET /api/books/:id` - Get single book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `POST /api/members` - Register member
- `GET /api/members` - List members
- `GET /api/members/search?name=ashish` - Search members
- `GET /api/members/:id` - Get single member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/:id/history` - Member borrowing history

### Borrow / Return
- `POST /api/borrows/issue` - Issue book
- `PUT /api/borrows/return/:recordId` - Return book
- `GET /api/borrows` - List borrow records
  - `?status=Issued`
  - `?memberId=<id>`
  - `?overdue=true`

## Quick Start

1. Install dependencies
```bash
npm install
```

2. Set environment values
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/librarydb
PORT=5000
NODE_ENV=development
```

3. Run the API
```bash
npm run dev
```

4. Health check
```bash
GET http://localhost:5000/
```
