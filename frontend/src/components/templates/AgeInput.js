import { useState } from "react";
import TextField from "@mui/material/TextField";
import validator from "validator";


const AgeInput = ({ userDetails, setObjectValue, errorDetails, setErrorValue }) => {
    const [age, setAge] = useState('');
    const [error, setError] = useState(false);

    // Handle number change
    const handleNumberChange = event => {
        setAge(event.target.value);
        setObjectValue({ ...userDetails, age: event.target.value });
        setError(validator.isEmpty(event.target.value) || !validator.isNumeric(event.target.value) || event.target.value < 0);
        setErrorValue({ ...errorDetails, age: validator.isEmpty(event.target.value) || !validator.isNumeric(event.target.value) || event.target.value < 0 });
    }

    return (
        <div>
            {error ?
                <TextField
                    id="outlined-basic"
                    error
                    helperText='Please enter a valid age'
                    label="Age"
                    variant="outlined"
                    value={age}
                    type={'number'}
                    onChange={handleNumberChange}
                />
                :
                <TextField
                    id="outlined-basic"
                    label="Age"
                    variant="outlined"
                    value={age}
                    type={'number'}
                    onChange={handleNumberChange}
                />
            }
        </div>
    );
};

export default AgeInput;
