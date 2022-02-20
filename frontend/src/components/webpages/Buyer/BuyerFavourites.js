import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import Swal from "sweetalert2";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";


const BuyerFavourites = () => {
    const [open, setOpen] = useState(false);
    const [entities, setEntities] = useState({
        items: [],
        buyer: {},
        vendors: [],
    });

    const toggleFavourites = value => {
        setOpen(value);
    }

    // Handle favourite removal
    const handleFavouriteRemove = item => {
        toggleFavourites(false);
        axios
            .patch(`/api/buyers/remove_favourite`, {
                item_id: item._id
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                Swal.fire({
                    title: 'Favourite removed!',
                    text: `You removed ${item.name} from your favourites!`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                    .then(() => {
                        window.location.reload();
                    });
            })
            .catch(err => {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    footer: err.response.data.error
                });
            });
    }

    useEffect(() => {
        const fetchData = async () => {
            const response_1 = await axios.get('/api/items', {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const response_2 = await axios.get('/api/buyers/details', {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const response_3 = await axios.get('/api/vendors', {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });

            setEntities({
                items: response_1.data,
                buyer: response_2.data,
                vendors: response_3.data,
            });
        }

        fetchData();
    }, []);

    return (
        <div>
            <Button
                color="primary"
                style={{
                    marginTop: "2rem",
                    marginLeft: "0.5rem"
                }}
                variant="outlined"
                onClick={() => toggleFavourites(true)}>
                <FavoriteIcon style={{ marginRight: "0.5rem" }} />Favourites
            </Button>
            <Drawer
                anchor='left'
                open={open}
                onClose={() => toggleFavourites(false)}
            >
                <Box
                    role="presentation"
                >
                    <List>
                        <ListItem>
                            <Typography variant="h5" component="h2" fontWeight={"bold"}>
                                Favourites
                            </Typography>
                        </ListItem>
                        {entities.items.map(item => (
                            entities.buyer.favourite_items.includes(item._id) &&
                            <Accordion key={item._id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{item.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {entities.vendors.find(vendor => vendor._id === item.vendor_id).shop_name}
                                    </Typography>
                                    <Typography>
                                        Price: Rs. {item.price}
                                    </Typography>
                                    <Typography>
                                        Category: {item.category}
                                    </Typography>
                                    <Typography style={{ marginTop: "1rem" }}>
                                        {item.tags.map(tag => (
                                            tag !== "" &&
                                            <Chip label={tag} key={tag} />
                                        ))}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: "1rem" }}
                                        onClick={() => handleFavouriteRemove(item)}
                                    >
                                        Remove from Favourites
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </div>
    );
};

export default BuyerFavourites;
