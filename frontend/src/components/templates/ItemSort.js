import { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import OutlinedInput from '@mui/material/OutlinedInput';
import SortIcon from '@mui/icons-material/Sort';


const ItemSort = ({ sort, setSort }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const matches = useMediaQuery('(min-width:480px)');

    // Handle dialog box open
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    // Handle dialog box close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            <Button className="filter-button" variant="outlined" onClick={handleDialogOpen}>
                <SortIcon style={{ marginRight: "0.5rem" }} />Sort items
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Sort Items</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sort the items displayed below, by price or rating
                    </DialogContentText>

                    {/* Sort category dropdown */}
                    <Grid
                        container
                        direction="row"
                        spacing={12}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        marginTop={3}
                    >
                        <FormControl sx={matches ? { m: 1, width: 250 } : { m: 1, width: 100 }}>
                            <InputLabel id="sort-category-checkbox">Sort by</InputLabel>
                            <Select
                                labelId="sort-category-checkbox-label"
                                id="sort-category-checkbox"
                                value={sort.sort_by}
                                input={<OutlinedInput label="Sort by" />}
                                onChange={event => setSort({ ...sort, sort_by: event.target.value })}
                            >
                                <MenuItem value="Price">Price</MenuItem>
                                <MenuItem value="Rating">Rating</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Sort order dropdown */}
                        <FormControl sx={matches ? { m: 1, width: 250 } : { m: 1, width: 100 }}>
                            <InputLabel id="sort-order-checkbox">Order</InputLabel>
                            <Select
                                labelId="sort-order-checkbox-label"
                                id="sort-order-checkbox"
                                value={sort.order}
                                input={<OutlinedInput label="Order" />}
                                onChange={event => setSort({ ...sort, order: event.target.value })}
                            >
                                <MenuItem value="Ascending">Ascending</MenuItem>
                                <MenuItem value="Descending">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ItemSort;
