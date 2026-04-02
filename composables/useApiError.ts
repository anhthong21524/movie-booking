export const useApiError = () => {
  const getMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message
    }

    return 'An unexpected error occurred.'
  }

  return {
    getMessage,
  }
}
