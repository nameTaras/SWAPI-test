function getNameCharacters(characters) {
    return characters.map(character => character.name);
}

function switchDisplayNoneBlock(classSelector, value) {
    const autocompleteList = document.getElementsByClassName(classSelector)[0];
    if (autocompleteList) autocompleteList.style.display = value;
}

function getLikedList(characters) {
    const likedCharactersByFBId = getIdLikedCharacters();

    const filterCharacters = characters.filter((character, index) => {
        const characterNumberOnSWAPI = index + 1;
        return likedCharactersByFBId.includes(characterNumberOnSWAPI);
    });

    return filterCharacters;
}

function updateLikedLocalStorage(liked, characterNumber) {
    const userFBId = window.FB.getUserID();
    const likedCharacters = JSON.parse(window.localStorage.getItem('likedCharacters') || "[]");
    if (liked) {
        const newList =
            JSON.stringify(likedCharacters.filter(character => {
                if (character.characterNumber !== characterNumber && userFBId === character.userFBId) {
                    return true;
                }
            }));
        window.localStorage.setItem('likedCharacters', newList);
    } else {
        likedCharacters.push({ userFBId, characterNumber });
        window.localStorage.setItem('likedCharacters', JSON.stringify(likedCharacters));
    }
}

function isLiked(characterNumber) {
    const likedCharacters = JSON.parse(window.localStorage.getItem('likedCharacters') || "[]");
    const charactersByFBId = getIdLikedCharacters(likedCharacters);
    const liked = charactersByFBId.includes(characterNumber);

    return liked;
}

function getLocalStoragePhoto(characterNumber) {
    return JSON.parse(window.localStorage.getItem('characterPhotos') || "[]").find(character => {
        if (character.characterNumber === characterNumber) {
            return true;
        } else {
            return false;
        }
    });
}

async function getCharacterParameters(character, parameterNames) {
    const parameterUrls = {};

    parameterNames.forEach(name => {
        if (Array.isArray(character[name])) {
            parameterUrls[name] = character[name];
        } else {
            parameterUrls[name] = [character[name]];
        }
    });

    const parameters = {};
    for (let parameter in parameterUrls) {
        const arrUrls = parameterUrls[parameter];
        await Promise.all(arrUrls.map(url => {
            return fetch(url).then(res => res.json());
        })).then(result => parameters[parameter] = result);
    }

    return parameters;
}






function getIdLikedCharacters() {
    const userFBId = window.FB.getUserID();
    const likedCharactersAllUsers = JSON.parse(window.localStorage.getItem('likedCharacters') || "[]");
    const likedCharactersByFBId = likedCharactersAllUsers.map(character => {
        if (character.userFBId === userFBId) {
            return character.characterNumber;
        }
    });

    return likedCharactersByFBId;
}

const Helper = {
    getNameCharacters,
    switchDisplayNoneBlock,
    getLikedList,
    updateLikedLocalStorage,
    isLiked,
    getCharacterParameters,
    getLocalStoragePhoto
}

export default Helper;