import React from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";

import { Link } from 'react-router-dom';

export default class Racks extends React.Component {
    constructor() {
        super();
        this.state = {
            cars: [],
            track1:[
                ['Euros', 'Coûts des réparations', 'Chiffres de vente','Chiffre d\'affaire'],
                ['Bilan 2021', 2000, 5000, 3000]
              ]
        }
    }
    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars').then(res => {
            this.props.setLoading(false);
            if(res.data.status) {
                this.setState({cars: res.data.cars})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        })
    }

    render() {
        return (
            <div>
                <h4>Voir les chiffres</h4>
                <div id="graph">
                    <Chart
                        width={'1500px'}
                        height={'700px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={this.state.track1}
                        options={{
                        // Material design options
                        chart: {
                            title: 'Synthèse annuelle de la concession'
                        },
                        colors: ['#b0120a', '#ffab91','#e5e4e2'],
                        }}
                    />
                </div>

            </div>
        )
    }
}