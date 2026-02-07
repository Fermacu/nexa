# Company Data Structure in NEXA

This document defines the data structure for user registration and company creation in NEXA.

## Summary

When a user creates an account in NEXA, they register only their personal information. Organizations/companies are created separately from the user profile page after registration:
1. **User Information** - Data of the person creating the account (collected during registration)
2. **Company Information** - Data of the organization/company (created later from the profile page)

---

## 1. User Information

Basic information about the person creating the account. This information is collected during user registration.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | text | Full name of the user |
| `email` | email | Email address (used for login) |
| `password` | text | Secure password |
| `phone` | text | Contact phone number (optional but recommended) |

### Notes
- **Email must be unique in the system** (one user account per email)
- Users can register without creating an organization (useful for collaborators who will be added to organizations later)
- **A user can belong to multiple organizations** - The same user account (identified by email) can be a member of multiple companies/organizations
- When a user creates an organization, they automatically become the administrator of that organization
- When a user is added to a new organization, they use the same email but have separate roles/permissions per organization

---

## 2. Company/Organization Information

Information about the company/organization created in NEXA. This data is collected when a user creates a new organization from their profile page. This data validates the existence of the organization.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | text | Official company name |
| `address` | object | Physical address of the company (see details below) |
| `email` | email | Corporate email address of the company |
| `phone` | text | Main phone number of the company |
| `createdAt` | date | Date when registered in NEXA (automatic) |

### Optional Fields (Recommended)

| Field | Type | Description |
|-------|------|-------------|
| `website` | text | Company website URL |
| `description` | text | Brief description of the company |
| `industry` | text | Industry or sector the company belongs to |

---

## 3. Detailed Address Structure

The address is an object with the following fields:

```
address: {
  street: string          // Street and number
  city: string           // City
  state: string          // State or province
  postalCode: string     // Postal code
  country: string        // Country
}
```

**All address fields are required** to validate the physical existence of the company.

---

## 4. Data Validation

### Minimum Validations

1. **User email**: Must be unique, valid email format
2. **Company email**: Valid email format, can be different from user email
3. **Phone**: Valid format (allows different international formats)
4. **Company name**: Must be unique in the system, minimum 2 characters, maximum 200 characters
5. **Address**: All required fields must be complete

### Future Validations (Consider)

- Email verification via confirmation code
- Phone verification via SMS
- Business existence validation (public records, if applicable)

---

## 5. Proposed Data Structure (TypeScript Format)

For technical reference, this is the suggested structure:

```typescript
interface User {
  id: string            // Unique user ID
  name: string          // Required
  email: string         // Required, unique (one account per email)
  password: string      // Required (hashed)
  phone?: string        // Optional
  createdAt: Date       // Automatic
}

interface CompanyAddress {
  street: string        // Required
  city: string          // Required
  state: string         // Required
  postalCode: string    // Required
  country: string       // Required
}

interface Company {
  id: string                    // Unique company ID
  name: string                  // Required, unique in the system
  address: CompanyAddress       // Required
  email: string                 // Required
  phone: string                 // Required
  website?: string              // Optional
  description?: string          // Optional
  industry?: string             // Optional
  createdAt: Date              // Automatic
}

// Many-to-many relationship between users and companies
interface UserCompanyMembership {
  userId: string                // Reference to User
  companyId: string             // Reference to Company
  role: string                  // e.g., "owner", "admin", "member", "viewer"
  createdAt: Date              // When user joined this company
}

interface CompleteRegistration {
  user: User
  company: Company
  membership: UserCompanyMembership  // Initial admin membership
}
```

---

## 6. Registration and Company Creation Flow

### User Registration Flow:
1. User enters their personal data (name, email, password, optional phone)
2. System validates user data
3. User account is created in Firebase Auth and Firestore
4. User can now log in and access their profile

### Company Creation Flow (from Profile):
1. User navigates to Profile → Organizations tab
2. User clicks "Crear nueva organización"
3. User enters company data (name, complete address, corporate email, phone)
4. Optionally can add additional information (website, description, industry)
5. System validates all company data
6. Company/organization is created in Firestore
7. User-Company membership is created with "owner" role (the creator becomes the owner of the organization)
8. User can create multiple organizations or be invited to other organizations using the same email

---

## 7. Important Considerations

- **Data separation**: User email and company email can be different
- **Registration flexibility**: Users can register without creating an organization, allowing collaborators to create accounts and be added to organizations later by administrators
- **User-Organization relationship**: Users and organizations have a many-to-many relationship
  - One user account (identified by unique email) can belong to multiple organizations
  - When a user creates a company, they automatically become the **owner** of that organization
  - The owner role has the highest level of permissions and can perform sensitive operations
  - Administrators can also manage the organization but with some restrictions compared to owners
  - The same user can later be invited/added to other organizations using the same email
  - Each organization membership has its own role and permissions
- **Scalability**: The structure allows adding more fields in the future without breaking the base structure
- **Flexibility**: Optional fields allow companies of different sizes to register comfortably
- **Basic validation**: Focuses on essential validations; more complex validations can be added later
