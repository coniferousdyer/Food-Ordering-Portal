import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import axios from "axios";
import validator from "validator";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';


const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(false);

    const matches = useMediaQuery('(min-width:480px)');

    useEffect(() => {
        axios.get("/api/buyers/details", {
            headers: {
                authorization: localStorage.getItem("token"),
            },
        })
            .then(res => {
                setBalance(res.data.wallet);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // Add money to wallet
    const addMoney = () => {
        if (amount === "" || error) {
            Swal.fire({
                title: "Error",
                text: "Please enter a valid amount!",
                icon: "error",
                confirmButtonText: "OK"
            });

            return;
        }

        axios.patch("/api/buyers/update_wallet", {
            wallet: amount,
        }, {
            headers: {
                authorization: localStorage.getItem("token"),
            },
        })
            .then(res => {
                setBalance(res.data.wallet);

                Swal.fire({
                    title: "Success",
                    text: `Rs. ${amount} added to wallet!`,
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => {
                    setAmount("");
                    window.location.reload();
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Handle amount change
    const handleAmountChange = e => {
        setAmount(e.target.value);
        setError(validator.isEmpty(e.target.value) || !validator.isNumeric(e.target.value) || e.target.value < 0);
    }

    return (
        <Card
            style={{
                width: matches ? "16%" : "50%",
                padding: "1rem",
                position: matches ? "absolute" : "relative",
                right: matches ? 70 : "auto",
                left: matches ? "auto" : 70,
                top: matches ? "auto" : 120
            }}
        >
            <AccountBalanceWalletIcon style={{ fontSize: "3rem" }} />
            <Stack direction="row">
                <Typography
                    variant="h6"
                    marginBottom={3}
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "1rem"
                    }}
                >
                    Wallet Balance: Rs. {balance}
                </Typography>
            </Stack>
            <Stack direction="row">
                {error ?
                    <TextField
                        label="Amount"
                        variant="outlined"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        error
                    />
                    :
                    <TextField
                        label="Amount"
                        variant="outlined"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                }
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={addMoney}
                    style={{ marginLeft: "0.5rem" }}
                >
                    Add Money
                </Button>
            </Stack>
        </Card>
    );
};

export default Wallet;
