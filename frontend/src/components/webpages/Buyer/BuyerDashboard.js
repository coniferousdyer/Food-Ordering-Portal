import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import axios from "axios";

import ItemCard from "../../templates/ItemCard";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';


const BuyerDashboard = () => {
    const [entities, setEntities] = useState({
        items: [],
        vendors: [],
    });
    // const [filter, setFilter] = useState({});

    const matches = useMediaQuery('(min-width:480px)');

    // Get all items and vendors from the server
    useEffect(() => {
        const fetchData = async () => {
            const response_1 = await axios.get("http://localhost:5000/api/items", {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const response_2 = await axios.get("http://localhost:5000/api/vendors", {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });

            setEntities({
                items: response_1.data,
                vendors: response_2.data,
            });
        }

        fetchData();
    }, []);

    return (
        <div>
            {matches ?
                <Typography className="dashboard-heading" variant="h3" component="h1">
                    What's On The Menu
                </Typography>
                :
                <Typography className="dashboard-heading" variant="h4" component="h1">
                    What's On The Menu
                </Typography>
            }
            <Grid
                className="item-grid"
                container
                columns={13}
                spacing={2}
                justifyContent="center"
                wrap="wrap"
                rowSpacing={4}
            >
                {entities.items.map(item => {
                    return (
                        <Grid key={item._id} item xs={10} sm={6} md={4} lg={3}>
                            <ItemCard
                                item={item}
                                vendor={entities.vendors.find(vendor => vendor._id === item.vendor_id)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};

export default BuyerDashboard;
