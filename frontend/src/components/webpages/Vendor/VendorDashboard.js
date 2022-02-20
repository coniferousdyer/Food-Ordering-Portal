import { useState, useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import ItemCard from "../../templates/ItemCard";
import axios from "axios";
import ItemAdd from "../../templates/ItemAdd";


const VendorDashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("/api/items/vendor", {
        headers: {
          authorization: localStorage.getItem("token")
        }
      })
      .then(res => {
        setItems(res.data);
      });
  }, []);

  // Calculate the average rating for the item
  const computeRating = item => {
    let sum = 0;
    for (let i = 0; i < item.rating.count; i++) {
      sum += item.rating.ratings[i];
    }
    let res = sum / parseFloat(item.rating.count);
    return isNaN(res) ? 0 : res;
  }

  // Handle item deletion
  const handleDelete = item => {
    setItems(items.filter(i => i._id !== item._id));
  };

  // Handle item update
  const handleUpdate = item => {
    setItems(items.map(i => (i._id === item._id ? item : i)));
  };

  // Handle item addition
  const handleAddition = item => {
    setItems([...items, item]);
  };

  const matches = useMediaQuery('(min-width:480px)');

  return (
    <div>
      {matches ?
        <Typography className="dashboard-heading" variant="h3" component="h1">
          My Items
        </Typography>
        :
        <Typography className="dashboard-heading" variant="h4" component="h1">
          My Items
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
        {items.length > 0 ?
          items.map((item) => {
            return (
              <Grid key={item._id} item xs={10} sm={6} md={4} lg={3}>
                <ItemCard
                  item={item}
                  vendor=""
                  computeRating={computeRating}
                  onEdit={handleUpdate}
                  onDelete={handleDelete}
                />
              </Grid>
            );
          })
          :
          <Typography variant="h5" component="h1">
            No items listed yet.
          </Typography>
        }
        <ItemAdd
          onAdd={handleAddition}
        ></ItemAdd>
      </Grid>
    </div>
  );
};

export default VendorDashboard;
