import React, { useState, useEffect, useRef } from 'react';

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS

import Button from'@mui/material/Button';

import AddCar from './AddCar'
import EditCar from './EditCar'

export default function CarList() {
    const [cars, setCars] = useState([]);
    const gridRef = useRef();

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('http://carrestapi.herokuapp.com/cars')
        .then(response => response.json())
        .then(responseData => setCars(responseData._embedded.cars))
    }

    // lisää viesti poiston onnistumisesta
    const deleteCarFunc = (link) => {
        if(window.confirm('Are you sure?')) {
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err))
        }
    }

    const saveCar = (car) => {
        fetch('http://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const columns = [
        {
            headerName: 'Brand',
            field: 'brand',
            sortable: true,
            filter: true,
            floatingFilter: 'agTextColumnFilter'
        },
        {
            headerName: 'Model',
            field: 'model',
            sortable: true,
            filter: true,
            floatingFilter: 'agTextColumnFilter'
        },
        {
            headerName: 'Color',
            field: 'color',
            sortable: true,
            filter: true,
            floatingFilter: 'agTextColumnFilter'
        },
        {
            headerName: 'Fuel',
            field: 'fuel',
            sortable: true,
            filter: true,
            floatingFilter: 'agTextColumnFilter'
        },
        {
            headerName: 'Year',
            field: 'year',
            sortable: true,
            filter: true,
            floatingFilter: 'agTextColumnFilter'
        },
        {
            headerName: 'Price',
            field: 'price',
            sortable: true,
            filter: true,
            floatingFilter: 'agTextColumnFilter'
        },
        {
            width: 100,
            headerName: '',
            field: '_links.self.href',
            cellRenderer: row => <EditCar updateCar={updateCar} car={row.data}/>
        },
        {
            width: 100,
            headerName: '',
            field: '_links.self.href',
            cellRenderer: row =>
                <Button
                    variant='outlined'
                    color='error'
                    size='small'
                    onClick = {() => deleteCarFunc(row.value)}
                >
                    Delete
                </Button>
        }
    ]

    return (
        <div
            className="ag-theme-material"
                style={{
                    width: '95%',
                    height: 700,
                    margin: 'auto'}}
        >
            <AddCar saveCar={saveCar} />
            <AgGridReact
                ref={gridRef}
                onGridReady={
                    params => gridRef.current = params.api
                }
                rowSelection='single'
                columnDefs={columns}
                rowData={cars}
                animateRows={true}
                >
            </AgGridReact>
        </div>
    )
}