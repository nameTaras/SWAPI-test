import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import api from '../api.js';
import Config from '../config.js';
import Helper from '../helper.js';
import PERSON_ICON from '../img/PERSON_ICON.webp';

class CharacterProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            character: {},
            homeworld: [],
            vehicles: [],
            films: [],
            liked: false,
            characterNumber: null,
            characterPhoto: null
        };

        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.handleAddPhoto = this.handleAddPhoto.bind(this);
    }

    handleAddPhoto(event) {
        const characterPhotos = JSON.parse(window.localStorage.getItem('characterPhotos') || "[]");
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            let newList = [];
            newList = characterPhotos.map(character => {
                if (character.characterNumber === this.state.characterNumber) {
                    character.photo = reader.result;
                    return character;
                }
                return character;
            });

            if (!newList.find(character => character.characterNumber === this.state.characterNumber)) {
                newList.push({ characterNumber: this.state.characterNumber, photo: reader.result });
            }
            window.localStorage.setItem('characterPhotos', JSON.stringify(newList));
            this.setState({ characterPhoto: reader.result });
        }
    }

    handleLikeClick() {
        const { liked, characterNumber } = this.state;

        Helper.updateLikedLocalStorage(liked, characterNumber);
        this.setState((state) => ({ liked: !state.liked }));
    }

    async loadCharacter() {
        const characterNumber = +(this.props.history.location.search.split('=')[1]);
        const liked = Helper.isLiked(characterNumber);

        const localPhotos = Helper.getLocalStoragePhoto(characterNumber);
        let characterPhoto = null;
        if (localPhotos) characterPhoto = localPhotos.photo;

        let character = null;
        try {
            character = await api(`${Config.urlGetCharacters}/${characterNumber}`);
        } catch (error) {
            console.error(error);
        }

        const parameterNames = ['films', 'vehicles', 'homeworld'];
        const parameters = await Helper.getCharacterParameters(character, parameterNames);

        this.setState({
            character,
            characterNumber,
            liked,
            characterPhoto,
            ...parameters
        });
    }

    componentDidMount() {
        this.loadCharacter();
    }

    handleImgClick() {
        document.querySelector(".upgrate-photo-btn").click();
    }

    render() {
        const { character, homeworld, vehicles, films, characterPhoto } = this.state;

        return (<>
            <button className="home-button"><Link to="/">Home</Link></button>
            <div className="character-profile">
                <div className="avatar">
                    <img
                        src={characterPhoto || PERSON_ICON}
                        width="150px"
                        onClick={this.handleImgClick}
                        alt="avatar" />
                    <input className="upgrate-photo-btn" type="file" onChange={this.handleAddPhoto} />
                </div>
                <button className="like__btn" onClick={this.handleLikeClick}>
                    {this.state.liked ? "Liked" : "Like"}
                </button>
                <h2>{character.name}</h2>
                <p>Height: {character.height}</p>
                <p>Mass: {character.mass}</p>
                <p>Hair color: {character.hair_color}</p>
                <p>Skin color: {character.skin_color}</p>
                <p>Eye color: {character.eye_color}</p>
                <p>Birth year: {character.birth_year}</p>
                <p>Gender: {character.gender}</p>
                <p>Height: {character.height}</p>
                {homeworld.length ? <p>Homeworld: {homeworld[0].name}</p> : ''}
                {
                    vehicles.length ?
                        <div>
                            <h4>Vehicles:</h4>
                            <ul>
                                {vehicles.map((vehicle, index) => {
                                    return <li key={index}>
                                        <strong>Name</strong>: {vehicle.name},
                                        <strong>model</strong>: {vehicle.model}.
                                    </li>
                                })}
                            </ul>
                        </div> : ''
                }
                {
                    films.length ?
                        <div>
                            <h4>Films:</h4>
                            <ul>
                                {films.map((film, index) => {
                                    return <li key={index}><strong>Name</strong>: {film.title}.</li>
                                })}
                            </ul>
                        </div> : ''
                }
            </div>
        </>
        )
    }
}

export default withRouter(CharacterProfile);