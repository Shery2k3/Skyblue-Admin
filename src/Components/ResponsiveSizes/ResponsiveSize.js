import { useMediaQuery } from 'react-responsive';

const useResponsiveButtonSize = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const isMediumScreen = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  
  // Determine the button size based on screen size
  if (isSmallScreen) {
    return 'small';
  } else if (isMediumScreen) {
    return 'middle';
  } else {
    return 'large';
  }
};

export default useResponsiveButtonSize;
