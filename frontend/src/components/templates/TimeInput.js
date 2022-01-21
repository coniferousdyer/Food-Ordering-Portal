import { useState } from "react";
import TextField from "@mui/material/TextField";


const TimeInput = ({ label, userDetails, setObjectValue, errorDetails, setErrorValue }) => {
    const [time, setTime] = useState('');
    const [error, setError] = useState(false);

    // Handle time change
    const handleTimeChange = event => {
        const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        setTime(event.target.value);
        setObjectValue({ ...userDetails, time: event.target.value });
        setError(!re.test(event.target.value));
        setErrorValue({ ...errorDetails, time: !re.test(event.target.value) });
    }

    return (
        <div>
            {error ?
                <TextField
                    id="outlined-basic"
                    label={label}
                    variant="outlined"
                    error
                    helperText='Please enter a valid time'
                    value={time}
                    placeholder="hh:mm"
                    onChange={handleTimeChange}
                />
                :
                <TextField
                    id="outlined-basic"
                    label={label}
                    variant="outlined"
                    value={time}
                    placeholder="hh:mm"
                    onChange={handleTimeChange}
                />
            }
        </div>
    );
};

export default TimeInput;
