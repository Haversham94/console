import { DatabaseModeEnum } from 'qovery-typescript-axios'
import { type FormEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'
import { type Database } from '@qovery/domains/services/data-access'
import { DatabaseSettingsResources } from '@qovery/shared/console-shared'
import { Button, Callout, Heading, Icon, Section } from '@qovery/shared/ui'

export interface PageSettingsResourcesProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  database?: Database
  loading?: boolean
  clusterId?: string
}

export function PageSettingsResources(props: PageSettingsResourcesProps) {
  const { onSubmit, loading, database, clusterId } = props
  const { formState, watch } = useFormContext()

  if (!database) return null

  const displayInstanceTypesWarning =
    watch('instance_type') !== database.instance_type && database.mode === DatabaseModeEnum.MANAGED

  const displayStorageWarning = watch('storage') !== database.storage && database.mode === DatabaseModeEnum.MANAGED

  return (
    <div className="flex flex-col justify-between w-full">
      <Section className="p-8 max-w-content-with-navigation-left">
        <Heading className="mb-2">Resources</Heading>
        <p className="text-sm text-neutral-400 max-w-content-with-navigation-left mb-8">
          Manage the database's resources
        </p>
        <form className="space-y-10" onSubmit={onSubmit}>
          {database.mode === DatabaseModeEnum.MANAGED && (
            <Callout.Root color="yellow">
              <Callout.Icon>
                <Icon iconName="triangle-exclamation" />
              </Callout.Icon>
              <Callout.Text>
                <Callout.TextHeading>Qovery manages this resource for you </Callout.TextHeading>
                <Callout.TextDescription className="text-xs">
                  Use exclusively the Qovery console to update the resources managed by Qovery on your cloud account.
                  <br /> Do not manually update or upgrade them on the cloud provider console, otherwise you will risk a
                  drift in the configuration.
                </Callout.TextDescription>
              </Callout.Text>
            </Callout.Root>
          )}

          <Section className="gap-4">
            <Heading>Resources configuration</Heading>
            <DatabaseSettingsResources
              database={database}
              clusterId={clusterId}
              isManaged={database.mode === DatabaseModeEnum.MANAGED}
              displayInstanceTypesWarning={displayInstanceTypesWarning}
              displayStorageWarning={displayStorageWarning}
            />
          </Section>

          <div className="flex justify-end">
            <Button data-testid="submit-button" size="lg" type="submit" disabled={!formState.isValid} loading={loading}>
              Save
            </Button>
          </div>
        </form>
      </Section>
    </div>
  )
}

export default PageSettingsResources
