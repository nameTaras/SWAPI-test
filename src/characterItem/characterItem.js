import React from 'react';
import { Link } from "react-router-dom";
import api from '../api.js';
import Helper from '../helper.js';
import GENDER_ICON_OF_FEMALE from '../img/GENDER_ICON_OF_FEMALE.png';
import GENDER_ICON_OF_MALE from '../img/GENDER_ICON_OF_MALE.png';

class CharacterItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { homeworld: '', liked: false };

        this.handleLikeClick = this.handleLikeClick.bind(this);
    }

    handleLikeClick(name) {
        const { liked } = this.state;
        const { characterNumber, characterListByLiked } = this.props;

        Helper.updateLikedLocalStorage(liked, characterNumber);
        characterListByLiked(name);
        this.setState((state) => ({ liked: !state.liked }));
    }

    async loadCharacterHomeworld() {
        const { characterNumber, character } = this.props;
        const liked = Helper.isLiked(characterNumber);

        let homeworld = null;

        try {
            const response = await api(character.homeworld);
            homeworld = response.name;
        } catch (error) {
            console.error(error);
        }

        this.setState({ homeworld, liked });
    }

    componentDidMount() {
        this.loadCharacterHomeworld();
    }

    render() {
        const { name, gender } = this.props.character;
        const genderIcon = gender === "male" ? GENDER_ICON_OF_MALE : GENDER_ICON_OF_FEMALE;

        return (
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <p className="flip-card-front-name">{name}</p>
                        <img src={genderIcon} />
                    </div>
                    <div id={gender} className={`flip-card-back`}>
                        {<h1>
                            <Link
                                className="flip-card-back-name"
                                to={`/characterProfile?id=${this.props.characterNumber}`}
                            >
                                {name}
                            </Link>
                        </h1>}
                        <p>Gender: {gender}</p>
                        {this.state.homeworld && <p>Homeworld: {this.state.homeworld}</p>}
                        <button className="like__btn" onClick={() => this.handleLikeClick(name)}>
                            {this.state.liked ? "Liked" : "Like"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CharacterItem;