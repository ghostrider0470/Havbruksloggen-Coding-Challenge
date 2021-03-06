import React, {Component, RefObject} from 'react';
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';
import {Boat} from '../../types/data';
import {BoatsList} from "./BoatsList";

interface BoatEditProps{
    boatListRef: BoatsList
}

export class BoatEdit extends Component<BoatEditProps> {
    static displayName = BoatEdit.name;

    boat: Boat = new Boat();
    constructor(props: BoatEditProps) {
        super(props);
        this.state = {
        };
    }

    async sendBoatData(boat:Boat) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(boat)
        };
        const response = await fetch('/api/boats/create', requestOptions);

        const data = await response.json();
        this.setState({
            boats: data.result,
            loading: true
        });
    }
    // @ts-ignore
    getBase64 = file => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL: string | ArrayBuffer | null = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                console.log("Called", reader);
                baseURL = reader.result;
                console.log(baseURL);
                resolve(baseURL);
            };
            console.log(fileInfo);
        });
    };

    // @ts-ignore
    handleFileInputChange = (event) => {
        console.log(event.target.files[0]);
        let file = event.target.files[0];

        this.getBase64(file)
            .then(result => {
                file["base64"] = result;
                console.log(file);
                this.boat.picture = file["base64"];
                this.boat.pictureName = file["name"];
                this.boat.pictureType = file["type"];
            })
            .catch(err => {
                console.log(err);
            });
    }
    // @ts-ignore
    handleSubmit = (event) => {
        event.preventDefault();
        this.boat.name = event.target.name.value;
        this.boat.producer = event.target.producer.value;
        this.boat.buildNumber = event.target.buildNumber.value;
        this.boat.maximumLength = event.target.maximumLength.value;
        this.boat.maximumWidth = event.target.maximumWidth.value;
        //this.boat.picture = event.target.picture.value.
        console.log(this.boat);
        this.sendBoatData(this.boat).then(()=>{
            this.props.boatListRef.populateBoatData();
        });


    }

    render() {
            return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="boatFormName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Black Pearl" name="name"/>
                        <Form.Text className="text-muted">
                            Name of the Boat.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boatFormProd">
                        <Form.Label>Producer</Form.Label>
                        <Form.Control type="text" placeholder="BMW" name="producer" />
                        <Form.Text className="text-muted">
                            Producer of the Boat.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boatFormBuildNum">
                        <Form.Label>Build Number</Form.Label>
                        <Form.Control type="number" placeholder="1233" name="buildNumber"/>
                        <Form.Text className="text-muted">
                            Build Number of the Boat.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boatFormLOA">
                        <Form.Label>LOA</Form.Label>
                        <Form.Control type="number" placeholder="8.6" name="maximumLength"/>
                        <Form.Text className="text-muted">
                            Maximum length of boat, in meters.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boatFormB">
                        <Form.Label>B</Form.Label>
                        <Form.Control type="number" placeholder="2.3" name="maximumWidth"/>
                        <Form.Text className="text-muted">
                            Maximum width of boat, in meters.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boatFormPhoto">
                        <Form.Label>B</Form.Label>
                        <Form.Control type="file" accept="image/*" name="picture" onInput={this.handleFileInputChange}/>
                        <Form.Text className="text-muted">
                           Picture of the boat.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    };
}
