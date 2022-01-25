import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { user_is_authenticated } from '../../../lib/auth';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PhoneInput from 'react-phone-input-2';
import MenuItem from '@mui/material/MenuItem';
import validator from 'validator';
import Swal from 'sweetalert2';


const BuyerProfile = () => {
    const [originalUser, setOriginalUser] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({
        email: false,
        age: false,
    });
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);

        // Reset error
        setError({
            email: false,
            age: false,
        });

        // Reset user details
        setUserDetails({
            name: originalUser.name,
            email: originalUser.email,
            age: originalUser.age,
            password: "",
            number: originalUser.number,
            batch: originalUser.batch,
        });
    };

    const matches = useMediaQuery('(min-width:480px)');

    useEffect(() => {
        if (user_is_authenticated()) {
            axios.get('http://localhost:5000/api/buyers/details', {
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }).then(res => {
                setUserDetails({
                    name: res.data.name,
                    email: res.data.email,
                    age: res.data.age,
                    password: "",
                    number: res.data.number,
                    batch: res.data.batch,
                });
                setOriginalUser({
                    name: res.data.name,
                    email: res.data.email,
                    age: res.data.age,
                    password: "",
                    number: res.data.number,
                    batch: res.data.batch,
                });
            });
        }
    }, []);

    // Handle email change
    const handleEmailChange = event => {
        setUserDetails({ ...userDetails, email: event.target.value });
        setError({ ...error, email: !validator.isEmail(event.target.value) });
    };

    // Handle age change
    const handleAgeChange = event => {
        setUserDetails({ ...userDetails, age: event.target.value });
        setError({ ...error, age: validator.isEmpty(event.target.value) || !validator.isNumeric(event.target.value) || event.target.value < 0 });
    };

    // Validate user details
    const validateUserDetails = () => {
        if (userDetails.name === '' || userDetails.email === '' || userDetails.number === '' || userDetails.age === '' || error.email || error.age) {
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

    // Handle submit
    const handleSubmit = event => {
        event.preventDefault();

        if (!validateUserDetails())
            return;

        setDialogOpen(false);
        axios.patch('http://localhost:5000/api/buyers/edit', {
            name: userDetails.name,
            email: userDetails.email,
            age: userDetails.age,
            password: userDetails.password,
            number: userDetails.number,
            batch: userDetails.batch,
        }, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }).then(res => {
            Swal.fire({
                title: 'Success',
                text: 'Your details have been updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
                .then(() => {
                    setUserDetails({
                        name: res.data.name,
                        email: res.data.email,
                        age: res.data.age,
                        password: "",
                        number: res.data.number,
                        batch: res.data.batch,
                    });
                    setOriginalUser({
                        name: res.data.name,
                        email: res.data.email,
                        age: res.data.age,
                        password: "",
                        number: res.data.number,
                        batch: res.data.batch,
                    });
                });
        }).catch(err => {
            Swal.fire({
                title: 'Oops...',
                text: 'Something went wrong!',
                icon: 'error',
                confirmButtonText: 'OK',
                footer: `${err.response.data.error}!`,
            });
        });
    };

    return (
        <div id="profile-page">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {matches ?
                        <Typography className="registration-heading" variant="h3" component="h1">
                            {originalUser.name}'s Profile
                        </Typography>
                        :
                        <Typography className="registration-heading" variant="h4" component="h1">
                            {originalUser.name}'s Profile
                        </Typography>
                    }
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h1">
                        USER TYPE
                    </Typography>
                    <Typography variant="body1" component="p">
                        Buyer
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h1">
                        EMAIL
                    </Typography>
                    <Typography variant="body1" component="p">
                        {originalUser.email}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h1">
                        NUMBER
                    </Typography>
                    <Typography variant="body1" component="p">
                        {originalUser.number}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h1">
                        AGE
                    </Typography>
                    <Typography variant="body1" component="p">
                        {originalUser.age}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h1">
                        BATCH
                    </Typography>
                    <Typography variant="body1" component="p">
                        {originalUser.batch}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <Button
                            className="submit-button"
                            variant="contained"
                            color="primary"
                            onClick={handleDialogOpen}
                        >
                            Edit Profile
                        </Button>
                        <Dialog open={dialogOpen} onClose={handleDialogClose}>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Edit your profile details here.
                                </DialogContentText>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            style={{ marginTop: "1.5rem" }}
                                            id="outlined-basic"
                                            label="Name"
                                            variant="outlined"
                                            fullWidth
                                            value={userDetails.name}
                                            onChange={event => setUserDetails({ ...userDetails, name: event.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {error.email ?
                                            <TextField
                                                id="outlined-basic"
                                                label="Email"
                                                fullWidth
                                                variant="outlined"
                                                value={userDetails.email}
                                                onChange={handleEmailChange}
                                                error
                                            />
                                            :
                                            <TextField
                                                id="outlined-basic"
                                                label="Email"
                                                fullWidth
                                                variant="outlined"
                                                value={userDetails.email}
                                                onChange={handleEmailChange}
                                            />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Password (leave blank if you don't want to change)"
                                            variant="outlined"
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            value={userDetails.password}
                                            onChange={event => setUserDetails({ ...userDetails, password: event.target.value })}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={event => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {error.age ?
                                            <TextField
                                                id="outlined-basic"
                                                label="Age"
                                                fullWidth
                                                variant="outlined"
                                                value={userDetails.age}
                                                type="number"
                                                onChange={handleAgeChange}
                                                error
                                            />
                                            :
                                            <TextField
                                                id="outlined-basic"
                                                label="Age"
                                                fullWidth
                                                variant="outlined"
                                                value={userDetails.age}
                                                type="number"
                                                onChange={handleAgeChange}
                                            />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PhoneInput
                                            country={'in'}
                                            value={String(userDetails.number)}
                                            placeholder="Phone Number"
                                            onChange={value => setUserDetails({ ...userDetails, number: value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Batch"
                                            variant="outlined"
                                            value={userDetails.batch}
                                            onChange={event => setUserDetails({ ...userDetails, batch: event.target.value })}
                                        >
                                            <MenuItem value="UG1">UG1</MenuItem>
                                            <MenuItem value="UG2">UG2</MenuItem>
                                            <MenuItem value="UG3">UG3</MenuItem>
                                            <MenuItem value="UG4">UG4</MenuItem>
                                            <MenuItem value="UG5">UG5</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDialogClose}>Cancel</Button>
                                <Button onClick={handleSubmit}>Save Changes</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default BuyerProfile;
