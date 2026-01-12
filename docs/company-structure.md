# Company Data Structure in NEXA

This document defines the data structure for information collected when a company registers in NEXA.

## Summary

When a user creates an account in NEXA, they are registering two types of information:
1. **Creator User Information** - Data of the person creating the account
2. **Company Information** - Data of the organization/company being registered

---

## 1. Creator User Information

Basic information about the person registering the company. This user will be the initial administrator of the organization.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | text | Full name of the user |
| `email` | email | Email address (used for login) |
| `password` | text | Secure password |
| `phone` | text | Contact phone number (optional but recommended) |

### Notes
- **Email must be unique in the system** (one user account per email)
- The creator user automatically becomes the company administrator for the company being created
- This user can invite other members after registration
- **A user can belong to multiple organizations** - The same user account (identified by email) can be a member of multiple companies/organizations
- When a user is added to a new organization, they use the same email but have separate roles/permissions per organization

---

## 2. Company/Organization Information

Information about the company registering in NEXA. This data validates the existence of the organization.

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
  role: string                  // e.g., "admin", "member", "viewer"
  createdAt: Date              // When user joined this company
}

interface CompleteRegistration {
  user: User
  company: Company
  membership: UserCompanyMembership  // Initial admin membership
}
```

---

## 6. Registration Flow

1. User enters their personal data (name, email, password, optional phone)
2. User enters company data (name, complete address, corporate email, phone)
3. Optionally can add additional information (website, description, industry)
4. System validates all data
5. User account is created (or verified if email already exists)
6. Company/organization is created
7. User-Company membership is created with "admin" role
8. User can later be invited to other organizations using the same email

---

## 7. Important Considerations

- **Data separation**: User email and company email can be different
- **User-Organization relationship**: Users and organizations have a many-to-many relationship
  - One user account (identified by unique email) can belong to multiple organizations
  - When a user creates a company, they become a member of that organization
  - The same user can later be invited/added to other organizations using the same email
  - Each organization membership has its own role and permissions
- **Scalability**: The structure allows adding more fields in the future without breaking the base structure
- **Flexibility**: Optional fields allow companies of different sizes to register comfortably
- **Basic validation**: Focuses on essential validations; more complex validations can be added later
