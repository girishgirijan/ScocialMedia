import { Typography, useTheme, Box } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <Box className="boxShadow">
      <WidgetWrapper>
        <FlexBetween>
          <Typography color={dark} variant="h5" fontWeight="500">
            Sponsored
          </Typography>
          <Typography color={medium}>Create Ad</Typography>
        </FlexBetween>
        <img
          width="100%"
          height="auto"
          alt="advert"
          src="http://localhost:3001/assets/info4.jpeg"
        />
        <FlexBetween>
          <Typography color={main}>Nila's Cosmetics</Typography>
          <Typography color={medium}>www.nilascosmetics.com</Typography>
        </FlexBetween>
        <Typography color={medium} m="0.5rem 0">
          Your pathway to stunning and immaculate beauty and made sure your skin
          is exfoliating skin and shining like light.
        </Typography>
      </WidgetWrapper>
    </Box>
  );
};

export default AdvertWidget;
