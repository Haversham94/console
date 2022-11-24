import { FormEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'
import { SettingResources } from '@qovery/shared/console-shared'
import { Button, ButtonSize, ButtonStyle } from '@qovery/shared/ui'
import { ResourcesData } from '../../../feature/page-application-create-feature/application-creation-flow.interface'

export interface PageApplicationCreateResourcesProps {
  onBack: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  maximumInstances?: number
}

export function PageApplicationCreateResources(props: PageApplicationCreateResourcesProps) {
  const { formState } = useFormContext<ResourcesData>()

  return (
    <>
      <div className="mb-10">
        <h3 className="text-text-700 text-lg mb-2">Set resources</h3>
      </div>

      <form onSubmit={props.onSubmit}>
        <SettingResources maxInstances={props.maximumInstances} displayWarningCpu={false} />

        <div className="flex justify-between">
          <Button
            onClick={props.onBack}
            className="btn--no-min-w"
            type="button"
            size={ButtonSize.XLARGE}
            style={ButtonStyle.STROKED}
          >
            Back
          </Button>
          <Button
            dataTestId="button-submit"
            type="submit"
            disabled={!formState.isValid}
            size={ButtonSize.XLARGE}
            style={ButtonStyle.BASIC}
          >
            Continue
          </Button>
        </div>
      </form>
    </>
  )
}

export default PageApplicationCreateResources
