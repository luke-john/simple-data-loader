import * as fetchMock from 'fetch-mock'
import * as React from 'react'
import { mount } from 'enzyme'

import { createDataLoader } from '../index'

import { basicResponse } from './data/basic-response'
import { waitPromise } from './helpers/wait-promise'

const createTestLoader = (testUrl: string) => {
    const testValidateApi = (data: any) => data
    const testMapState = () => ({
        key: 'value' as 'value',
    })

    interface APIShape {}
    interface MapState {
        key: 'value'
    }

    const DataLoader = createDataLoader<
        APIShape,
        MapState
    >(testUrl, testValidateApi, testMapState)

    return mount((
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

                return <p>Loaded: {JSON.stringify(props.data)}</p>
            }}
        />
    ))
}

describe('dataLoader with single resource', () => {
    test('Should render loading and loaded onMounted', done => {
        fetchMock.restore()
        // Test Data
        const testUrl = 'http://test.url'

        const stageOne = waitPromise()

        // Test Mocks
        fetchMock.once(testUrl, async () => {
            await stageOne.wait
            return basicResponse
        })

        const testLoader = createTestLoader(testUrl)

        expect(testLoader.html()).toMatchSnapshot()

        // tslint:disable-next-line
        ;(stageOne as any).progress()

        setTimeout(() => {
            expect(testLoader.html()).toMatchSnapshot()

            done()
        }, 0)
    })

    test('Should only fetch data once', done => {
        fetchMock.restore()
        // Test Data
        const testUrl = 'http://test.url'
        const testValidateApi = (data: any) => data
        const testMapState = (data: any) => data

        // Test Mocks
        fetchMock.once(testUrl, () => basicResponse)

        const DataLoader = createDataLoader(testUrl, testValidateApi, testMapState)

        mount(<DataLoader renderComponent={() => <noscript />} />)
        mount(<DataLoader renderComponent={() => <noscript />} />)

        setTimeout(() => {
            const apiCalls = fetchMock.calls(testUrl).length

            expect(apiCalls).toBe(1)
            done()
        }, 0)
    })

    test('Should render is error if api failure', done => {
        fetchMock.restore()
        // Test Data
        const testUrl = 'http://test.url'

        // Test Mocks
        fetchMock.once(testUrl, () => {
            return {
                status: 500,
                body: basicResponse,
            }
        })

        const testLoader = createTestLoader(testUrl)

        setTimeout(() => {
            expect(testLoader.html()).toMatchSnapshot()

            done()
        }, 0)
    })
})
