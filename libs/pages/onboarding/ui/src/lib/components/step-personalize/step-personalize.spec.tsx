import { render } from '__mocks__/utils/test-utils'

import StepPersonalize from './step-personalize'

describe('StepPersonalize', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StepPersonalize />)
    expect(baseElement).toBeTruthy()
  })
})
