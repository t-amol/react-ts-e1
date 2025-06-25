import React from 'react';
import { CSSObject, Theme } from '@mui/material';
import { Box, Typography, Button } from '@mui/material';
import { HEADER_HEIGHT, FOOTER_HEIGHT, DRAWER_WIDTH } from '../../utils/constants';
import { styled } from '@mui/system';
import { navClosedMixin, navOpenedMixin } from '../../styles/mixins';
import { TableAgGrid } from '../TableAgGrid';

// Define the type for the props (if any) — for now, we'll assume no props
interface MainContentProps {
	open: boolean | undefined;
	handleClose: () => void;
}

export const MainContent = ({ open, handleClose }: MainContentProps) => {

//export const MainContent: React.FC<MainContentProps> = ({ open, handleClose }: MainContentProps) => {
	
  return (
    <MainBox open={open} onClose={handleClose}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Users
      </Typography>
	  <TableAgGrid/>
    </MainBox>
  );
};

const headerFooterHeight = HEADER_HEIGHT + FOOTER_HEIGHT;

const MainBox = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
		position: 'absolute',  // Absolute positioning
        top: HEADER_HEIGHT,                // Position at the top of the viewport
        left: DRAWER_WIDTH,               // Position at the left of the viewport

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        backgroundColor: '#f4f4f4',
        borderRadius: 2,
        boxShadow: 2,
		minWidth:  `calc(100vw - ${DRAWER_WIDTH}px)`,
        margin: 'auto',
        minHeight: `calc(100vh - ${headerFooterHeight}px)`, // Adjust for header height if needed
		zIndex: 10,


	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...navOpenedMixin(theme),
		'& .MuiDrawer-paper': navOpenedMixin(theme),
	}),
	...(!open && {
		...navClosedMixin(theme),
		'& .MuiDrawer-paper': navClosedMixin(theme),
	}),
}));
