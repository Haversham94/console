import {
  type CloudProviderEnum,
  type ClusterFeature,
  type ClusterFeatureAwsExistingVpc,
  type ClusterFeatureGcpExistingVpc,
} from 'qovery-typescript-axios'
import { match } from 'ts-pattern'
import { CardClusterFeature } from '@qovery/shared/console-shared'
import { BlockContent, Heading, LoaderSpinner, Section } from '@qovery/shared/ui'
import AWSExistingVPC from './aws-existing-vpc/aws-existing-vpc'
import GcpExistingVPC from './gcp-existing-vpc/gcp-existing-vpc'

export interface PageSettingsFeaturesProps {
  loading: boolean
  features?: ClusterFeature[]
  cloudProvider?: CloudProviderEnum
}

export function PageSettingsFeatures(props: PageSettingsFeaturesProps) {
  const { loading, features, cloudProvider } = props

  const featureExistingVpc = features?.find(({ id }) => id === 'EXISTING_VPC')
  const featureExistingVpcValue = featureExistingVpc?.value

  const featureExistingVpcContent = match(cloudProvider)
    .with('AWS', () => <AWSExistingVPC feature={featureExistingVpcValue as ClusterFeatureAwsExistingVpc} />)
    .with('GCP', () => <GcpExistingVPC feature={featureExistingVpcValue as ClusterFeatureGcpExistingVpc} />)
    .otherwise(() => null)

  return (
    <div className="flex flex-col justify-between w-full">
      <Section className="p-8 max-w-content-with-navigation-left">
        <Heading className="mb-8">Features</Heading>

        {!loading && featureExistingVpcValue && featureExistingVpcContent}

        {!featureExistingVpcValue && (
          <BlockContent title="Configured features" classNameContent="p-0">
            {loading && (
              <div className="flex justify-center p-5">
                <LoaderSpinner className="w-4" />
              </div>
            )}
            {features
              ?.filter(({ id }) => id !== 'EXISTING_VPC')
              .map((feature: ClusterFeature) => (
                <CardClusterFeature key={feature.id} feature={feature} cloudProvider={cloudProvider} disabled />
              ))}
          </BlockContent>
        )}
      </Section>
    </div>
  )
}

export default PageSettingsFeatures
