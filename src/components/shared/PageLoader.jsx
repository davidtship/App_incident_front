import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          return 100;
        }
        return oldProgress + 10;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h6" mb={2}>
        Chargement des données...
      </Typography>

      <Box sx={{ width: '30%', minWidth: 220 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <Typography variant="caption" mt={1}>
        {progress}%
      </Typography>
    </Box>
  );
};

export default PageLoader;
