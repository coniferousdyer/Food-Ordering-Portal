import { useState } from "react";
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Slider from "@mui/material/Slider";
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterListIcon from '@mui/icons-material/FilterList';


const ItemFilter = ({ entities, filter, setFilter }) => {
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
                <FilterListIcon style={{ marginRight: "0.5rem" }} />Filter
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Apply Filters</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apply filters to the items displayed below
                    </DialogContentText>

                    {/* Veg/Non-veg checkboxes */}
                    <Grid container direction="row" spacing={6} justifyContent="center" marginTop={1}>
                        <Grid item>
                            <FormControl>
                                <FormLabel id="food-category-checkbox">Category</FormLabel>
                                <RadioGroup
                                    aria-labelledby="food-category-radio-buttons-group-label"
                                    value={filter.vegetarian}
                                    name="food-category-radio-buttons-group"
                                    onChange={(e) => setFilter({ ...filter, vegetarian: e.target.value })}
                                >
                                    <FormControlLabel value="Vegetarian" control={<Radio />} label="Vegetarian" />
                                    <FormControlLabel value="Non-vegetarian" control={<Radio />} label="Non-vegetarian" />
                                    <FormControlLabel value="Both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {/* Vendor multi-select dropdown */}
                        <Grid item>
                            <FormControl>
                                <FormLabel id="vendor-checkbox">Shop name</FormLabel>
                                <Select
                                    labelId="vendor-multiple-checkbox-label"
                                    id="vendor-multiple-checkbox"
                                    multiple
                                    value={filter.vendor}
                                    onChange={(e) => setFilter({ ...filter, vendor: e.target.value })}
                                    input={<Input id="select-multiple-checkbox" />}
                                    renderValue={(selected) => `${selected.length} selected`}
                                >
                                    {entities.vendors.map((vendor) => (
                                        <MenuItem key={vendor.shop_name} value={vendor.shop_name}>
                                            <Checkbox checked={filter.vendor.indexOf(vendor.shop_name) > -1} />
                                            <ListItemText primary={vendor.shop_name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Price range slider */}
                        <Grid item>
                            <FormControl>
                                <FormLabel id="price-range-slider">Price Range of Items</FormLabel>
                                <Slider
                                    defaultValue={[0, 200]}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="price-range-slider"
                                    step={1}
                                    marks
                                    min={0}
                                    max={200}
                                    onChange={(e, newValue) => setFilter({ ...filter, start_price: newValue[0], end_price: newValue[1] })}
                                />
                            </FormControl>
                        </Grid>

                        {/* Tags multi-select dropdown */}
                        <Grid item>
                            <FormControl sx={matches ? { m: 1, width: 250 } : { m: 1, width: 100 }}>
                                <FormLabel id="tags-checkbox">Tags</FormLabel>
                                <Select
                                    labelId="tags-multiple-checkbox-label"
                                    id="tags-multiple-checkbox"
                                    multiple
                                    value={filter.tags}
                                    onChange={(e) => setFilter({ ...filter, tags: e.target.value })}
                                    input={<Input id="select-multiple-checkbox" />}
                                    renderValue={(selected) => `${selected.length} selected`}
                                >
                                    {entities.tags.map((tag) => (
                                        <MenuItem key={tag} value={tag}>
                                            <Checkbox checked={filter.tags.indexOf(tag) > -1} />
                                            <ListItemText primary={tag} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ItemFilter;
