import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import validator from "validator";
import Swal from "sweetalert2";
import axios from "axios";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


const ItemBuy = ({ item, vendor }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle number change
    const handleNumberChange = event => {
        setQuantity(event.target.value);
        setError(validator.isEmpty(event.target.value) || !validator.isNumeric(event.target.value) || event.target.value < 0);
    }

    // Calculate total price
    const calculateTotalPrice = () => {
        let total = quantity * item.price;
        selectedAddons.forEach(addon => {
            total += item.addons.find(i => i.addon_name === addon).addon_price;
        });
        return total;
    }

    // Verify if vendor has not closed
    const ifOpen = () => {
        let openingTime = vendor.opening_time.split(":");
        openingTime = new Date(0, 0, 0, openingTime[0], openingTime[1], 0).getTime();
        let closingTime = vendor.closing_time.split(":");
        closingTime = new Date(0, 0, 0, closingTime[0], closingTime[1], 0).getTime();
        const currentTime = new Date(0, 0, 0, new Date().getHours(), new Date().getMinutes(), 0).getTime();

        if (currentTime < openingTime || currentTime > closingTime)
            return false;
        else
            return true;
    }

    // Handle purchase
    const handlePurchase = item => {
        if (quantity === "" || error) {
            Swal.fire({
                title: "Error",
                text: "Please enter a valid quantity!",
                icon: "error",
                confirmButtonText: "OK"
            });
        } else {
            setDialogOpen(false);

            const addonsArray = selectedAddons.map(addon => {
                return {
                    addon_name: addon,
                    addon_price: item.addons.find(i => i.addon_name === addon).addon_price
                }
            });

            // Make POST request to backend
            axios.post("/api/orders/add", {
                item_id: item._id,
                vendor_id: vendor._id,
                quantity: quantity,
                addons: addonsArray,
                cost: calculateTotalPrice()
            }, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
                .then(res => {
                    Swal.fire({
                        title: "Success",
                        text: `${item.name} purchased!`,
                        icon: "success",
                        confirmButtonText: "OK"
                    })
                    .then(() => {
                        window.location.reload();
                    });

                    // Reset state
                    setQuantity(1);
                    setError(null);
                    setSelectedAddons([]);
                })
                .catch(err => {
                    Swal.fire({
                        title: "Oops!",
                        text: "Something went wrong!",
                        icon: "error",
                        confirmButtonText: "OK",
                        footer: err.response.data.error
                    });
                });
        }
    }

    return (
        <div>
            {ifOpen() ? (
                <Button
                    className='item-card-button'
                    variant="contained"
                    color="primary"
                    onClick={handleDialogOpen}
                >
                    <AddShoppingCartIcon style={{ marginRight: "0.5rem" }} />Buy Item
                </Button>
            ) : (
                <Button
                    className='item-card-button'
                    variant="contained"
                    color="primary"
                    disabled
                >
                    Vendor Closed
                </Button>
            )}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Buy Item</DialogTitle>
                <DialogContent>
                    <Card
                        className='item-card'
                        style={{
                            width: "100%",
                            height: "100%",
                            marginTop: "1rem",
                            marginBottom: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div className='item-card-content'>
                            <Typography variant="h5" component="h2" marginTop="1rem" marginBottom="0.5rem">
                                {item.name}
                            </Typography>
                            <Typography variant="body2" component="p" marginTop="0.5rem" marginBottom="0.5rem" align="center">
                                {vendor.shop_name}
                            </Typography>
                            <Typography variant="body2" component="p" marginBottom="1rem" align="center">
                                Rs. {item.price}
                            </Typography>
                        </div>
                    </Card>

                    {/* Quantity */}
                    <DialogContentText>
                        Enter the quantity you wish to buy
                    </DialogContentText>
                    {error ?
                        <TextField
                            autoFocus
                            id="name"
                            label="Quantity"
                            type="number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={quantity}
                            onChange={handleNumberChange}
                            error
                        />
                        :
                        <TextField
                            autoFocus
                            id="name"
                            label="Quantity"
                            type="number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={quantity}
                            onChange={handleNumberChange}
                        />
                    }
                    <DialogContentText marginTop="1rem">
                        Would you like to select any addons?
                    </DialogContentText>

                    {/* Addons */}
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Addons</InputLabel>
                        <Select
                            labelId="addons-multiple-checkbox-label"
                            id="addons-multiple-checkbox"
                            multiple
                            value={selectedAddons}
                            onChange={event => setSelectedAddons(event.target.value)}
                            input={<OutlinedInput label="Addons" />}
                            renderValue={(selected) => `${selected.length} selected`}
                        >
                            {item.addons.map(addon => (
                                <MenuItem key={addon.addon_name} value={addon.addon_name}>
                                    <Checkbox checked={selectedAddons.indexOf(addon.addon_name) > -1} />
                                    <ListItemText primary={`${addon.addon_name} (Rs. ${addon.addon_price})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Total Price */}
                    <DialogContentText marginTop="1rem">
                        Total Price: Rs. {calculateTotalPrice()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handlePurchase(item)}>Place Order</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default ItemBuy;
