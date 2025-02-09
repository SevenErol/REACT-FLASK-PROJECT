import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Product from './Product'
import { Modal, Form, Button, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Searchbar from './Searchbar'
import axios from 'axios'
import Pagination from 'react-bootstrap/Pagination';
//import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as tailwindConfig from '../tailwind.config';
import Card from 'react-bootstrap/Card';

const AnalyticsPage = () => {
    const [kpiData, setKpiData] = useState(null);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [salesByPriceRange, setSalesByPriceRange] = useState([]);

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
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-700">Analytics Dashboard</h1>

            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title className="text-lg font-semibold text-gray-600">Total Sales</Card.Title>
                    <Card.Text className="text-2xl font-bold text-blue-600">
                        ${kpiData.total_sales}
                    </Card.Text>
                </Card.Body>
            </Card>

            {/* KPI Cards */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
                {kpiData && (
                    <>
                        <div className="bg-white shadow-md rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-600">Total Sales</h2>
                            <p className="text-2xl font-bold text-blue-600">${kpiData.total_sales}</p>
                        </div>

                        <div className="bg-white shadow-md rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
                            <p className="text-2xl font-bold text-green-600">{kpiData.total_orders}</p>
                        </div>

                        <div className="bg-white shadow-md rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-600">Average Sales</h2>
                            <p className="text-2xl font-bold text-yellow-600">${kpiData.average_sales}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Sales by Category Chart */}
            <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-4 text-gray-600">Sales by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesByCategory}>
                        <XAxis dataKey="category" stroke="#555" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_sales" fill="#8884d8" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Sales by Price Range Pie Chart */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-600">Sales by Price Range</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={salesByPriceRange}
                            dataKey="count"
                            nameKey="price_range"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {salesByPriceRange.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


export default AnalyticsPage;