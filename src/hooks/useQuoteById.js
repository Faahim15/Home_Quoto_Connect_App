export const useQuoteById = (quotesData, quoteId) => {
  if (!Array.isArray(quotesData) || !quoteId) return null;

  return quotesData.find((item) => item?._id === quoteId) || null;
};
