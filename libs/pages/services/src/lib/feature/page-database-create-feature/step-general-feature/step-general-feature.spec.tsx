import { DatabaseAccessibilityEnum, DatabaseModeEnum, DatabaseTypeEnum } from 'qovery-typescript-axios'
import { type ReactNode } from 'react'
import { clusterFactoryMock } from '@qovery/shared/factories'
import { renderWithProviders, screen } from '@qovery/shared/util-tests'
import { DatabaseCreateContext } from '../page-database-create-feature'
import StepGeneralFeature from './step-general-feature'

const mockSetGeneralData = jest.fn()
const mockNavigate = jest.fn()

const mockCluster = clusterFactoryMock(1)[0]
jest.mock('@qovery/domains/clusters/feature', () => ({
  ...jest.requireActual('@qovery/domains/clusters/feature'),
  useCluster: () => ({ data: mockCluster }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ organizationId: '1', projectId: '2', environmentId: '3' }),
  useNavigate: () => mockNavigate,
}))

const ContextWrapper = (props: { children: ReactNode }) => {
  return (
    <DatabaseCreateContext.Provider
      value={{
        currentStep: 1,
        setCurrentStep: jest.fn(),
        generalData: {
          name: 'test',
          accessibility: DatabaseAccessibilityEnum.PRIVATE,
          version: '1',
          type: DatabaseTypeEnum.MYSQL,
          mode: DatabaseModeEnum.CONTAINER,
        },
        setGeneralData: mockSetGeneralData,
        resourcesData: undefined,
        setResourcesData: jest.fn(),
      }}
    >
      {props.children}
    </DatabaseCreateContext.Provider>
  )
}

describe('StepGeneralFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <ContextWrapper>
        <StepGeneralFeature />
      </ContextWrapper>
    )

    expect(baseElement).toBeTruthy()
  })

  it('should submit form and navigate', async () => {
    const { userEvent } = renderWithProviders(
      <ContextWrapper>
        <StepGeneralFeature />
      </ContextWrapper>
    )

    const submitButton = await screen.findByTestId('button-submit')
    // https://react-hook-form.com/advanced-usage#TransformandParse
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).not.toBeDisabled()

    await userEvent.click(submitButton)

    expect(mockSetGeneralData).toHaveBeenCalledWith({
      name: 'test',
      accessibility: DatabaseAccessibilityEnum.PRIVATE,
      version: '1',
      type: DatabaseTypeEnum.MYSQL,
      mode: DatabaseModeEnum.CONTAINER,
    })
    expect(mockNavigate).toHaveBeenCalledWith(
      '/organization/1/project/2/environment/3/services/create/database/resources'
    )
  })
})
