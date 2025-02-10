import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button, Table, Card, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AnalyticsPage = () => {
    const [kpiData, setKpiData] = useState(null);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [salesByPriceRange, setSalesByPriceRange] = useState([]);
    const [radar, setRadar] = useState(false);

    useEffect(() => {
        fetchKpiData();
        fetchSalesByCategory();
        fetchSalesByPriceRange();
    }, []);

    const fetchKpiData = async () => {
        const response = await axios.get("http://localhost:5000/analytics/api/analytics/kpi");
        //const data = await response.data.json();
        setKpiData(response.data);
    };

    const fetchSalesByCategory = async () => {
        const response = await axios.get("http://localhost:5000/analytics/api/analytics/sales_by_category");
        //const data = await response.json();
        setSalesByCategory(response.data);
    };

    const fetchSalesByPriceRange = async () => {
        const response = await axios.get("http://localhost:5000/analytics/api/analytics/price_range");
        //const data = await response.json();
        setSalesByPriceRange(response.data);
    };

    return (
        <div className='products container-fluid lm_main'>

            <div className='row'>

                <div className='col-2 p-3 lm_menu d-flex flex-column'>
                    <h3 className='font-weight-bold mb-3 p-2 text-center'>Menù</h3>
                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/home">All products</Link>
                    </div>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/categories">All categories</Link>
                    </div>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/users">All users</Link>
                    </div>
                </div>
                <div className='col-10 h-100 lm_inner_menu p-4'>

                    {/* KPI Cards */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
                        {kpiData && (
                            <>
                                <Row className="g-4">


                                    {/* Card 2 */}
                                    <Col md={6} lg={4}>
                                        <Card className="shadow-sm border-0 rounded-2">
                                            <Card.Body>
                                                <h6>Products Sales</h6>
                                                <p className="text-muted small">Products from all e-commerce</p>
                                                <h5>${kpiData.total_sales} <small className="text-success">+4.6%</small></h5>
                                                {/* <p className="text-muted small">Another $48,346 to Goal</p> */}
                                                {/* Placeholder for line chart */}
                                                <div className="chart-placeholder bg-light rounded p-3">Line Chart Placeholder</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6} lg={4}>
                                        <Card className="shadow-sm border-0 rounded-2">
                                            <Card.Body>
                                                <h6>Total Orders</h6>
                                                <p className="text-muted small">Orders from all e-commerce</p>
                                                <h5>{kpiData.total_orders} <small className="text-success">+4.6%</small></h5>
                                                {/* <p className="text-muted small">Another $48,346 to Goal</p> */}
                                                {/* Placeholder for line chart */}
                                                <div className="chart-placeholder bg-light rounded p-3">Line Chart Placeholder</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6} lg={4}>
                                        <Card className="shadow-sm border-0 rounded-2">
                                            <Card.Body>
                                                <h6>Average Sales</h6>
                                                <p className="text-muted small">Average Sales from all e-commerce</p>
                                                <h5>${kpiData.average_sales} <small className="text-success">+4.6%</small></h5>
                                                {/* <p className="text-muted small">Another $48,346 to Goal</p> */}
                                                {/* Placeholder for line chart */}
                                                <div className="chart-placeholder bg-light rounded p-3">Line Chart Placeholder</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6} lg={4}>
                                        <Card className="shadow-sm border-0 rounded-2">
                                            <Card.Body>
                                                <div className="bg-white shadow-md rounded-xl p-6">
                                                    <h4 className="text-lg font-bold mb-4 text-gray-600">Sales by Price Range</h4>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={salesByPriceRange}
                                                                dataKey="count"
                                                                nameKey="price_range"
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={50}
                                                                outerRadius={80}
                                                                // outerRadius={100}
                                                                label
                                                            >
                                                                {salesByPriceRange.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={["#414287", "#008ffb", "#ff4560"][index % 3]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                            <Legend
                                                                verticalAlign="bottom"
                                                                height={36}
                                                                iconType="square"
                                                                layout="horizontal"
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>



                                    {radar ?
                                        <Col md={6} lg={8}>
                                            <Card className="shadow-sm border-0 rounded-2">
                                                <Card.Body>
                                                    <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                                                        <Row>
                                                            <Col lg={6}>
                                                                <h4 className="text-lg font-bold mb-4 text-gray-600">Sales by Category (Radar Chart)</h4></Col>
                                                            <Col lg={4} className="ms-auto"><Button onClick={() => setRadar(false)} className="border-0" id="lm_graph_button">Change Graph</Button></Col>
                                                        </Row>
                                                        <ResponsiveContainer width="100%" height={300}>
                                                            <RadarChart data={salesByCategory}>
                                                                <PolarGrid />
                                                                <PolarAngleAxis dataKey="category" />
                                                                <PolarRadiusAxis />
                                                                <Radar
                                                                    name="Total Sales"
                                                                    dataKey="total_sales"
                                                                    stroke="#9b4dca"
                                                                    fill="#9b4dca"
                                                                    fillOpacity={0.6}
                                                                />
                                                                <Tooltip />
                                                            </RadarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        :
                                        <Col md={6} lg={8}>
                                            <Card className="shadow-sm border-0 rounded-2">
                                                <Card.Body>
                                                    <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                                                        <Row>
                                                            <Col lg={6}>
                                                                <h4 className="text-lg font-bold mb-4 text-gray-600">Sales by Category</h4></Col>
                                                            <Col lg={4} className="ms-auto"><Button onClick={() => setRadar(true)} className="border-0" id="lm_graph_button">Change Graph</Button></Col>
                                                        </Row>


                                                        <ResponsiveContainer width="100%" height={300}>
                                                            <BarChart data={salesByCategory}>
                                                                <XAxis dataKey="category" stroke="#555" />
                                                                <YAxis />
                                                                <Tooltip />

                                                                {/* Only one Bar, and map colors for each category */}
                                                                <Bar dataKey="total_sales" barSize={50}>
                                                                    {salesByCategory.map((entry, index) => (
                                                                        <Cell
                                                                            key={`cell-${entry.category}`}
                                                                            fill={["#cf1578", "#e8d21d", "#039fbe", "#b20238", "#3b4d61", "#1e847f"][index % 6]}  // Color each bar based on the category
                                                                        />
                                                                    ))}
                                                                </Bar>
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    }

                                </Row>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

const LoggedOutHome = () => {
    return (
        <div className='products'>
            <div className='container-fluid lm_main'>
                <div className='row h-100 justify-content-center align-items-center'>
                    <h1 className='text-center'>Authentication Failed</h1>
                </div>
            </div>


        </div>
    )
}

const AnalyticsAuthPage = () => {

    const [logged] = useAuth()
    return (
        <div>
            {logged ? <AnalyticsPage /> : <LoggedOutHome />}
        </div>
    )
}


export default AnalyticsAuthPage;