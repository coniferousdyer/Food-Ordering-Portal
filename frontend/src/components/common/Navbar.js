import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Swal from 'sweetalert2';
import axios from 'axios';

import { user_is_authenticated, user_logout, user_type } from '../../lib/auth';

const Navbar = () => {
    const [wallet, setWallet] = useState(0);

    const matches = useMediaQuery('(min-width:480px)');

    useEffect(() => {
        if (user_type() === 'buyer') {
            axios
                .get('/api/buyers/details', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(res => {
                    setWallet(res.data.wallet);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, []);

    const handleLogout = () => {
        user_logout();
        Swal.fire({
            title: 'Success',
            text: 'You have successfully logged out!',
            icon: 'success',
            confirmButtonText: 'OK'
        })
            .then(() => {
                window.location.href = '/';
            });
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    {matches ? <FastfoodIcon style={{ fontSize: "2rem", marginRight: "1rem" }} /> : null}
                    <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {matches ? 'Food Ordering Portal' : ""}
                    </Typography>
                    {user_is_authenticated() ?
                        <div>
                            <Button color="inherit" href="/"><HomeIcon style={{ marginRight: "0.5rem" }} />Home</Button>
                            <Button color="inherit" href="/orders"><ShoppingCartIcon style={{ marginRight: "0.5rem" }} />Orders</Button>
                            {user_type() === 'vendor' &&
                                <Button color="inherit" href="/statistics"><EqualizerIcon style={{ marginRight: "0.5rem" }} />Statistics</Button>
                            }
                            <Button color="inherit" href="/profile"><PersonIcon style={{ marginRight: "0.5rem" }} />Profile</Button>
                            {user_type() === 'buyer' &&
                                <Button color="inherit"><AccountBalanceWalletIcon style={{ marginRight: "0.5rem" }} />Wallet: Rs. {wallet}</Button>
                            }
                            <Button color="inherit" onClick={handleLogout}><ExitToAppIcon style={{ marginRight: "0.5rem" }} />Logout</Button>
                        </div>
                        :
                        <div>
                            <Button color="inherit" href="/login"><LoginIcon style={{ marginRight: "0.5rem" }} />Login</Button>
                            <Button color="inherit" href="/register"><AppRegistrationIcon style={{ marginRight: "0.5rem" }} />Register</Button>
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
