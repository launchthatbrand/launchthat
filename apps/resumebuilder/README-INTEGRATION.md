# Resume Builder External Integration Guide

This guide explains how to integrate the Resume Builder application with external websites, allowing users to seamlessly import their data from your platform into our resume builder.

## Overview

The integration follows these steps:

1. Your website collects user data (work experience, education, skills, etc.)
2. You format this data according to our schema
3. You send this data to our API endpoint
4. The API returns a token and redirect URL
5. You redirect the user to our application with this URL
6. Our application automatically imports and displays the user's data

## Data Schema

The Resume Builder accepts data in the following JSON format:

```json
{
  "personalInfo": {
    "fullName": "String",
    "title": "String",
    "email": "String",
    "phone": "String",
    "location": "String",
    "website": "String",
    "summary": "String",
    "profileImage": "String (base64 or URL)"
  },
  "workExperience": [
    {
      "id": "String (unique identifier)",
      "value": "String (formatted work experience entry)"
    }
  ],
  "education": [
    {
      "id": "String (unique identifier)",
      "value": "String (formatted education entry)"
    }
  ],
  "skills": [
    {
      "id": "String (unique identifier)",
      "value": "String (skill name)"
    }
  ],
  "template": "String (template name: modern, professional, minimalist, creative, corporate)",
  "customSections": {
    "sectionId": {
      "title": "String (section title)",
      "items": [
        {
          "id": "String (unique identifier)",
          "value": "String (section item text)"
        }
      ]
    }
  }
}
```

All fields are optional, but we recommend providing as much information as possible for the best user experience.

## API Endpoint

Send a POST request to our API endpoint with the formatted resume data:

```
POST /api/receive-data
Content-Type: application/json

{
  // Resume data as described in the schema above
}
```

### API Response

The API will respond with:

```json
{
  "success": true,
  "token": "unique-session-token",
  "redirectUrl": "/import?token=unique-session-token"
}
```

## Implementation Example

Here's a complete JavaScript implementation example:

```javascript
async function sendToResumeBuilder(resumeData) {
  try {
    // Replace with your actual Resume Builder URL
    const resumeBuilderUrl = "https://your-resume-builder.com/api/receive-data";

    const response = await fetch(resumeBuilderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to send resume data");
    }

    if (result.redirectUrl) {
      // Redirect the user to the Resume Builder with their data
      window.location.href = `https://your-resume-builder.com${result.redirectUrl}`;
    }
  } catch (error) {
    console.error("Error sending data to Resume Builder:", error);
    // Handle error appropriately in your UI
  }
}

// Example usage
const resumeData = {
  personalInfo: {
    fullName: "John Doe",
    title: "Software Engineer",
    email: "john@example.com",
  },
  workExperience: [
    {
      id: "exp1",
      value:
        "Senior Developer at Tech Corp | 2019-Present | Led development of the company's main web application.",
    },
  ],
  // Add more fields as needed
};

// Call when user wants to export their data to the Resume Builder
sendToResumeBuilder(resumeData);
```

## Security Considerations

- The data is stored in an encrypted HTTP-only cookie that expires after 10 minutes
- The cookie is accessible only on the Resume Builder domain
- Each import request generates a unique session token
- The data is automatically cleared after successful import

## Testing the Integration

We provide an example HTML page in the `/examples` directory that demonstrates the integration. To test:

1. Start the Resume Builder application locally
2. Open the example HTML page in your browser
3. Click the "Send to Resume Builder" button
4. You should be redirected to the Resume Builder with sample data

## Troubleshooting

Common issues:

- **CORS errors**: Make sure your domain is allowed to make requests to our API
- **Invalid data format**: Ensure your data follows our schema exactly
- **Redirect doesn't work**: Verify you're using the complete URL including the domain

For further assistance, please contact our development team.

## Advanced Integration

For more advanced integration scenarios, such as server-to-server communication or handling many users' data, please contact us for custom integration options.
