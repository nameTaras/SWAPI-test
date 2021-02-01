import React from 'react';
import { Link, withRouter } from "react-router-dom";
import CharacterItem from '../characterItem/characterItem.js';
import SearchBar from '../searchBar/searchBar.js';
import api from '../api.js';
import Config from '../config.js';
import Helper from '../helper.js';

class CharactersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { characters: [], likedCharacters: [], autocompleteNames: [] };

        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.characterListBySearch = this.characterListBySearch.bind(this);
        this.characterListByLiked = this.characterListByLiked.bind(this);
    }

    handleClickLogout() {
        window.FB.logout(res => {
            if (res.status !== "connected") window.location.replace('/login');
        });
    }

    characterListBySearch(autocompleteNames, searchValue) {
        this.setState({ autocompleteNames, searchValue });
    }

    characterListByLiked(name) {
        if (this.state.isLikedListRoute) {
            this.setState((state) => ({
                characters: state.characters
                    .filter(character => character.name !== name)
            }))
        };
    }

    async loadCharacters() {
        const isLikedListRoute = this.props.history.location.pathname === "/likedList";
        let characters = [];
        let likedCharacters = [];

        try {
            const response = await api(Config.urlGetCharacters);
            characters = response.results;
        } catch (error) {
            console.error(error);
        }

        if (isLikedListRoute) {
            likedCharacters = Helper.getLikedList(characters);
        }

        const autocompleteNames = characters.map(item => item.name);
        this.setState({ characters, likedCharacters, autocompleteNames });
    }

    getCharacterListElement() {
        const { characters, likedCharacters, autocompleteNames } = this.state;

        const characterListElement = characters.map((character, index) => {
            const characterNumberOnSWAPI = index + 1;

            if (likedCharacters.length) {
                const likedCharacter = likedCharacters.find(item => {
                    if (
                        item.name === character.name &&
                        autocompleteNames.includes(item.name)
                    ) {
                        return true;
                    }
                });

                if (likedCharacter) {
                    return <CharacterItem
                        key={index}
                        characterNumber={characterNumberOnSWAPI}
                        character={likedCharacter}
                        characterListByLiked={this.characterListByLiked} />
                } else {
                    return false;
                }
            }

            if (autocompleteNames.includes(character.name)) {
                return <CharacterItem
                    key={index}
                    characterNumber={characterNumberOnSWAPI}
                    character={character}
                    characterListByLiked={this.characterListByLiked} />
            }
        })

        return characterListElement;
    }

    componentDidMount() {
        this.loadCharacters();
    }

    render() {
        const { characters } = this.state;

        return (
            <>
                <header className="header">
                    <nav className="container">
                        <SearchBar
                            characterListBySearch={this.characterListBySearch}
                            characters={characters} />
                        <div className="liked__logout__cta">
                            <Link className="liked__cta" to="/likedList">Liked list</Link>
                            <button className="logout__cta" onClick={this.handleClickLogout}>
                                Logout
                            </button>
                        </div>
                    </nav>
                </header>
                <div className="characters__list">
                    {this.getCharacterListElement()}
                </div>
            </>
        )
    }
}

export default withRouter(CharactersList);