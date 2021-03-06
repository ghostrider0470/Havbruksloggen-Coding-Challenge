import React, {Component} from 'react';
import {IBoat, Boat, ICrewMember} from '../../types/data';
import {Boats} from "./Boats";
import {map} from "react-bootstrap/ElementChildren";
import Badge from 'react-bootstrap/Badge'
import {Button, Image} from "react-bootstrap";
import {BoatAdd} from "./BoatAdd";
import Nav from 'react-bootstrap/Nav'
// @ts-ignore
import ReactModal from 'react-modal';
//import {Link} from "react-router-dom";

interface BoatProps {
    boatComponent: Boats
}

interface BoatState {
    boats: Boat[],
    loading: boolean,
    showAddBoatModal: boolean,
    selectedBoat: Boat | null
}

export class BoatsList extends Component<BoatProps, BoatState> {
    static displayName = BoatsList.name;
    private boats: Boat[] = [];
    constructor(props: BoatProps) {
        super(props);
        this.state = {
            selectedBoat: null,
            boats: [],
            loading: true,
            showAddBoatModal: false
        };
        this.handleOpenAddBoatModal = this.handleOpenAddBoatModal.bind(this);
        this.handleCloseAddBoatModal = this.handleCloseAddBoatModal.bind(this);
        this.handleOpenEditBoatModal = this.handleOpenEditBoatModal.bind(this);
        this.redirectToCrew = this.redirectToCrew.bind(this);
    }
    handleOpenAddBoatModal() {
        this.setState({
            showAddBoatModal: true,
            selectedBoat: null
        });
    }
    handleOpenEditBoatModal(boat: Boat) {
        this.setState({
            showAddBoatModal: true,
            selectedBoat: boat
        });
    }
    async handleCloseAddBoatModal() {
        this.setState({
            boats: [],
            loading: true,
            showAddBoatModal: false
        });
        setTimeout('', 500);
        await this.populateBoatData()
    }
    
    componentDidMount() {
        this.populateBoatData();
    }

    async deleteFunc(id: string){
        const requestOptions = {
            method: 'DELETE'
        };
        await fetch('/api/boats/delete?id='+id, requestOptions)
            .then(async (response)=>{
                const data = response.json();
                this.setState({
                    boats: [],
                    loading: true,
                    showAddBoatModal: false
                });
                setTimeout('', 500);
                await this.populateBoatData()
            });


    }

    renderBoatsTable: React.FC<Boat[]> = (boats: Boat[]) => {
        return (
            <div>
                <div>
                    <Nav variant="pills" defaultActiveKey="/home">
                        <Nav.Item>
                            <div>
                                <Button variant="btn btn-primary" onClick={this.handleOpenAddBoatModal}>Add Boat</Button>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="button-margin">
                                <Button
                                    variant="btn btn-primary"
                                    onClick={()=>{
                                        this.setState({
                                            boats: [],
                                            loading: true,
                                            showAddBoatModal: false
                                        });
                                        setTimeout('', 500);
                                        this.populateBoatData()
                                    }}
                                >Refresh
                                </Button>
                            </div>
                        </Nav.Item>
                    </Nav>
                </div>
                <table className='table table-striped center' aria-labelledby="tabelLabel">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Producer</th>
                        <th>Build Number</th>
                        <th>LOA</th>
                        <th>B</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boats.map(boat =>
                        <tr>
                            <td>
                                <Image
                                    height="100px"
                                    src={boat.picture}
                                >
                                </Image>
                            </td>
                            <td>{boat.name}</td>
                            <td>{boat.producer}</td>
                            <td>{boat.buildNumber}</td>
                            <td>{boat.maximumLength.toFixed(2)}</td>
                            <td>{boat.maximumWidth.toFixed(2)}</td>
                            <td>
                                <ul>
                                    <li>
                                        <Badge bg="dark" onClick={()=>{this.redirectToCrew(boat)}}>Crew</Badge>
                                    </li>
                                    <li>
                                        <Badge
                                            bg="warning"
                                            onClick={
                                                () => {
                                                    this.handleOpenEditBoatModal(boat);
                                                }
                                            }
                                        >Edit
                                        </Badge>
                                    </li>
                                    <li>
                                        <Badge
                                            bg="danger"
                                            onClick={
                                                () => {
                                                    this.deleteFunc(boat.id);
                                                }
                                            }
                                        >Delete
                                        </Badge>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    )}

                    </tbody>
                </table>
            </div>
        );
    }
    redirectToCrew(boat:Boat){
        this.props.boatComponent.redirectToCrew(boat);

    }
    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderBoatsTable(this.state.boats);
        return (
            <div>
                <div>
                    <ReactModal
                        isOpen={this.state.showAddBoatModal}
                        contentLabel="Minimal Modal Example"
                    >
                        <BoatAdd boatListRef = {this}/>
                        <Button
                            id = "createModalCloseBtn"
                            variant="secondary"
                            onClick={this.handleCloseAddBoatModal}>
                            Close Modal
                        </Button>
                    </ReactModal>
                </div>
                <h4 id="tabelLabel">Boat Data</h4>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async populateBoatData() {

        const response = await fetch('/api/boats/all');

        const data = await response.json();
        console.log(data)
        this.setState({
            boats: data.result,
            loading: false,
            showAddBoatModal: false
        });
    }

}