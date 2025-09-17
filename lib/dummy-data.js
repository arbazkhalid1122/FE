// Utility function to provide dummy static data for invoice fields
export const getDummyData = (fieldName, originalValue) => {
  // If original value exists and is not null/undefined/empty, return it
  if (originalValue && originalValue !== 'N/A' && originalValue !== '') {
    return originalValue;
  }

  // Return dummy data based on field name
  const dummyData = {
    claimNumber: 'CLM-2024-001',
    insuranceName: 'Blue Cross Blue Shield',
    patientName: 'John Smith',
    invoiceNumber: 'INV-2024-001',
    outOfPocketPercentage: '15%',
    maxCoverage: '$5,000',
    dossierLiasseNumber: 'DL-2024-001',
    insuranceValueBeforeValidation: '$2,500.00',
    insuranceValuePostValidation: '$2,125.00',
    extractionProcessingTime: 2.5,
    insuredId: 'INS-2024-001',
    submissionDate: new Date().toISOString(),
    status: 'PENDING',
    extractionSuccess: true,
    extractionError: null
  };

  return dummyData[fieldName] || 'Sample Data';
};

// Helper function to format dummy data for display
export const formatDummyValue = (fieldName, originalValue) => {
  const dummyValue = getDummyData(fieldName, originalValue);
  
  // Apply specific formatting based on field type
  switch (fieldName) {
    case 'extractionProcessingTime':
      return typeof dummyValue === 'number' ? `${dummyValue.toFixed(2)}s` : dummyValue;
    case 'submissionDate':
    case 'createdAt':
      if (dummyValue instanceof Date || typeof dummyValue === 'string') {
        try {
          return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(new Date(dummyValue));
        } catch {
          return dummyValue;
        }
      }
      return dummyValue;
    default:
      return dummyValue;
  }
};
