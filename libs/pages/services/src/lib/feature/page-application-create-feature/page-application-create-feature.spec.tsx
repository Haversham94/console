import { Route, Routes } from 'react-router-dom'
import { IntercomProvider } from 'react-use-intercom'
import { renderWithProviders } from '@qovery/shared/util-tests'
import PageApplicationCreateFeature from './page-application-create-feature'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ organizationId: '1', projectId: '2', environmentId: '3' }),
}))

describe('PageApplicationCreateFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <IntercomProvider appId="__test__app__id__" autoBoot={false}>
        <Routes location="/organization/1/project/2/environment/3/services/create/general">
          <Route
            path="/organization/1/project/2/environment/3/services/create/*"
            element={<PageApplicationCreateFeature />}
          />
        </Routes>
      </IntercomProvider>
    )
    expect(baseElement).toBeTruthy()
  })
})
