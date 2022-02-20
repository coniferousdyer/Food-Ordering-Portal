import { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from "@mui/material/Grid";
import OrderCard from "../../templates/OrderCard";
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';


const BuyerOrders = () => {
    const [entities, setEntities] = useState({
        orders: [],
        items: [],
        vendors: [],
    });

    const matches = useMediaQuery('(min-width:480px)');

    useEffect(() => {
        async function fetchData() {
            const response_1 = await axios.get('/api/orders/buyer', {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            });
            const response_2 = await axios.get('/api/items', {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            });
            const response_3 = await axios.get('/api/vendors', {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            });

            setEntities({
                orders: response_1.data,
                items: response_2.data,
                vendors: response_3.data,
            })
        }

        fetchData();
    }, []);

    return (
        <div>
            {matches ?
                <Typography className="dashboard-heading" variant="h3" component="h1">
                    Your Orders
                </Typography>
                :
                <Typography className="dashboard-heading" variant="h4" component="h1">
                    Your Orders
                </Typography>
            }
            {entities.orders.length > 0 ?
                <Grid container style={{ marginTop: "5rem" }} align="center">
                    {entities.orders.map(order => (
                        <Grid item xs={12} key={order._id}>
                            <OrderCard
                                key={order._id}
                                order={order}
                                item={entities.items.find(item => item._id === order.item_id)}
                                buyer={false}
                                vendor={entities.vendors.find(vendor => vendor._id === order.vendor_id)}
                                entities={entities}
                                setEntities={setEntities}
                            />
                        </Grid>
                    ))}
                </Grid>
                :
                <Typography variant="h5" component="h1">
                    You have no orders.
                </Typography>
            }
        </div>
    );
};

export default BuyerOrders;
