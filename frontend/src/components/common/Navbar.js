import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';

import { user_is_authenticated, user_logout } from '../../lib/auth';

const Navbar = () => {
    const matches = useMediaQuery('(min-width:480px)');

    const handleLogout = () => {
        user_logout();
        Swal.fire({
            title: 'Success',
            text: 'You have successfully logged out!',
            icon: 'success',
            confirmButtonText: 'Ok'
        })
        .then(() => {
            window.location.href = '/';
        });
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {matches ? 'Food Ordering Portal' : ""}
                    </Typography>
                    {user_is_authenticated() ?
                        <div>
                            <Button color="inherit" href="/">Home</Button>
                            <Button color="inherit">Orders</Button>
                            <Button color="inherit">Profile</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </div>
                        :
                        <div>
                            <Button color="inherit" href="/login">Login</Button>
                            <Button color="inherit" href="/register">Register</Button>
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
