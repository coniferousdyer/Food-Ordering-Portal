import { useState } from "react";
import TextField from "@mui/material/TextField";


const TimeInput = ({ label, userDetails, setObjectValue, errorDetails, setErrorValue }) => {
    const [time, setTime] = useState('');
    const [error, setError] = useState(false);

    // Handle time change
    const handleTimeChange = event => {
        const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        console.log(event.target.value);

        setTime(event.target.value);

        if (label === 'Opening time')
            setObjectValue({ ...userDetails, opening_time: event.target.value });
        else if (label === 'Closing time')
            setObjectValue({ ...userDetails, closing_time: event.target.value });

        setError(!re.test(event.target.value));

        if (label === 'Opening time')
            setErrorValue({ ...errorDetails, opening_time: !re.test(event.target.value) });
        else if (label === 'Closing time')
            setErrorValue({ ...errorDetails, closing_time: !re.test(event.target.value) });
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
