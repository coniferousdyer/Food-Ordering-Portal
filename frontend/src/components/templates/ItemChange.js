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
import validator from 'validator';
import Swal from 'sweetalert2';
import axios from 'axios';


const ItemChange = ({ item, onEdit, onDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemDetails, setItemDetails] = useState({
        name: item.name,
        price: item.price,
        category: item.category,
        tags: item.tags,
        addons: item.addons
    });
    const [priceError, setPriceError] = useState(false);
    const [addonsString, setAddonsString] = useState(item.addons.map(addon => addon.addon_name + "-" + addon.addon_price).join(","));
    const [addonsError, setAddonsError] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        // Reset state
        setItemDetails({
            name: item.name,
            price: item.price,
            category: item.category,
            tags: item.tags,
            addons: item.addons
        });
        setAddonsString(item.addons.map(addon => addon.addon_name + "-" + addon.addon_price).join(","));
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

    // Handle item deletion
    const handleDelete = item => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.value) {
                axios
                    .delete(`http://localhost:5000/api/items/delete`, {
                        headers: {
                            authorization: localStorage.getItem("token"),
                        },
                        data: {
                            item_id: item._id,
                        },
                    })
                    .then(res => {
                        Swal.fire({
                            title: `${item.name} Deleted`,
                            text: `${item.name} has been deleted successfully!`,
                            icon: "success",
                            confirmButtonText: "OK",
                        });

                        onDelete(item);
                    })
                    .catch(err => {
                        Swal.fire({
                            title: "Oops!",
                            text: "Something went wrong!",
                            icon: "error",
                            confirmButtonText: "OK",
                            footer: `${err.response.data.error}!`,
                        });
                    });
            }
        }).catch(err => {
            Swal.fire({
                title: "Oops!",
                text: "Something went wrong!",
                icon: "error",
                confirmButtonText: "OK",
                footer: `${err.response.data.error}!`,
            });
        });
    };

    // Handle item editing
    const handleEdit = item => {
        if (priceError || addonsError || validator.isEmpty(itemDetails.name)) {
            handleDialogClose();
            Swal.fire({
                title: 'Error',
                text: 'Please fill all the details and/or fix errors!!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

            return;
        }

        handleDialogClose();
        axios
            .patch(`http://localhost:5000/api/items/edit`, {
                item_id: item._id,
                original_name: item.name,
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
                    title: `${item.name} Edited`,
                    text: `${item.name} has been edited successfully!`,
                    icon: "success",
                    confirmButtonText: "OK",
                })
                    .then(() => {
                        onEdit(res.data);
                    });
            })
            .catch(err => {
                Swal.fire({
                    title: "Oops!",
                    text: "Something went wrong!",
                    icon: "error",
                    confirmButtonText: "OK",
                    footer: `${err.response.data.error}!`,
                });
            });
    };

    return (
        <div>
            <Grid
                direction="row"
                justifyContent="center"
                container
                spacing={1}
                marginTop={3}
            >
                <Grid item>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDialogOpen}
                        >
                            Edit
                        </Button>
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
                                        defaultValue={item.name}
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
                                            defaultValue={item.price}
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
                                            defaultValue={item.price}
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
                                <Button onClick={() => handleEdit(item)}>Save Changes</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => { handleDelete(item) }}
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>
        </div >
    );
};

export default ItemChange;
