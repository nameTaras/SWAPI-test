export default async function(uri) {
    let data = null;
    
    try {
        const response = await fetch(uri);
        data = await response.json();    
    } catch (error) {
        console.error(error);
    }

    return data;
}