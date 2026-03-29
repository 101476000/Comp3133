# Employee Management System - COMP3133 Assignment 2

Angular-based Employee Management System with GraphQL backend, featuring authentication, CRUD operations, search, and responsive UI.

**Student ID:** 101476000  
**Submission:** Full Stack Development II (COMP3133) - Assignment 2

---

## 📋 Project Overview

This is a **Full Stack Application** consisting of:

- **Frontend**: Angular 17 with TypeScript, Reactive Forms, Apollo GraphQL Client
- **Backend**: Node.js/Express with Apollo GraphQL Server, MongoDB integration
- **Authentication**: JWT-based session management
- **Features**: Complete CRUD for employees, search/filter by department and position, responsive design

---

## ✨ Features

✅ **User Authentication**
- Login with email and password
- Signup with form validation
- Session management with JWT tokens stored in localStorage
- Protected routes with auth guards

✅ **Employee Management**
- View all employees in a responsive table
- Add new employees with form validation
- Edit employee information
- Delete employees with confirmation
- View detailed employee information in modal

✅ **Search & Filter**
- Filter employees by department
- Filter employees by position
- Search by name or email
- Real-time filtering

✅ **Professional UI/UX**
- Material Design aesthetics
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Clean, intuitive interface
- Profile picture support

---

## 🏗️ Project Structure

```
101476000_comp3133_assignment2/
├── docker-compose.yml          # Docker compose configuration
├── .gitignore                  # Git ignore rules
├── 
├── frontend/                   # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts
│   │   │   │   └── interceptors/
│   │   │   │       └── auth.interceptor.ts
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── signup/
│   │   │   │   ├── dashboard/
│   │   │   │   └── employee/
│   │   │   │       ├── employee-list/
│   │   │   │       └── employee-form/
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts
│   │   │   │   └── employee.model.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       └── employee.service.ts
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.scss
│   ├── package.json
│   ├── tsconfig.json
│   ├── angular.json
│   ├── vercel.json
│   └── Dockerfile
│
└── backend/                    # Node.js/GraphQL Backend
    ├── src/
    │   ├── graphql/
    │   │   ├── typeDefs.ts
    │   │   └── resolvers.ts
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    ├── Dockerfile
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For version control
- **MongoDB**: For database (local or Atlas)
- **Docker** (Optional): For containerized deployment

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/101476000_comp3133_assignment2.git
cd 101476000_comp3133_assignment2
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### 3. Backend Setup

```bash
cd ../backend
npm install
```

#### 4. Environment Variables

Create `.env` file in backend directory:

```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employees
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will be available at: `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will be available at: `http://localhost:4200`

#### Option 2: Docker Compose (Recommended for Production)

```bash
docker-compose up --build
```

This will start:
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:4200`
- MongoDB on `mongodb://localhost:27017`

---

## 🔐 Authentication

### Default Credentials (Development)

The system uses JWT authentication. After signup, users can login with their credentials.

**Login Page**: `http://localhost:4200/login`
**Signup Page**: `http://localhost:4200/signup`

### Session Management

- JWT token stored in `localStorage` with key `auth_token`
- Token automatically included in GraphQL requests via HTTP interceptor
- Session persists across page refreshes
- Logout clears token and redirects to login

---

## 📊 Database Schema

### Employee Collection

```typescript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  department: String,
  position: String,
  salary: Number,
  joinDate: Date,
  profilePicture: String (URL),
  address: String,
  city: String,
  country: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection

```typescript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📡 GraphQL API Endpoints

### Queries

```graphql
# Get current user
query GetCurrentUser {
  currentUser {
    id
    email
    firstName
    lastName
  }
}

# Get all employees (with optional filters)
query GetAllEmployees($department: String, $position: String) {
  employees(department: $department, position: $position) {
    _id
    firstName
    lastName
    email
    department
    position
    salary
  }
}

# Get single employee
query GetEmployee($id: ID!) {
  employee(id: $id) {
    _id
    firstName
    lastName
    email
    phone
    department
    position
    salary
  }
}
```

### Mutations

```graphql
# Login
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      firstName
    }
  }
}

# Create Employee
mutation CreateEmployee($firstName: String!, ...) {
  createEmployee(
    firstName: $firstName
    lastName: $lastName
    email: $email
    ...
  ) {
    _id
    firstName
  }
}

# Update Employee
mutation UpdateEmployee($id: ID!, $firstName: String, ...) {
  updateEmployee(id: $id, firstName: $firstName, ...) {
    _id
    firstName
  }
}

# Delete Employee
mutation DeleteEmployee($id: ID!) {
  deleteEmployee(id: $id) {
    _id
  }
}
```

---

## 🎨 UI Components

### Pages

1. **Login Page** (`/login`)
   - Email and password inputs
   - Form validation
   - Link to signup
   - Error messaging

2. **Signup Page** (`/signup`)
   - First name, last name, email, password
   - Password confirmation validation
   - Link to login
   - Error messaging

3. **Dashboard** (`/dashboard`)
   - Navigation bar with user info
   - Logout button
   - Access to employee features

4. **Employee List** (`/dashboard`)
   - Table view of all employees
   - Department and position filters
   - Search functionality
   - View details modal
   - Edit and delete buttons
   - Add employee button

