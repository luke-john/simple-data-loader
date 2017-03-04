export const getResource = <APIShape>(
    url: string
) =>
    fetch(url)
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Unexpected API response')
            }
            return response
        })
        .then(response => response.json())
        .then((data: any) => {
            return (data as APIShape)
        })
