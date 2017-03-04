import * as React from 'react'
import { createDataLoader } from '../index'

interface APIShape {

}

const validateAPI = (data: any) => data

interface MapState {
    key: 'value'
}

const mapState = () => ({
    key: 'value' as 'value',
})

export interface Props {
    resourcePath: string
}

export const SingleDataLoader: React.StatelessComponent<Props> = dataLoaderOptions => {
    const url = dataLoaderOptions.resourcePath
    const ExampleDataLoader = createDataLoader<
        APIShape,
        MapState
    >(url, validateAPI, mapState)

    return (
        <ExampleDataLoader
            renderComponent={props => {
                if (props.status === 'uninitialised') {
                    return <p>Uninitialised</p>
                }

                if (props.status === 'error') {
                    return <p>Error: {props.message}</p>
                }

                if (props.status === 'loading') {
                    return <p>Loading</p>
                }

                return <p>Resource: {JSON.stringify(props.data.key)}</p>
            }}
        />
    )
}
