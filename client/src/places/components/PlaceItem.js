import React, {useState, useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItems = props => {
    const auth = useContext(AuthContext);
    const [viewMap, setViewMap] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {isLoading, hasError, sendRequest, clearError} = useHttpClient();

    const openMapHandler = () => setViewMap(true);

    const closeMapHandler = () => setViewMap(false);

    const openDeleteModalHandler = () => setShowDeleteModal(true);

    const closeDeleteModalHandler = () => setShowDeleteModal(false);

    const deleteHandler = async () => {
        setShowDeleteModal(false);
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization : 'Bearer ' + auth.token
                }
            );

            props.onDelete(props.id);
        }
        catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={hasError} onClear={clearError} />
            <Modal
              show={viewMap}
              onCancel={closeMapHandler}
              header={props.address}
              contentClass="place-item__modal-content"
              footerClass="place-item__modal-actions"
              footer={<Button onClick={closeMapHandler}>Close</Button>}
            >
              <div className="map-container">
                <Map center={props.coordinates} zoom={14}/>
              </div>
            </Modal>
            <Modal
              show={showDeleteModal}
              onCancel={closeDeleteModalHandler}
              header="Are you sure ?"
              footerClass="place-item__modal-actions"
              footer={
                <React.Fragment>
                    <Button inverse onClick={closeDeleteModalHandler}>Cancel</Button>
                    <Button danger onClick={deleteHandler}>Delete</Button>
                </React.Fragment>
              }
            >
                <div className="delete-container"><p>Are you sure you want to delete ? This will delete permanently & you can't retrieve back.</p></div>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3><i>{props.address}</i></h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler} >VIEW ON MAP</Button>
                        {auth.userId === props.creatorId &&
                            <Button to={`/places/${props.id}`}>Edit</Button>
                        }
                        {auth.userId === props.creatorId &&
                            <Button danger onClick={openDeleteModalHandler}>Delete</Button>
                        }
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default PlaceItems;