import { type HelmRepositoryResponse } from 'qovery-typescript-axios'
import { NeedHelp } from '@qovery/shared/assistant/feature'
import { IconEnum } from '@qovery/shared/enums'
import { BlockContent, Button, Heading, Icon, LoaderSpinner, Section, Tooltip, Truncate } from '@qovery/shared/ui'

export interface PageOrganizationHelmRepositoriesProps {
  onAddRepository: () => void
  onEdit: (repository: HelmRepositoryResponse) => void
  onDelete: (repository: HelmRepositoryResponse) => void
  helmRepositories?: HelmRepositoryResponse[]
  isFetched?: boolean
}

export function PageOrganizationHelmRepositories({
  helmRepositories,
  isFetched,
  onAddRepository,
  onEdit,
  onDelete,
}: PageOrganizationHelmRepositoriesProps) {
  return (
    <div className="flex w-full flex-col justify-between">
      <Section className="max-w-content-with-navigation-left p-8">
        <div className="mb-8 flex justify-between">
          <div className="space-y-3">
            <Heading>Helm repositories</Heading>
            <p className="text-xs text-neutral-400">
              Define and manage the helm repository to be used within your organization to deploy applications.
            </p>
            <NeedHelp />
          </div>
          <Button className="gap-2" size="lg" onClick={() => onAddRepository()}>
            Add repository
            <Icon iconName="circle-plus" />
          </Button>
        </div>
        <BlockContent title="Helm repositories" classNameContent="p-0">
          {!isFetched ? (
            <div data-testid="repositories-loader" className="flex justify-center p-5">
              <LoaderSpinner className="w-6" />
            </div>
          ) : helmRepositories && helmRepositories.length > 0 ? (
            <ul>
              {helmRepositories?.map((repository: HelmRepositoryResponse) => (
                <li
                  data-testid={`repositories-list-${repository.id}`}
                  key={repository.id}
                  className="flex items-center justify-between border-b border-neutral-250 px-5 py-4 last:border-0"
                >
                  <div className="flex">
                    <Icon name={IconEnum.HELM_OFFICIAL} width="20" height="20" />
                    <div className="ml-4">
                      <h2 className="mb-1 flex text-xs font-medium text-neutral-400">
                        <Truncate truncateLimit={60} text={repository.name || ''} />
                        {repository.description && (
                          <Tooltip content={repository.description}>
                            <div className="ml-1 cursor-pointer">
                              <Icon iconName="circle-info" className="text-neutral-350" />
                            </div>
                          </Tooltip>
                        )}
                      </h2>
                      <p className="text-xs text-neutral-350">{repository.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="md" variant="outline" color="neutral" onClick={() => onEdit(repository)}>
                      <Icon iconName="gear" />
                    </Button>
                    <Button size="md" variant="outline" color="neutral" onClick={() => onDelete(repository)}>
                      <Icon iconName="trash" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="my-4 px-5 text-center">
              <Icon iconName="wave-pulse" className="text-neutral-350" />
              <p className="mt-1 text-xs font-medium text-neutral-350">
                No helm repository found. <br /> Please add one.
              </p>
            </div>
          )}
        </BlockContent>
      </Section>
    </div>
  )
}

export default PageOrganizationHelmRepositories
