import * as React from 'react'
import { Component} from 'react'
import { getResource } from './lib/get-resource'

export interface UnitialisedState {
    key: string
    status: 'uninitialised'
}

export interface ErrorState {
    key: string
    status: 'error'
    message: string
}

export interface LoadedState<DataShape> {
    key: string
    status: 'loaded'
    data: DataShape
    loadNextPage: () => void
}

export interface LoadingMoreState<DataShape> {
    key: string
    status: 'loading-more'
    data: DataShape
    loadNextPage: () => void
}

export interface LoadingState {
    key: string
    status: 'loading'
}

export type LoaderState<MapState> = LoadingMoreState<MapState>
    | LoadingState
    | LoadedState<MapState>
    | ErrorState
    | UnitialisedState

export type RenderData<MapState> = (loaderProps: LoaderState<MapState>) => React.ReactElement<any>

export interface Props<MapState> {
    renderComponent: RenderData<MapState>
    pageQuery?: (page: number) => string
}

export interface State {}

const createDataLoader = <APIShape, MapState>(
    resourcePath: string,
    validateAPI: (data: APIShape) => APIShape,
    mapState: (data: APIShape) => MapState
): React.ComponentClass<Props<MapState>> => {
    let data: MapState
    let error: Error
    let initialised: boolean = false
    let loading: boolean = false
    let page: number = 0

    class DataLoader extends Component<Props<MapState>, State> {
        mounted: boolean = false

        componentDidMount() {
            this.mounted = true
            if (initialised) {
                return
            }

            initialised = true
            this.init()
        }

        componentWillUnmount() {
            this.mounted = false
        }

        init = () => {
            this.getData()
        }

        loadNextPage = () => {
            this.getData()
        }

        getUrl = (currentPage: number) => {
            if (this.props.pageQuery) {
                const query = this.props.pageQuery(currentPage)

                return `${resourcePath}?${query}`
            }
            return resourcePath
        }

        getData = async () => {
            if (loading) {
                return
            }

            loading = true

            this.update()
            try {
                const url = this.getUrl(page || 1)
                const response = await getResource<APIShape>(url)
                const validatedResponse = validateAPI(response)
                const mappedData = mapState(validatedResponse)

                page++
                loading = false

                this.succeed(mappedData)
            } catch (ex) {
                this.fail(ex)
            }
        }

        succeed = (mappedData: MapState) => {
            data = mappedData
            this.update()
        }

        fail = (resourceError: Error) => {
            error = resourceError
            this.update()
        }

        update = () => {
            if (this.mounted) {
                this.forceUpdate()
            }
        }

        getCurrentState = () => {
            if (!initialised) {
                const state: UnitialisedState = {
                    key: resourcePath,
                    status: 'uninitialised',
                }

                return state
            }

            if (error) {
                const state: ErrorState = {
                    key: resourcePath,
                    status: 'error',
                    message: error.message,
                }

                return state
            }

            if (loading) {
                if (!data) {
                    const state: LoadingState = {
                        key: resourcePath,
                        status: 'loading',
                    }

                    return state
                }

                const state: LoadingMoreState<MapState> = {
                    key: resourcePath,
                    status: 'loading-more',
                    data,
                    loadNextPage: this.loadNextPage,
                }

                return state
            }

            const state: LoadedState<MapState> = {
                key: resourcePath,
                status: 'loaded',
                data,
                loadNextPage: this.loadNextPage,
            }

            return state
        }

        render() {
            const state = this.getCurrentState()

            return this.props.renderComponent(state)
        }
    }

    return DataLoader
}

export { createDataLoader }
