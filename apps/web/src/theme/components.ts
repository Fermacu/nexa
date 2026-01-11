import { Components } from '@mui/material/styles'

export const components: Components = {
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.8)',
          },
          '&.Mui-error fieldset': {
            borderColor: '#f44336',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-focused': {
            color: 'rgba(255, 255, 255, 0.9)',
          },
          '&.Mui-error': {
            color: '#f44336',
          },
        },
        '& .MuiInputBase-input': {
          color: '#ffffff',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1,
          },
        },
        '& .MuiFormHelperText-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-error': {
            color: '#f44336',
          },
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        '&.Mui-focused': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
}
