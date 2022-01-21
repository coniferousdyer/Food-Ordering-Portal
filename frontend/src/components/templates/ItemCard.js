import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import { Grid } from '@mui/material';


const ItemCard = ({ item, vendor }) => {
    // Calculate the average rating for the item
    const computeRating = () => {
        let sum = 0;
        for (let i = 0; i < item.rating.count; i++) {
            sum += item.rating.ratings[i];
        }
        return (sum / item.rating.count);
    }

    return (
        <Card>
            <CardMedia
                component="img"
                image={`data:image/png;base64,${item.image}`}
                height="140"
                alt={item.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                </Typography>
                <Rating name="read-only" value={computeRating()} readOnly />
                <Typography variant="body2" color="textSecondary" component="p">
                    {vendor.shop_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {`Price: Rs. ${item.price}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {`Category: ${item.category}`}
                </Typography>
                {item.tags.length > 0 &&
                    <Grid
                        direction="row"
                        justifyContent="center"
                        container
                        spacing={1}
                        marginTop={3}
                    >
                        {item.tags.map((tag, index) => (
                            <Grid item>
                                <Chip key={index} label={tag} color="primary" variant="outlined" />
                            </Grid>
                        ))}
                    </Grid>
                }
            </CardContent>
        </Card>
    );
};

export default ItemCard;
