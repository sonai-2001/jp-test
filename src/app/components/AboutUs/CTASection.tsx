import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

interface CTABannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  gradientColors?: [string, string];
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  onButtonClick?: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  title = "Get High-Quality Pneumatic Tools from A Reliable Supplier",
  description = "Jaypee Associates delivers products engineered for durability and designed for productivity",
  buttonText = "Get Quote",
  gradientColors = ["#1976d2", "#1565c0"],
  backgroundColor,
  textColor = "white",
  buttonColor = "white",
  buttonTextColor = "#1976d2",

}) => {
 const router= useRouter()
  const backgroundStyle = backgroundColor 
    ? { backgroundColor }
    : { background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})` };

    const onButtonClick = () => {
      router.push('/contactus');
    };

  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Paper 
          sx={{ 
            ...backgroundStyle,
            p: 4,
            color: textColor,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <Typography variant="h3" component={'h2'} sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 2 }}>
            {title}
          </Typography>
          <Typography variant="body1" component={'p'} sx={{ fontSize: '1.25rem', mb: 3, opacity: 0.9 }}>
            {description}
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={onButtonClick}
            sx={{ 
              bgcolor: buttonColor, 
              color: buttonTextColor, 
              '&:hover': { 
                bgcolor: buttonColor === 'white' ? '#f5f5f5' : `${buttonColor}DD` 
              } 
            }}
          >
            {buttonText}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CTABanner;