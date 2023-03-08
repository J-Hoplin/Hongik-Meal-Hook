class NoDataFound extends Error {
    constructor() {
        super("No data can be extracted")
    }
}

export default NoDataFound