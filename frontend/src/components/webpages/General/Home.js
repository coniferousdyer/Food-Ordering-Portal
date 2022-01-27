import React from 'react';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import BuyerDashboard from '../Buyer/BuyerDashboard';
import VendorDashboard from '../Vendor/VendorDashboard';
import animation from '../../../assets/img/animation.gif';
import { user_is_authenticated, user_type } from '../../../lib/auth';


const Home = () => {
    const matches = useMediaQuery('(min-width:480px)');

    return (
        <div>
            {!user_is_authenticated() ?
                matches ?
                    <div className="welcome-page">
                        <img 
                        src={animation} 
                        alt="Loading..."
                        style={{
                            margin: "3rem",
                            marginTop: "20rem",
                        }}
                        />
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
                <div>
                    {user_type() === 'buyer' ?
                        <BuyerDashboard />
                        :
                        <VendorDashboard />
                    }
                </div>
            }
        </div>
    );
};

export default Home;
