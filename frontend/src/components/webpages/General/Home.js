import React from 'react';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { user_is_authenticated } from '../../../lib/auth';


const Home = () => {
    const matches = useMediaQuery('(min-width:480px)');

    return (
        <div>
            {!user_is_authenticated() ?
                matches ?
                <div className="welcome-page">
                    <Typography className="welcome-heading" variant="h2" component="h1">
                        Welcome to the Food Ordering Portal
                    </Typography>
                    <Typography variant="h6" component="h1">
                        Please login or register to continue
                    </Typography>
                </div>
                : 
                <div className="welcome-page">
                    <Typography className="welcome-heading" variant="h4" component="h1">
                        Welcome to the Food Ordering Portal
                    </Typography>
                    <Typography variant="h6" component="h1">
                        Please login or register to continue
                    </Typography>
                </div>
                :
                // TODO_BY_ARJUN: ADD THE REST HERE
                <h1>Duh</h1>
            }
        </div>
    );
};

export default Home;
