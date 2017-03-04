const waitPromise = () => {
    let progress

    const wait = new Promise(resolve => {
        progress = resolve
    })

    return {
        wait,
        progress,
    }
}

export { waitPromise }
