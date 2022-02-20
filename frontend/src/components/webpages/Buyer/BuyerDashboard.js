import { useState, useEffect } from "react";
import ItemFilter from "../../templates/ItemFilter";
import ItemSort from "../../templates/ItemSort";
import Grid from '@mui/material/Grid';
import axios from "axios";
import ItemCard from "../../templates/ItemCard";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Wallet from "../../templates/Wallet";
import BuyerFavourites from "./BuyerFavourites";
import fuzzy from "fuzzy";


const BuyerDashboard = () => {
    const [entities, setEntities] = useState({
        items: [],
        vendors: [],
        tags: []
    });
    const [filter, setFilter] = useState({
        search: '',
        vendor: [],
        vegetarian: 'Both',
        tags: [],
        start_price: 0,
        end_price: 200,
    });
    const [sort, setSort] = useState({
        order: '',
        sort_by: ''
    });

    // Get all item tags
    const getTags = items => {
        let tags = [];
        for (let item of items) {
            for (let tag of item.tags) {
                if (!tags.includes(tag.trim())) {
                    tags.push(tag.trim());
                }
            }
        }

        return tags;
    }

    // Check if item passes filter
    const passesFilter = item => {
        // Search filter
        if (!(filter.search === '' || fuzzy.test(filter.search.toLowerCase(), item.name.toLowerCase())))
            return false;

        // Vegetarian filter
        if (!(filter.vegetarian === 'Both' || item.category === filter.vegetarian))
            return false;

        // Vendor filter
        if (filter.vendor.length > 0) {
            const vendor = entities.vendors.find(vendor => vendor._id === item.vendor_id);
            if (!filter.vendor.includes(vendor.shop_name))
                return false;
        }

        // Price filter
        if (item.price < filter.start_price || item.price > filter.end_price)
            return false;

        // Tags filter
        if (filter.tags.length > 0) {
            for (let tag of filter.tags) {
                if (!item.tags.includes(tag))
                    return false;
            }
        }

        return true;
    }

    // Verify if vendor has not closed
    const ifOpen = vendor => {
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

    // Sort items
    const sortItems = items => {
        if (sort.order === 'Ascending') {
            if (sort.sort_by === 'Price') {
                items = items.sort((a, b) => a.price - b.price);
            } else if (sort.sort_by === 'Rating') {
                items = items.sort((a, b) => computeRating(a) - computeRating(b));
            }
        } else if (sort.order === 'Descending') {
            if (sort.sort_by === 'Price') {
                items = items.sort((a, b) => b.price - a.price);
            } else if (sort.sort_by === 'Rating') {
                items = items.sort((a, b) => computeRating(b) - computeRating(a));
            }
        }

        // Sort items so that items whose vendors have closed are at the end
        items = items.sort((a, b) => {
            const vendorA = entities.vendors.find(vendor => vendor._id === a.vendor_id);
            const vendorB = entities.vendors.find(vendor => vendor._id === b.vendor_id);
            if (ifOpen(vendorA) && !ifOpen(vendorB))
                return -1;
            else if (!ifOpen(vendorA) && ifOpen(vendorB))
                return 1;
            else
                return 0;
        });

        return items;
    }

    // Calculate the average rating for the item
    const computeRating = item => {
        let sum = 0;
        for (let i = 0; i < item.rating.count; i++) {
            sum += item.rating.ratings[i];
        }
        let res = sum / parseFloat(item.rating.count);
        return isNaN(res) ? 0 : res;
    }

    const matches = useMediaQuery('(min-width:480px)');

    // Get all items and vendors from the server
    useEffect(() => {
        const fetchData = async () => {
            const response_1 = await axios.get("/api/items", {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const response_2 = await axios.get("/api/vendors", {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });

            setEntities({
                items: response_1.data,
                vendors: response_2.data,
                tags: getTags(response_1.data)
            });
        }

        fetchData();
    }, []);

    return (
        <div>
            <Wallet />

            {matches ?
                <Typography className="dashboard-heading" variant="h3" component="h1">
                    What's On The Menu
                </Typography>
                :
                <Typography className="dashboard-heading" variant="h4" component="h1">
                    What's On The Menu
                </Typography>
            }

            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                align="left"
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />

            <Stack direction={matches ? "row" : "column"} justifyContent="center">
                <ItemFilter
                    filter={filter}
                    setFilter={setFilter}
                    entities={entities}
                />
                <ItemSort
                    entities={entities}
                    setEntities={setEntities}
                    sort={sort}
                    setSort={setSort}
                    computeRating={computeRating}
                />
                <BuyerFavourites />
            </Stack>

            <Grid
                className="item-grid"
                container
                columns={13}
                spacing={2}
                justifyContent="center"
                wrap="wrap"
                rowSpacing={4}
            >
                {entities.items.length > 0 ?
                    sortItems(entities.items).map((item) => {
                        if (passesFilter(item)) {
                            return (
                                <Grid key={item._id} item xs={10} sm={6} md={4} lg={3}>
                                    <ItemCard
                                        item={item}
                                        vendor={entities.vendors.find(vendor => vendor._id === item.vendor_id)}
                                        computeRating={computeRating}
                                    />
                                </Grid>
                            );
                        } else {
                            return null;
                        }
                    })
                    :
                    <Typography variant="h5" component="h1">
                        No items listed yet.
                    </Typography>
                }
            </Grid>
        </div >
    );
};

export default BuyerDashboard;