5. **Add/Edit Employee** (`/dashboard/add`, `/dashboard/edit/:id`)
   - Comprehensive form with validation
   - Personal information section
   - Job information section
   - Profile picture URL input
   - Save and cancel buttons

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Desktop**: 1200px and above (full layout)
- **Tablet**: 768px - 1199px (adjusted spacing)
- **Mobile**: 320px - 767px (stacked layout, optimized buttons)

---

## 🔄 API Integration

### Apollo Client Configuration

The frontend uses Apollo Client for GraphQL integration:

```typescript
// Apollo is configured in main.ts with:
// - HTTP Link for queries/mutations
// - Auth Interceptor for JWT tokens
// - Error Link for error handling
// - In-Memory Cache for caching
```

### Error Handling

- GraphQL errors logged to console
- Network errors caught and displayed to user
- Authentication errors redirect to login
- User-friendly error messages in UI

---

## 📝 Form Validation

### Login Form
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Signup Form
- First Name: Required
- Last Name: Required
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Must match password field

### Employee Form
- First Name: Required
- Last Name: Required
- Email: Required, valid email format
- Phone: Required
- Department: Required, dropdown selection
- Position: Required, dropdown selection
- Salary: Required, minimum 0
- Join Date: Required, date picker
- Address: Optional
- City: Optional
- Country: Optional
- Profile Picture: Optional, URL format

---

## 🚢 Deployment

### Deploy to Vercel

1. **Create Vercel Account**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - In Vercel Dashboard: Settings → Environment Variables
   - Add `GRAPHQL_ENDPOINT`: Your backend GraphQL URL

4. **Backend Deployment**
   - Deploy backend separately (Railway, Heroku, or your preferred platform)
   - Update frontend's GRAPHQL_ENDPOINT to backend URL

### Deploy to GitHub

1. **Initialize Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Employee Management System"
   ```

2. **Create GitHub Repository**
   - Go to github.com and create new repository
   - Name: `101476000_comp3133_assignment2`

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/101476000_comp3133_assignment2.git
   git branch -M main
   git push -u origin main
   ```

4. **Regular Commits**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push
   ```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Signup with new account
- [ ] View all employees
- [ ] Filter by department
- [ ] Filter by position
- [ ] Search by name
- [ ] Add new employee
- [ ] View employee details
- [ ] Edit employee information
- [ ] Delete employee
- [ ] Logout and verify redirect
- [ ] Test responsive design on mobile

---

## 📦 Build & Production

### Build for Production

```bash
cd frontend
npm run build
```

Output: `dist/101476000-comp3133-assignment2/`

### Serve Production Build Locally

```bash
cd frontend
npm install -g http-server
http-server dist/101476000-comp3133-assignment2 -p 4200
```

---

## 🔧 Technologies Used

### Frontend
- **Angular 17**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **Apollo Client**: GraphQL client
- **RxJS**: Reactive programming
- **Tailwind CSS**: Utility-first CSS (optional)
- **Material Design**: UI components styling

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Apollo Server**: GraphQL server
- **MongoDB**: NoSQL database
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin requests

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Vercel**: Frontend hosting
- **GitHub**: Version control

---

## 📝 Assignment Requirements Checklist

- [x] Application Setup with proper folder structure
- [x] GitHub repository with regular commits
- [x] Routing: Login → Signup → Dashboard → Employees
- [x] Login and Signup screens with validation
- [x] Session management with JWT tokens
- [x] Employee list display in table format
- [x] CRUD operations using GraphQL
- [x] Add employee form with file upload support
- [x] View employee details modal
- [x] Edit employee information
- [x] Delete employee with confirmation
- [x] Search and filter by department/position
- [x] Professional UI/UX with Material Design
- [x] Responsive design (mobile, tablet, desktop)
- [x] Logout functionality with redirect
- [x] Docker containerization
- [x] Vercel deployment configuration

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend (port 4200)
ng serve --port 4201

# Backend (port 4000)
PORT=4001 npm run dev
```

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP whitelist in MongoDB Atlas (if using cloud)

### CORS Issues
- Verify backend CORS is configured correctly
- Check frontend API endpoint URL
- Ensure credentials included in requests

### Apollo Cache Issues
```typescript
// Clear Apollo cache in browser console
localStorage.removeItem('apollo-cache-persist');
```

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.io)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Documentation](https://graphql.org)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)

---

## 👨‍💻 Author

**Carlos Figuera**  
Student ID: 101476000  
George Brown College - Toronto

---

## 📄 License

MIT License - Feel free to use this project for educational purposes.

---

## 🎓 Notes for Submission

This project fulfills all requirements for COMP3133 Assignment 2:
1. ✅ Proper project structure with frontend and backend folders
2. ✅ GitHub repository with descriptive commits
3. ✅ Complete authentication system
4. ✅ Full CRUD operations via GraphQL
5. ✅ Search and filter functionality
6. ✅ Professional and responsive UI
7. ✅ Docker containerization
8. ✅ Ready for Vercel deployment

**Live Demo**: [Update with your Vercel URL]
**GitHub Repository**: [Update with your GitHub URL]

---

**Last Updated**: March 2024
**Version**: 1.0.0
