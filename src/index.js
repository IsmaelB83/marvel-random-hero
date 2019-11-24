const axios = require('axios');
const md5 = require('md5')

/**
 * Provides a wrapper over the Marvel API. This allows getting a random hero/comic each time you call it 
 * (between 1 and 1493).
 * @param {String} apiKey Key to user Marvel API -> https://developer.marvel.com/
 */
const marvelrandomhero = (publicKey, privateKey) => {

    // Endpoint in marvel API app
    const endpoint = 'https://gateway.marvel.com:443/v1/public/characters';

    // Check credentials passed as parameters
    if (typeof publicKey !== 'string' || typeof privateKey !== 'string') {
        throw new TypeError('Marvel API requires an api key')
    }

    // Creates the hash information for later calls
    const auth = {
        ts: String(Date.now()),
        publicKey: publicKey,
        privateKey: privateKey,
        hash: ''
    }
    auth.hash = md5(auth.ts + auth.privateKey + auth.publicKey);

    // Initial limit o heros
    let limitCharacters = 1000;

    // Returns an object with the functionality provided by this wrapper
    return {
        /**
         * Returns a random character each time you call
         */
        randomCharacter: async () => {
            // Number between 0 and limitCharacters -1
            const random = Math.floor(Math.random() * (limitCharacters -1));
            // Get random character and returns JSON information
            const response = await axios({
                url: `${endpoint}?limit=1&offset=${random}&ts=${auth.ts}&apikey=${auth.publicKey}&hash=${auth.hash}`,
                method: 'get'
            })
            if (response.status === 200) {
                // Adjust limit of characters
                limitCharacters = response.data.data.total;
                // Create result
                const aux = response.data.data.results[0];
                return {
                    id: aux.id,
                    name: aux.name,
                    description: aux.description,
                    thumbnail: `${aux.thumbnail.path}/standard_large.jpg`,
                    date: aux.modified
                }
            }
            return null;
        },
    }
}

module.exports = marvelrandomhero;