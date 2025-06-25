/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { Box } from '@mui/material';

import { Navigation } from '../Navigation';
import { Header } from '../Header';
import { Footer } from '../Footer';

import { FOOTER_HEIGHT } from '../../utils/constants';
import { TableAgGrid } from '../TableAgGrid';
import { FormJson } from '../FormJson';
import { MainContent } from '../MainContent';

interface LayoutProps {
	children: React.ReactNode;
  }
  
export const Layout: FC = ({ children }: LayoutProps) => {
	const [open, setOpen] = useState(false);
	const toggleNavigation = () => setOpen((status) => !status);

	return (
		<div
			css={css`
				min-height: 100vh;
			`}
		>
			<div
				css={css`
					display: flex;
					min-height: calc(100vh - ${FOOTER_HEIGHT}px);
				`}
			>
				<Box component='header'>
					<Header toggleNavigation={toggleNavigation} />
				</Box>
				<Navigation open={open} handleClose={toggleNavigation} />
				<MainContent open={open} handleClose={toggleNavigation} />
				{/* 
				<Box component='main' sx={{ flexGrow: 1, p: 3, pt: 10 }}>
					{children}					
				</Box> */}
			</div>
			<Box component='footer'>
				<Footer />
			</Box>
		</div>
	);
};
