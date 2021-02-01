import React from 'react';
import Helper from '../helper.js';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '', autocompleteNames: [] };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleClick(ref) {
        console.log("handleClick");
        this.setState({ value: ref.target.outerText, autocompleteNames: [] });
        this.props.characterListBySearch([ref.target.outerText], this.state.value);
    }

    handleChange(event, nameCharacters) {
        const value = event.target.value;
        const autocompleteNames = nameCharacters.filter(character => {
            if (character.substr(0, value.length).toUpperCase() === value.toUpperCase()) {
                return true;
            } else {
                return false;
            }
        });
        this.setState({ value, autocompleteNames });
        this.props.characterListBySearch(autocompleteNames, value);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleFocus() {
        Helper.switchDisplayNoneBlock('autocomplete-list', 'block');
    }

    handleBlur() {
        Helper.switchDisplayNoneBlock('autocomplete-list', 'none');
    }

    render() {
        const { autocompleteNames, value } = this.state;
        const nameCharacters = Helper.getNameCharacters(this.props.characters);

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="autocomplete">
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={event => this.handleChange(event, nameCharacters)}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        value={value} />
                    <div className="autocomplete-list">
                        {autocompleteNames.length && value ? autocompleteNames.map((name, index) => {
                            return (
                                <div
                                    className="autocomplete-items"
                                    key={index}
                                    onMouseDown={ref => this.handleClick(ref)}
                                >
                                    <strong>{name.substr(0, value.length)}</strong>{name.substr(value.length)}
                                </div>
                            )
                        }) : ""}
                    </div>

                </div>
            </form>
        )
    }
}

export default SearchBar;