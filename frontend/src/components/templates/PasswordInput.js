import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import validator from 'validator';


const PasswordInput = ({ userDetails, setObjectValue, errorDetails, setErrorValue }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);

    // Handle password change
    const handlePasswordChange = event => {
        setPassword(event.target.value);
        setObjectValue({ ...userDetails, password: event.target.value });
        setError(validator.isEmpty(event.target.value));
        setErrorValue({ ...errorDetails, password: validator.isEmpty(event.target.value) });
    }

    // Handle password visibility change
    const handleShowPasswordChange = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            {error ?
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowPasswordChange}
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                :
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowPasswordChange}
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            }
        </div>
    );
};

export default PasswordInput;
