import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

export const Icon = ({ children, title, className, ariaLabel, onClick }) => {
    return (
        <Tooltip title={title} arrow>
        <IconButton
          onClick={onClick}
          aria-label={ariaLabel}
          className={className}
        >
          {children}
        </IconButton>
      </Tooltip>
    );
};
