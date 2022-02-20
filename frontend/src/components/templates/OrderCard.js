import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Rating from '@mui/material/Rating';
import moment from "moment";
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';
import { user_type } from '../../lib/auth';


const OrderCard = ({ buyer, order, item, vendor, entities, setEntities }) => {
    const [rating, setRating] = useState(order.rating);

    const matches = useMediaQuery('(min-width:480px)');

    // Handle rating change
    const handleRatingChange = value => {
        axios
            .patch(`/api/items/update_rating`, {
                item_id: item._id,
                order_id: order._id,
                rating: value
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                setRating(computeRating(res.data.item));
                setEntities({
                    ...entities,
                    items: entities.items.map(i => (i._id === item._id ? res.data.item : i)),
                    orders: entities.orders.map(o => (o._id === order._id ? res.data.order : o))
                });

                Swal.fire({
                    title: 'Rating updated!',
                    text: `You rated ${item.name} ${value}/5!`,
                    icon: 'success',
                    confirmButtonText: 'OK'
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

    // Handle order status change
    const handleStatusUpdate = () => {
        axios
            .patch(`/api/orders/update_state`, {
                order_id: order._id,
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                setEntities({
                    ...entities,
                    orders: entities.orders.map(o => (o._id === order._id ? res.data.order : o))
                });

                Swal.fire({
                    title: 'Order status updated!',
                    text: `Order status updated to ${res.data.order.state}!`,
                    icon: 'success',
                    confirmButtonText: 'OK'
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
            })
    };

    // Handle order rejection
    const handleRejection = () => {
        axios
            .patch(`/api/orders/reject`, {
                order_id: order._id,
                buyer_id: buyer._id,
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                setEntities({
                    ...entities,
                    items: entities.items.map(i => (i._id === item._id ? res.data.item : i)),
                    orders: entities.orders.map(o => (o._id === order._id ? res.data.order : o))
                });

                Swal.fire({
                    title: 'Order rejected!',
                    text: `Order successfully rejected!`,
                    icon: 'success',
                    confirmButtonText: 'OK'
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
            })
    };

    // Calculate the average rating for the item
    const computeRating = item => {
        let sum = 0;
        for (let i = 0; i < item.rating.count; i++) {
            sum += item.rating.ratings[i];
        }
        let res = sum / parseFloat(item.rating.count);
        return isNaN(res) ? 0 : res;
    }

    return (
        <Card style={{ margin: "1rem", width: matches ? "50%" : "90%" }}>
            <CardContent align="left" style={{ paddingLeft: "3rem" }}>
                <Typography variant="h5" component="h2" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    {item.name}
                </Typography>
                {user_type() === 'buyer' ?
                    <Typography variant="body2" component="p">
                        {vendor.shop_name}
                    </Typography>
                    :
                    <Typography variant="body2" component="p">
                        {buyer.name}
                    </Typography>
                }
                <Typography variant="body2" component="p">
                    Rs. {order.cost}
                </Typography>
                <Typography variant="body2" component="p">
                    Placed: {moment(order.placed_time).format("MMMM Do YYYY, h:mm:ss a")}
                </Typography>
                <Typography variant="body2" component="p">
                    Quantity: {order.quantity}
                </Typography>
                {order.addons.length > 0 ?
                    <Grid container>
                        {order.addons.map(addon => (
                            <Chip
                                key={addon._id}
                                label={`${addon.addon_name} - Rs. ${addon.addon_price}`}
                                style={{
                                    marginTop: "1rem",
                                    marginRight: "0.5rem",
                                }}
                            />
                        ))}
                    </Grid>
                    :
                    <Typography variant="body2" component="p">
                        No addons selected
                    </Typography>
                }
                <div>
                    {rating > 0 || user_type() === "vendor" ?
                        <Rating
                            style={{ marginTop: "1rem" }}
                            name="simple-controlled"
                            readOnly
                            value={order.rating}
                        />
                        :
                        order.state === "COMPLETED" &&
                        <Rating
                            style={{ marginTop: "1rem" }}
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                handleRatingChange(newValue);
                            }}
                        />
                    }
                </div>
                <Chip
                    label={order.state}
                    style={{
                        marginTop: "1rem",
                        marginRight: "0.5rem",
                        backgroundColor: order.state === "PLACED" || order.state === "ACCEPTED" || order.state === "COMPLETED" ? "green" : order.state === "REJECTED" ? "red" : "orange",
                        color: "white"
                    }}
                />
                {user_type() === "vendor" && order.state !== "COMPLETED" && order.state !== "REJECTED" ?
                    <Grid container>
                        {order.state !== "READY FOR PICKUP" &&
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: "1.5rem" }}
                                onClick={handleStatusUpdate}
                            >
                                Move To Next Stage
                            </Button>
                        }
                        {order.state === "PLACED" &&
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ marginTop: "1.5rem", marginLeft: order.state === "READY FOR PICKUP" ? "0rem" : "1rem" }}
                                onClick={handleRejection}
                            >
                                Reject Order
                            </Button>
                        }
                    </Grid>
                    :
                    order.state === "READY FOR PICKUP" &&
                    <Grid container>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "1.5rem" }}
                            onClick={handleStatusUpdate}
                        >
                            Pick Up
                        </Button>
                    </Grid>
                }
            </CardContent>
        </Card >
    );
};

export default OrderCard;
