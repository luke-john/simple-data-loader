# DataLoader

React DataLoader with typescript safety

## Installation

```sh
yarn add github:luke-john/data-loader
```

## Usage

```ts
import * as React from 'react'
import { createDataLoader } from 'data-loader'

const validateApi = (data: any) => data
const mapState = () => ({
    key: 'value' as 'value',
})

interface APIShape {

}

interface MapState {
    key: 'value'
}

const DataLoader = createDataLoader<
    APIShape,
    MapState
>('https://path.to.resource', validateApi, mapState)

export const ExampleComponent = () => (
    <DataLoader
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

            return <p>Loaded: {JSON.stringify(props.data.safety)}</p>
        }}
    />
)
```