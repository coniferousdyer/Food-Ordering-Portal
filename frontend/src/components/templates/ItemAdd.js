import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from '@mui/material/useMediaQuery';
import validator from 'validator';
import Swal from 'sweetalert2';
import axios from 'axios';


const ItemAdd = ({ onAdd }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemDetails, setItemDetails] = useState({
        name: "",
        price: 0,
        category: "Vegetarian",
        tags: [],
    });
    const [priceError, setPriceError] = useState(false);
    const [addonsString, setAddonsString] = useState("");
    const [addonsError, setAddonsError] = useState(false);

    const matches = useMediaQuery('(min-width:480px)');

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        // Reset state
        setItemDetails({
            name: "",
            price: 0,
            category: "Vegetarian",
            tags: [],
        });
        setAddonsString("");
        setPriceError(false);
        setAddonsError(false);
        setDialogOpen(false);
    };

    // Handle price change
    const handlePriceChange = event => {
        setItemDetails({
            ...itemDetails,
            price: event.target.value
        });
        setPriceError(validator.isEmpty(event.target.value) || !validator.isNumeric(event.target.value) || event.target.value < 0);
    }

    // Handle tags change
    const handleTagsChange = event => {
        setItemDetails({
            ...itemDetails,
            tags: event.target.value.split(',')
        });
    }

    // Handle addons change
    const handleAddonsChange = event => {
        setAddonsString(event.target.value);

        // Make sure the string is of the form "addon_name-addon_price,addon_name-addon_price,..."
        let re = /^([a-zA-Z0-9-_]+-[0-9]+[,]?)+$/;
        setAddonsError(!validator.isEmpty(event.target.value) && !re.test(event.target.value));
    }

    // Handle item addition
    const handleAdd = () => {
        // Validate item details
        if (validator.isEmpty(itemDetails.name) || priceError || addonsError) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill all the details and/or fix errors!!',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return;
        }

        // Add item
        handleDialogClose();
        axios.post('http://localhost:5000/api/items/add', {
            name: itemDetails.name,
            price: itemDetails.price,
            category: itemDetails.category,
            tags: itemDetails.tags,
            addons: addonsString.split(",").map(addon => {
                return {
                    addon_name: addon.split("-")[0],
                    addon_price: Number(addon.split("-")[1])
                }
            }),
        }, {
            headers: {
                authorization: localStorage.getItem("token")
            }
        })
            .then(res => {
                Swal.fire({
                    title: `${itemDetails.name} Added`,
                    text: `${itemDetails.name} has been added successfully!`,
                    icon: "success",
                    confirmButtonText: "OK",
                })
                    .then(() => {
                        onAdd(res.data);
                    });
            })
            .catch(err => {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    footer: `${err.response.data.error}!`,
                });
            });
    }

    return (
        <div>
            <div>
                {matches ?
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDialogOpen}
                        style={{
                            position: 'absolute',
                            top: 100,
                            right: 50,
                        }}
                    >
                        <AddIcon style={{ marginRight: "0.5rem" }} />
                        Add Item
                    </Button>
                    :
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDialogOpen}
                        style={{
                            position: 'absolute',
                            top: 125,
                            right: 90,
                        }}
                    >
                        <AddIcon />
                        Add Item
                    </Button>
                }
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Edit Item</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Edit the item details below
                        </DialogContentText>
                        <Grid
                            direction="column"
                            alignItems="center"
                            container
                            spacing={1}
                        >
                            {/* Name */}
                            <TextField
                                autoFocus
                                id="name"
                                label="Item name"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={itemDetails.name}
                                style={{ marginTop: "2rem" }}
                                onChange={e =>
                                    setItemDetails({
                                        ...itemDetails,
                                        name: e.target.value,
                                    })
                                }
                            />

                            {/* Price */}
                            {priceError ?
                                <TextField
                                    id="price"
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={itemDetails.price}
                                    style={{ marginTop: "1.5rem" }}
                                    onChange={handlePriceChange}
                                    error
                                />
                                :
                                <TextField
                                    id="price"
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={itemDetails.price}
                                    style={{ marginTop: "1.5rem" }}
                                    onChange={handlePriceChange}
                                />
                            }

                            {/* Category */}
                            <TextField
                                select
                                style={{ marginTop: "1.5rem" }}
                                label="Category"
                                variant="outlined"
                                value={itemDetails.category}
                                fullWidth
                                onChange={e => {
                                    setItemDetails({
                                        ...itemDetails,
                                        category: e.target.value
                                    });
                                }}
                            >
                                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                                <MenuItem value="Non-vegetarian">Non-vegetarian</MenuItem>
                            </TextField>

                            {/* Tags */}
                            <DialogContentText style={{ marginTop: "1.5rem" }}>
                                List tags below, separated by commas
                            </DialogContentText>
                            <TextField
                                id="tags"
                                label="Tags"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={itemDetails.tags}
                                style={{ marginTop: "1.5rem" }}
                                onChange={handleTagsChange}
                            >
                            </TextField>

                            {/* Addons */}
                            <DialogContentText style={{ marginTop: "1.5rem" }}>
                                List addons below as follows: Addon_1-Price_1,Addon_2-Price_2, etc.
                            </DialogContentText>
                            {addonsError ?
                                <TextField
                                    id="addons"
                                    label="Addons"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={addonsString}
                                    style={{ marginTop: "1.5rem" }}
                                    onChange={handleAddonsChange}
                                    error
                                >
                                </TextField>
                                :
                                <TextField
                                    id="addons"
                                    label="Addons"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={addonsString}
                                    style={{ marginTop: "1.5rem" }}
                                    onChange={handleAddonsChange}
                                >
                                </TextField>
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleAdd}>Add Item</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ItemAdd;
