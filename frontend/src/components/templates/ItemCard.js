import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ItemBuy from './ItemBuy';
import ItemChange from './ItemChange';


const ItemCard = ({ item, vendor, computeRating, onEdit, onDelete }) => {
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2" style={{ marginTop: "1.5rem" }}>
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
