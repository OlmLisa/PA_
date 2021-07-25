import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

export default class AllCars extends React.Component {
    constructor() {
        super();
        this.state = {
            cars: []
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
        const tbody = this.state.cars.map(car => {
            return <tr key={car.Key}>
                <td>{car.Record.make}</td>
                <td>{car.Record.model}</td>
                <td>{car.Record.color}</td>
                <td>{car.Record.coutvente}</td>
                <td>{car.Record.owner}</td>
                <td>{car.Record.departarrivee}</td>
                <td>{car.Record.coutreparation}</td>
                <td>
                    <Link to={'/change-owner/' + car.Key} className="waves-effect waves-light btn light-blue darken-3"><i className="material-icons">edit</i></Link>
                </td>
            </tr>
        })
        return (
            <div>
                <h4>Toutes les voitures</h4>
                <table className='striped responsive-table centered'>
                    <thead>
                        <tr>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Couleur</th>
                            <th>Prix</th>
                            <th>Propriétaire</th>
                            <th>etat</th>
                            <th>cout reparation</th>
                            <th style={{width: 100}}>Détail</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tbody}
                    </tbody>
                </table>
            </div>
        )
    }
}
