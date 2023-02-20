import { styled } from '@mui/system';
import { Box } from '@mui/material';

const LoadingPanel = styled(Box)(({ loading }) => ({
  display: !loading ? 'none' : 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  height: '92%',
}));

export default LoadingPanel;
