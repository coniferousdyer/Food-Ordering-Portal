import { useState } from 'react';
import TextField from '@mui/material/TextField';
import validator from 'validator';


const EmailInput = ({ userDetails, setObjectValue, errorDetails, setErrorValue }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);

    // Handle email change
    const handleEmailChange = event => {
        setEmail(event.target.value);
        setObjectValue({ ...userDetails, email: event.target.value });
        setError(!validator.isEmail(event.target.value));
        setErrorValue({ ...errorDetails, email: !validator.isEmail(event.target.value) });
    }

    return (
        <div>
            {error ?
                <TextField
                    id="outlined-basic"
                    error
                    helperText='Please enter a valid email'
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                />
                :
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                />
            }
        </div>
    );
};

export default EmailInput;
