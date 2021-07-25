import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class ChangeOwner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: this.props.match.params.key,
            owner: '',
            dated: '',
            datea: '',
            panne:'',
            arrivee:'',
            departarrivee:'',
            reparation: '',
            coutreparation: '',
            redirect: false,
            car: {}
        }
    }

    onOwnerChanged(e) { this.setState({ owner: e.target.value }) }
    onDatedChanged(e) { this.setState({ departarrivee: e.target.value }) }
    onPanneChanged(e) { this.setState({ panne: e.target.value }) }
    onCoutReparationChanged(e) { this.setState({ coutreparation: e.target.value })}
    onDateaChanged(e) { this.setState({ departarrivee: e.target.value }) }
    onArriveeChanged(e) { this.setState({ departarrivee: e.target.value }) }
    onReparationChanged(e) { this.setState({ reparation: e.target.value }) }
    onFormSubmit(e) {
        e.preventDefault();
        this.props.setLoading(true);
        axios.put('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars', {
            key: this.state.key,
            owner: this.state.owner,
            dated: this.state.departarrivee
        }).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                alert(res.data.message);
                this.setState({redirect: true})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        });
    }
    onFormReparationSubmit(e) {
        e.preventDefault();
        this.props.setLoading(true);
        alert(this.state.coutreparation)
        axios.put('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars/reparation', {
            key: this.state.key,
            departarrivee: this.state.departarrivee,
            reparation:this.state.reparation,
            coutreparation: this.state.coutreparation
        }).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                alert(res.data.message);
                this.setState({redirect: true})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        });
    }
    
    onFormPanneSubmit(e) {
        e.preventDefault();
        this.props.setLoading(true);
        axios.put('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars/panne', {
            key: this.state.key,
            panne: this.state.panne,
            arrivee: this.state.departarrivee
        }).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                alert(res.data.message);
                this.setState({6: true})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        });
    }

    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars/' + this.props.match.params.key).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                this.setState({car: res.data.car});
            } else {
                alert(res.data.error.message);
                this.setState({redirect: true});
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }

        const info = typeof this.state.car.owner !== 'undefined' ? <div className="row">
            <div className="col s12">
            <table className='striped responsive-table'>
                <tbody>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Marque :</td><td>{this.state.car.make}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Modèle :</td><td>{this.state.car.model}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Couleur :</td><td>{this.state.car.color}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Proprietaire :</td><td>{this.state.car.owner}</td></tr>        
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Etat départ :</td><td>{this.state.car.dated}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Panne :</td><td>{this.state.car.panne}</td></tr>   
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Etat arrivé :</td><td>{this.state.car.departarrivee}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Reparation :</td><td>{this.state.car.reparation}</td></tr>                 
                </tbody>
            </table>
            </div>
        </div> : <h6>Chargement des informations...</h6>
        return (
            <div>
                <h4>Anciennes informations</h4>1
                {info}
                <h4>Ajout d'un propriétaire</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>
                        <div className="row">
                            <input disabled id="key" type="hidden" className="validate" value={this.state.key} />
                            <div className="input-field col s12">
                                <input id="owner" type="text" className="validate" required value={this.state.owner} onChange={this.onOwnerChanged.bind(this)} />
                                <label htmlFor="owner">Nouveau propriétaire</label>
                            </div>
                            <div className="input-field col s12">
                                <input id="dated" type="text" className="validate" required value={this.state.departarrivee} onChange={this.onDatedChanged.bind(this)} />
                                <label htmlFor="dated">etat départ</label>
                            </div>
                        </div>
                        
                        <div className='row'>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">envoyer
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <h4>Enregistrer une panne sur le véhicule</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormPanneSubmit.bind(this)}>
                        <div className="row">
                            <input disabled id="key" type="hidden" className="validate" value={this.state.key} />
                            <div className="input-field col s12">
                                <input id="panne" type="text" className="validate" required value={this.state.panne} onChange={this.onPanneChanged.bind(this)} />
                                <label htmlFor="panne">Panne</label>
                            </div>
                            <div className="input-field col s12">
                                <input id="arrivee" type="text" className="validate" required value={this.state.departarrivee} onChange={this.onArriveeChanged.bind(this)} />
                                <label htmlFor="arrivee">etat ARRIVEE</label>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">envoyer
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <h4>Enregistrer une réparation suite à une panne sur le véhicule</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormReparationSubmit.bind(this)}>
                        <div className="row">
                            <input disabled id="key" type="hidden" className="validate" value={this.state.key} />
                            <div className="input-field col s12">
                                <input id="reparation" type="text" className="validate" required value={this.state.reparation} onChange={this.onReparationChanged.bind(this)} />
                                <label htmlFor="reparation">Réparation</label>
                            </div>
                            <div className="input-field col s12">
                                <input id="coutreparation" type="text" className="validate" required value={this.state.coutreparation} onChange={this.onCoutReparationChanged.bind(this)} />
                                <label htmlFor="coutreparation">Coût de réparation</label>
                            </div>
                            <div className="input-field col s12">
                                <input id="departarrivee" type="text" className="validate" required value={this.state.departarrivee} onChange={this.onDateaChanged.bind(this)} />
                                <label htmlFor="departarrivee">etat d'arrivée</label>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">envoyer
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
