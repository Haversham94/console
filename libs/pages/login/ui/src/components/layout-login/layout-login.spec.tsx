import { render } from '__mocks__/utils/test-utils'

import LayoutLogin from './layout-login'

describe('LayoutLogin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LayoutLogin />)
    expect(baseElement).toBeTruthy()
  })
})
