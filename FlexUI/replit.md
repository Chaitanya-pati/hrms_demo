# HRMS - Human Resource Management System

## Overview

This is a comprehensive Human Resource Management System (HRMS) built as a frontend-only application using vanilla HTML, CSS, and JavaScript with local storage for data persistence. The system covers all major HR modules including:

**Core HR Modules:**
- Employee Management (master data, profiles, personal information)  
- Recruitment & Onboarding (job postings, applications, hiring process)
- Organization Structure (departments, positions, reporting hierarchy)

**Time & Attendance:**
- Time & Attendance tracking with check-in/check-out
- Shift Management (morning, evening, night shifts)
- Leave Management (annual, sick, personal, maternity leave)

**Payroll & Benefits:**
- Payroll Processing (base salary, allowances, deductions)
- Benefits Administration (health insurance, dental, 401k, provident fund)
- Expense Management (travel, office expenses, reimbursements)

**Performance & Development:**
- Performance Management (reviews, goal tracking, ratings)
- Learning & Development (training programs, skills assessment)
- Talent Management (high performers, career planning, succession)

**Employee Engagement:**
- Employee Engagement (surveys, satisfaction scores, recognition)
- Communication Hub (announcements, employee directory)

**Analytics & Compliance:**
- HR Analytics (workforce metrics, attrition analysis, key indicators)
- Compliance Management (labor law, tax compliance, audit trails)

**Self Service Portals:**
- Employee Self Service (profile management, leave applications, payslips)
- Manager Self Service (team overview, approvals, performance tracking)

**System Administration:**
- System Configuration (company settings, user management)
- Export & Reports (data export, backup & restore functionality)

The application is designed for demo purposes with a fully responsive interface featuring sidebar navigation, data tables, forms, charts for visualization, and comprehensive coverage of HR processes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only Architecture
- **Vanilla HTML, CSS, JavaScript**: Pure frontend implementation for maximum compatibility
- **Local Storage**: Client-side data persistence for demo purposes
- **Responsive Design**: Mobile-first CSS with Flexbox and Grid layouts
- **Component-Based Structure**: Modular JavaScript classes for code organization
- **Event-Driven Architecture**: DOM event handling for user interactions

### Data Management
- **Local Storage API**: Browser-based data persistence
- **JSON Data Format**: Structured data storage for employees, departments, attendance, etc.
- **In-Memory Processing**: Client-side data manipulation and filtering
- **Export/Import**: JSON-based data export and backup functionality

### Navigation & Routing
- **Single Page Application**: Dynamic content switching without page reloads
- **Sidebar Navigation**: Organized by HR module categories
- **Section-Based Routing**: JavaScript-managed content visibility
- **Mobile Responsive**: Collapsible sidebar for mobile devices

### UI Components & Styling
- **Custom CSS Framework**: Tailored styles for HR-specific components
- **FontAwesome Icons**: Comprehensive icon library for UI elements
- **Chart.js Integration**: Data visualization for analytics and reports
- **Modal System**: Overlay components for forms and detailed views
- **Form Validation**: Client-side validation with user feedback

### User Experience Features
- **Real-time Updates**: Instant UI updates after data changes
- **Search & Filter**: Client-side data filtering capabilities
- **Sorting**: Table column sorting functionality
- **Notifications**: Toast-style user feedback system
- **Loading States**: Visual feedback during operations

### HR Module Organization
- **Categorized Navigation**: Modules grouped by functional areas
- **Consistent Layout**: Standardized page structure across all modules
- **Data Tables**: Sortable, searchable data presentation
- **Action Buttons**: Context-appropriate CRUD operations
- **Statistics Displays**: Key metrics and dashboard widgets

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting platform
- **PostgreSQL**: Primary relational database for data persistence

### UI and Styling
- **Radix UI**: Unstyled, accessible UI primitives for React components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Consistent icon library for user interface elements
- **Google Fonts**: Inter font family for typography

### Development Tools
- **Vite**: Next-generation frontend build tool with HMR support
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking for JavaScript development

### Form and Data Management
- **React Hook Form**: Performant forms library with validation support
- **Zod**: TypeScript-first schema validation library
- **TanStack Query**: Powerful data synchronization for React applications

### Charts and Visualization
- **Chart.js**: Canvas-based charting library for data visualization
- **Recharts**: Composable charting library built on React components

### Additional Libraries
- **Date-fns**: Modern JavaScript date utility library
- **Nanoid**: URL-safe unique string ID generator
- **clsx**: Utility for constructing className strings conditionally