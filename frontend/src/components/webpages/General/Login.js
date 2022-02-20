import axios from 'axios';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';

import EmailInput from '../../templates/EmailInput';
import PasswordInput from '../../templates/PasswordInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const Login = () => {
    const [userType, setUserType] = useState('buyer');
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState({
        email: false,
        password: false,
    });

    const matches = useMediaQuery('(min-width:480px)');

    // Handle user type change
    const handleUserTypeChange = event => {
        setUserType(event.target.value);
    }

    // Validate user details
    const validateUserDetails = () => {
        if (userDetails.email === '' || userDetails.password === '' || error.email || error.password) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill all the details and/or fix errors!!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

            return false;
        }

        return true;
    };

    // Handle form submission
    const handleFormSubmit = event => {
        event.preventDefault();

        // Validate user details
        if (!validateUserDetails())
            return;

        let url = ""
        if (userType === 'buyer')
            url = '/api/buyers/login'
        else
            url = '/api/vendors/login'

        // Send POST request to backend
        axios.post(url, {
            email: userDetails.email,
            password: userDetails.password,
        })
            .then(res => {
                if (res.status === 200) {
                    // Set tokens in local storage
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user_type', userType);

                    // Redirect to home page
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'You have successfully logged in!',
                    }).then(() => {
                        window.location = '/';
                    });
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Invalid email or password!',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        footer: `${err.response.data.error}!`
                    });
                }
            });
    }

    return (
        <div className="login-form">
            {matches ?
                <Typography className="registration-heading" variant="h3" component="h1">
                    Login
                </Typography>
                :
                <Typography className="registration-heading" variant="h4" component="h1">
                    Login
                </Typography>
            }
            <Grid container direction="column" spacing={4} alignItems="center">
                <Grid item>
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        value={userType}
                        onChange={handleUserTypeChange}
                    >
                        <MenuItem value="buyer">Buyer</MenuItem>
                        <MenuItem value="vendor">Vendor</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <EmailInput
                        userDetails={userDetails}
                        setObjectValue={setUserDetails}
                        errorDetails={error}
                        setErrorValue={setError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <PasswordInput
                        className="login-password-input"
                        userDetails={userDetails}
                        setObjectValue={setUserDetails}
                        errorDetails={error}
                        setErrorValue={setError}
                    />
                </Grid>
                <Button
                    className="submit-button"
                    variant="contained"
                    color="primary"
                    onClick={handleFormSubmit}
                >
                    Login
                </Button>
            </Grid>
        </div>
    );
};

export default Login;
