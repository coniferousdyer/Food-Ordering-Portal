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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper'
import validator from 'validator';
import Swal from 'sweetalert2';


const VendorProfile = () => {
    const [originalUser, setOriginalUser] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({
        email: false,
        opening_time: false,
        closing_time: false,
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
            opening_time: false,
            closing_time: false,
        });

        // Reset user details
        setUserDetails({
            shop_name: originalUser.shop_name,
            manager_name: originalUser.manager_name,
            email: originalUser.email,
            password: "",
            number: originalUser.number,
            opening_time: originalUser.opening_time,
            closing_time: originalUser.closing_time,
        });
    };

    const matches = useMediaQuery('(min-width:480px)');

    useEffect(() => {
        if (user_is_authenticated()) {
            axios.get('/api/vendors/details', {
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }).then(res => {
                setUserDetails({
                    shop_name: res.data.shop_name,
                    manager_name: res.data.manager_name,
                    email: res.data.email,
                    number: res.data.number,
                    opening_time: res.data.opening_time,
                    closing_time: res.data.closing_time,
                    password: "",
                });
                setOriginalUser({
                    shop_name: res.data.shop_name,
                    manager_name: res.data.manager_name,
                    email: res.data.email,
                    number: res.data.number,
                    opening_time: res.data.opening_time,
                    closing_time: res.data.closing_time,
                    password: "",
                });
            });
        }
    }, []);

    // Handle email change
    const handleEmailChange = event => {
        setUserDetails({ ...userDetails, email: event.target.value });
        setError({ ...error, email: !validator.isEmail(event.target.value) });
    };

    // Handle opening time change
    const handleOpeningTimeChange = event => {
        setUserDetails({ ...userDetails, opening_time: event.target.value });
        const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        setError({ ...error, opening_time: !re.test(event.target.value) });
    };

    // Handle closing time change
    const handleClosingTimeChange = event => {
        setUserDetails({ ...userDetails, closing_time: event.target.value });
        const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        setError({ ...error, closing_time: !re.test(event.target.value) });
    };

    // Validate user details
    const validateUserDetails = () => {
        if (userDetails.shop_name === '' || userDetails.manager_name === '' || userDetails.number === '' || userDetails.email === '' || error.email || error.opening_time || error.closing_time) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill all the details and/or fix errors!!',
                icon: 'error',
                confirmButtonText: 'OK'
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
        axios.patch('/api/vendors/edit', {
            shop_name: userDetails.shop_name,
            manager_name: userDetails.manager_name,
            email: userDetails.email,
            number: userDetails.number,
            opening_time: userDetails.opening_time,
            closing_time: userDetails.closing_time,
            password: userDetails.password,
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
                        shop_name: res.data.shop_name,
                        manager_name: res.data.manager_name,
                        email: res.data.email,
                        number: res.data.number,
                        opening_time: res.data.opening_time,
                        closing_time: res.data.closing_time,
                        password: "",
                    });
                    setOriginalUser({
                        shop_name: res.data.shop_name,
                        manager_name: res.data.manager_name,
                        email: res.data.email,
                        number: res.data.number,
                        opening_time: res.data.opening_time,
                        closing_time: res.data.closing_time,
                        password: "",
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
            <Grid container direction="column" spacing={4} alignItems="center">
                <Grid item xs={12}>
                    {matches ?
                        <Typography className="registration-heading" variant="h3" component="h1">
                            {originalUser.shop_name}'s Profile
                        </Typography>
                        :
                        <Typography className="registration-heading" variant="h4" component="h1">
                            {originalUser.shop_name}'s Profile
                        </Typography>
                    }
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper} style={{ marginTop: '1.5rem' }}>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <StorefrontIcon style={{ marginRight: "0.5rem", fontSize: "1rem" }} />User Type
                                    </TableCell>
                                    <TableCell align="right">
                                        Vendor
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                    <PersonIcon style={{ marginRight: "0.5rem", fontSize: "1rem" }} />Manager Name
                                    </TableCell>
                                    <TableCell align="right">
                                        {originalUser.manager_name}
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <EmailIcon style={{ marginRight: "0.5rem", fontSize: "1rem" }} />Email
                                    </TableCell>
                                    <TableCell align="right">
                                        {originalUser.email}
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <LocalPhoneIcon style={{ marginRight: "0.5rem", fontSize: "1rem" }} />Number
                                    </TableCell>
                                    <TableCell align="right">
                                        {originalUser.number}
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <AccessTimeIcon style={{ marginRight: "0.5rem", fontSize: "1rem" }} />Opening Time
                                    </TableCell>
                                    <TableCell align="right">
                                        {originalUser.opening_time}
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <AccessTimeIcon style={{ marginRight: "0.5rem", fontSize: "1rem" }} />Closing Time
                                    </TableCell>
                                    <TableCell align="right">
                                        {originalUser.closing_time}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                                            value={userDetails.shop_name}
                                            onChange={event => setUserDetails({ ...userDetails, shop_name: event.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            style={{ marginTop: "1.5rem" }}
                                            id="outlined-basic"
                                            label="Name"
                                            variant="outlined"
                                            fullWidth
                                            value={userDetails.manager_name}
                                            onChange={event => setUserDetails({ ...userDetails, manager_name: event.target.value })}
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
                                        <PhoneInput
                                            country={'in'}
                                            value={String(userDetails.number)}
                                            placeholder="Phone Number"
                                            onChange={value => setUserDetails({ ...userDetails, number: value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {error.opening_time ?
                                            <TextField
                                                id="outlined-basic"
                                                label="Opening Time"
                                                variant="outlined"
                                                fullWidth
                                                value={userDetails.opening_time}
                                                onChange={handleOpeningTimeChange}
                                                error
                                            />
                                            :
                                            <TextField
                                                id="outlined-basic"
                                                label="Opening Time"
                                                variant="outlined"
                                                fullWidth
                                                value={userDetails.opening_time}
                                                onChange={handleOpeningTimeChange}
                                            />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {error.closing_time ?
                                            <TextField
                                                id="outlined-basic"
                                                label="Closing Time"
                                                variant="outlined"
                                                fullWidth
                                                value={userDetails.closing_time}
                                                onChange={handleClosingTimeChange}
                                                error
                                            />
                                            :
                                            <TextField
                                                id="outlined-basic"
                                                label="Closing Time"
                                                variant="outlined"
                                                fullWidth
                                                value={userDetails.closing_time}
                                                onChange={handleClosingTimeChange}
                                            />
                                        }
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

export default VendorProfile;
