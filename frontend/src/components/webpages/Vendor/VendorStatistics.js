import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { VictoryBar, VictoryChart, VictoryPie, VictoryTooltip } from "victory";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import { user_is_authenticated, user_type } from '../../../lib/auth';


const VendorStatistics = () => {
    const [entities, setEntities] = useState({
        orders: [],
        items: [],
        vendor: {},
        buyers: [],
    });

    const matches = useMediaQuery('(min-width:480px)');

    useEffect(() => {
        if (user_type() === 'vendor') {
            async function fetchData() {
                const response_1 = await axios.get('/api/orders/vendor', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                });
                const response_2 = await axios.get('/api/items', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                });
                const response_3 = await axios.get('/api/vendors/details', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                });
                const response_4 = await axios.get('/api/buyers', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                });

                setEntities({
                    orders: response_1.data,
                    items: response_2.data,
                    vendor: response_3.data,
                    buyers: response_4.data,
                })
            }

            fetchData();
        }
    }, []);

    // Compute pending orders
    const pendingOrders = () => {
        let count = 0;
        entities.orders.forEach(order => {
            if (order.state !== 'REJECTED' && order.state !== 'COMPLETED') {
                count++;
            }
        });

        return count;
    }

    // Compute completed orders
    const completedOrders = () => {
        let count = 0;
        entities.orders.forEach(order => {
            if (order.state === 'COMPLETED') {
                count++;
            }
        });

        return count;
    }

    // Obtain top 5 sold items
    const top5SoldItems = () => {
        let itemCount = {};
        entities.orders.forEach(order => {
            if (order.state === 'COMPLETED') {
                const item = entities.items.find(item => item._id === order.item_id);
                if (itemCount[item.name]) {
                    itemCount[item.name] += order.quantity;
                } else {
                    itemCount[item.name] = order.quantity;
                }
            }
        });

        let top5 = [];
        for (let item in itemCount) {
            top5.push({
                item_name: item,
                count: itemCount[item]
            });
        }

        top5.sort((a, b) => {
            return b.count - a.count;
        });

        return top5.slice(0, 5);
    }

    // Obtain batch-wise statistics
    const batchStatistics = () => {
        let batches = [];
        entities.orders.forEach(order => {
            if (order.state === 'COMPLETED') {
                const id = order.buyer_id;
                const buyer = entities.buyers.find(buyer => buyer._id === id);
                const batch = buyer.batch;
                if (batches.find(b => b.x === batch)) {
                    batches.find(b => b.x === batch).y++;
                } else {
                    batches.push({
                        x: batch,
                        y: 1
                    });
                }
            }
        });

        return batches;
    }

    // Obtain age-wise statistics
    const ageStatistics = () => {
        let ages = [];
        entities.orders.forEach(order => {
            if (order.state === 'COMPLETED') {
                const id = order.buyer_id;
                const buyer = entities.buyers.find(buyer => buyer._id === id);
                const age = buyer.age;
                if (ages.find(a => a.x === String(age))) {
                    ages.find(a => a.x === String(age)).y++;
                } else {
                    ages.push({
                        x: String(age),
                        y: 1
                    });
                }
            }
        });

        return ages;
    }

    return (
        user_type() === 'vendor' ?
            <div className="vendor-statistics">
                <Grid container direction="column" spacing={4} alignItems="center">
                    <Grid item xs={12}>
                        {matches ?
                            <Typography className="registration-heading" variant="h3" component="h1">
                                {entities.vendor.shop_name}'s Statistics
                            </Typography>
                            :
                            <Typography className="registration-heading" variant="h4" component="h1">
                                {entities.vendor.shop_name}'s Statistics
                            </Typography>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h1">
                            ORDER STATISTICS
                        </Typography>
                        <TableContainer component={Paper} style={{ marginTop: '1.5rem' }}>
                            <Table aria-label="simple table">
                                <TableBody>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Orders Placed
                                        </TableCell>
                                        <TableCell align="right">
                                            {entities.orders.length}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Pending Orders
                                        </TableCell>
                                        <TableCell align="right">
                                            {pendingOrders()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Completed Orders
                                        </TableCell>
                                        <TableCell align="right">
                                            {completedOrders()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h1">
                            TOP 5 ITEMS SOLD
                        </Typography>
                        <TableContainer component={Paper} style={{ marginTop: '1.5rem' }}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }} align="right">Number Sold</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {top5SoldItems().map((row) => (
                                        <TableRow
                                            key={row.item_name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.item_name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Card className="batch-statistics">
                            <CardContent>
                                <Typography variant="h5" component="h1">
                                    BATCH-WISE STATISTICS
                                </Typography>
                                <Grid container direction="row" spacing={4}>
                                    <Grid item xs={6}>
                                        <VictoryPie
                                            data={batchStatistics()}
                                            colorScale={["#00a1e4", "#fbc02d", "#8e24aa", "#d81b60", "#039be5"]}
                                            labelComponent={<VictoryTooltip />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <VictoryChart horizontal
                                            domainPadding={{ x: 8 }}
                                        >
                                            <VictoryBar
                                                data={batchStatistics()}
                                                style={{
                                                    data: { fill: "#c43a31" }
                                                }}
                                            />
                                        </VictoryChart>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: "3rem" }}>
                        <Card className="age-statistics">
                            <CardContent>
                                <Typography variant="h5" component="h1">
                                    AGE-WISE STATISTICS
                                </Typography>
                                <Grid container direction="row" spacing={4}>
                                    <Grid item xs={6}>
                                        <VictoryPie
                                            data={ageStatistics()}
                                            colorScale={["#00a1e4", "#fbc02d", "#8e24aa", "#d81b60", "#039be5"]}
                                            labelComponent={<VictoryTooltip />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <VictoryChart horizontal
                                            domainPadding={{ x: 8 }}
                                        >
                                            <VictoryBar
                                                data={ageStatistics()}
                                                style={{
                                                    data: { fill: "#c43a31" }
                                                }}
                                            />
                                        </VictoryChart>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            :
            matches ?
                user_is_authenticated() ?
                    <div className="welcome-page">
                        <Typography className="welcome-heading" variant="h2" component="h1">
                            This route is not accessible by buyers
                        </Typography>
                        <Typography variant="h6" component="h1">
                            Please login through a vendor account to continue
                        </Typography>
                    </div>
                    :
                    <div className="welcome-page">
                        <Typography className="welcome-heading" variant="h2" component="h1">
                            You are not logged in
                        </Typography>
                        <Typography variant="h6" component="h1">
                            Please login or register to continue
                        </Typography>
                    </div>
                :

                user_is_authenticated() ?
                    <div className="welcome-page">
                        <Typography className="welcome-heading" variant="h4" component="h1">
                            This route is not accessible by vendors
                        </Typography>
                        <Typography variant="h6" component="h1">
                            Please login through a buyer account to continue
                        </Typography>
                    </div>
                    :

                    <div className="welcome-page">
                        <Typography className="welcome-heading" variant="h4" component="h1">
                            You are not logged in
                        </Typography>
                        <Typography variant="h6" component="h1">
                            Please login or register to continue
                        </Typography>
                    </div>
    );
};

export default VendorStatistics;
