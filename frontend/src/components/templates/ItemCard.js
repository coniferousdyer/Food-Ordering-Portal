import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ItemBuy from './ItemBuy';
import ItemChange from './ItemChange';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import Swal from "sweetalert2";
import { user_type } from "../../lib/auth";


const ItemCard = ({ item, vendor, computeRating, onEdit, onDelete }) => {
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        if (user_type() === 'buyer') {
            axios
                .get(`/api/buyers/details`, {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(res => {
                    const buyer = res.data;
                    const isFavourite = buyer.favourite_items.some(f => f === item._id);
                    setIsFavourite(isFavourite);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [item]);

    // Handle favourite addition
    const handleFavouriteAdd = () => {
        axios
            .patch(`/api/buyers/add_favourite`, {
                item_id: item._id
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                setIsFavourite(true);
                Swal.fire({
                    title: 'Favourite added!',
                    text: `You added ${item.name} to your favourites!`,
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

    // Handle favourite removal
    const handleFavouriteRemove = () => {
        axios
            .patch(`/api/buyers/remove_favourite`, {
                item_id: item._id
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                setIsFavourite(false);
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

    return (
        <Card style={{
            position: 'relative',
        }}>
            {!isFavourite ?
                user_type() === 'buyer' &&
                <FavoriteBorderIcon
                    aria-label="toggle favourite"
                    style={{
                        position: 'absolute',
                        top: "0.5rem",
                        right: "0.5rem",
                        color: '#ff69b4',
                        cursor: 'pointer',
                    }}
                    onClick={handleFavouriteAdd}
                />
                :
                user_type() === 'buyer' &&
                <FavoriteIcon
                    aria-label="toggle favourite"
                    style={{
                        position: 'absolute',
                        top: "0.5rem",
                        right: "0.5rem",
                        color: '#ff69b4',
                        cursor: 'pointer',
                    }}
                    onClick={handleFavouriteRemove}
                />
            }
            <CardMedia
                component="img"
                height="250"
                image={'/api/public/images/' + item.image}
                alt="food"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2" style={{ marginTop: "0.5rem" }}>
                    {item.name}
                </Typography>
                <Rating name="read-only" value={computeRating(item)} readOnly />
                {vendor !== "" ?
                    <Typography variant="body2" color="textSecondary" component="p">
                        {vendor.shop_name}
                    </Typography>
                    :
                    null
                }
                <Typography variant="body2" color="textSecondary" component="p">
                    {`Price: Rs. ${item.price}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {`Category: ${item.category}`}
                </Typography>
                {item.tags.length > 0 &&
                    <div>
                        <Grid
                            direction="row"
                            justifyContent="center"
                            container
                            spacing={1}
                            marginTop={3}
                        >
                            {item.tags.map((tag, index) => (
                                <Grid item key={index}>
                                    <Chip key={index} label={tag} color="primary" variant="outlined" />
                                </Grid>
                            ))}
                        </Grid>
                        {vendor !== "" ?
                            <ItemBuy
                                item={item}
                                vendor={vendor}
                            />
                            :
                            <ItemChange
                                item={item}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        }
                    </div>
                }
            </CardContent>
        </Card>
    );
};

export default ItemCard;
