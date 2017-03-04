import * as React from 'react'
import { createDataLoader } from '../index'

interface APIShape {

}

const validateAPI = (data: any) => data

interface MapState {
    items: string[]
}

const mapState = (data: any) => data

export interface Props {
    resourcePath: string
}

const ExampleComponent: React.StatelessComponent<Props> = dataLoaderOptions => {
    const url = dataLoaderOptions.resourcePath
    const ExampleDataLoader = createDataLoader<
        APIShape,
        MapState
    >(url, validateAPI, mapState)

    return (
        <ExampleDataLoader
            pageQuery={(page: number) => {
                return `page=${page}&page_size=10`
            }}
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

                return (
                    <div>
                        <h1>
                            Items
                        </h1>
                        <ul>
                            {props.data.items.map(item => (
                                <li>{item}</li>
                            ))}
                        </ul>
                        {props.status === 'loading-more' &&
                            <p>Loading More Items</p>
                        }
                        {props.status !== 'loading-more' &&
                            <button onClick={props.loadNextPage} />
                        }
                    </div>
                )
            }}
        />
    )
}

export { ExampleComponent }
