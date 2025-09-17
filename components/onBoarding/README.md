# Financial Preferences Drawer

A React component for collecting financial preferences from users in a drawer/sidebar interface.

## Features

- **Two Input Fields:**
  - Minimum deploy amount (numeric input)
  - Monthly invoice count (numeric input)
- **Responsive Design:** Works on both mobile and desktop
- **Form Validation:** Validates required fields and numeric values
- **API Integration:** Saves data to backend via REST API
- **Consistent Styling:** Matches the existing design system

## Usage

```jsx
import { FinancialPreferencesDrawer } from "@/components/onBoarding/financial-preferences-drawer"

function MyComponent() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleComplete = (data) => {
    console.log("Financial preferences saved:", data.financialData)
    // Handle completion logic
  }

  const handleCancel = () => {
    setIsDrawerOpen(false)
  }

  return (
    <FinancialPreferencesDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls drawer visibility |
| `onOpenChange` | `function` | Yes | Callback when drawer open state changes |
| `onComplete` | `function` | No | Callback when form is successfully submitted |
| `onCancel` | `function` | No | Callback when user cancels or closes drawer |

## Form Fields

### 1. Minimum Deploy Amount
- **Label:** "What's the minimum amount you want to deploy?"
- **Type:** Number input
- **Placeholder:** "Enter amount in XOF"
- **Validation:** Required, must be positive number

### 2. Monthly Invoice Count
- **Label:** "How many invoices can you finance monthly with an average of 150,000XOF"
- **Type:** Number input
- **Placeholder:** "Enter number of invoices"
- **Validation:** Required, must be positive number

## API Endpoints

The component uses the following API endpoints:

### POST `/api/financial-preferences`
Creates new financial preferences.

**Request Body:**
```json
{
  "minimumDeployAmount": 1000000,
  "monthlyInvoiceCount": 5
}
```

**Response:**
```json
{
  "message": "Financial preferences saved successfully",
  "data": {
    "id": "uuid",
    "minimumDeployAmount": 1000000,
    "monthlyInvoiceCount": 5,
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET `/api/financial-preferences`
Fetches user's financial preferences.

### PUT `/api/financial-preferences`
Updates existing financial preferences.

## Styling

The component uses Tailwind CSS classes and follows the existing design system:

- **Colors:** Gray-900 for primary buttons, blue-500 for focus states
- **Spacing:** Consistent padding and margins
- **Typography:** Standard font weights and sizes
- **Borders:** Rounded corners with gray borders
- **Responsive:** Mobile-first design with breakpoints

## Mobile vs Desktop

- **Mobile:** Uses Sheet component (full-screen drawer)
- **Desktop:** Uses Sidebar component (fixed positioned sidebar)

## Error Handling

- Form validation for required fields
- Numeric validation for input values
- API error handling with user-friendly messages
- Loading states during API calls

## Dependencies

- React 18+
- Next.js 13+
- Tailwind CSS
- Lucide React (for icons)
- Radix UI components (Sheet, Sidebar)
- Custom UI components (Button, Input, Label)
