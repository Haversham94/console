import equal from 'fast-deep-equal'
import { type Cluster, type Environment, type Organization, type Project } from 'qovery-typescript-axios'
import { memo, useCallback, useEffect, useState } from 'react'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { EnvironmentMode } from '@qovery/domains/environments/feature'
import { ServiceStateChip, useServices } from '@qovery/domains/services/feature'
import { IconEnum } from '@qovery/shared/enums'
import {
  APPLICATION_GENERAL_URL,
  APPLICATION_URL,
  AUDIT_LOGS_URL,
  CLUSTERS_URL,
  CLUSTER_URL,
  DATABASE_GENERAL_URL,
  DATABASE_URL,
  ENVIRONMENTS_GENERAL_URL,
  ENVIRONMENTS_URL,
  ENVIRONMENT_LOGS_URL,
  INFRA_LOGS_URL,
  SERVICES_GENERAL_URL,
  SERVICES_URL,
  SETTINGS_URL,
} from '@qovery/shared/routes'
import { Button, Icon, type MenuData, type MenuItemProps, Tooltip } from '@qovery/shared/ui'
import BreadcrumbItem from '../breadcrumb-item/breadcrumb-item'

export interface BreadcrumbProps {
  organizations: Organization[]
  createProjectModal: () => void
  clusters?: Cluster[]
  projects?: Project[]
  environments?: Environment[]
}

export function Breadcrumb(props: BreadcrumbProps) {
  const { organizations, clusters, projects, environments, createProjectModal } = props
  const { organizationId, projectId, environmentId, applicationId, databaseId, clusterId } = useParams()

  const matchAuditLogs = useMatch({ path: AUDIT_LOGS_URL(), end: false })
  const matchSettings = useMatch({ path: SETTINGS_URL(), end: false })
  const matchClusters = useMatch({ path: CLUSTERS_URL(), end: false })
  const location = useLocation()
  const navigate = useNavigate()
  const currentOrganization = organizations?.find((organization) => organizationId === organization.id)

  const locationIsApplicationLogs = location.pathname.includes(
    ENVIRONMENT_LOGS_URL(organizationId, projectId, environmentId)
  )
  const locationIsDeploymentLogs = location.pathname.includes(
    ENVIRONMENT_LOGS_URL(organizationId, projectId, environmentId)
  )

  const locationIsClusterLogs = location.pathname.includes(INFRA_LOGS_URL(organizationId, clusterId))

  const matchLogsRoute =
    location.pathname.includes(INFRA_LOGS_URL(organizationId, clusterId)) ||
    locationIsApplicationLogs ||
    locationIsDeploymentLogs

  const clustersMenu: MenuData = [
    {
      title: 'Clusters',
      sortAlphabetically: true,
      search: true,
      items: clusters
        ? clusters?.map((cluster) => ({
            name: cluster.name,
            link: {
              url: matchLogsRoute
                ? INFRA_LOGS_URL(organizationId, cluster.id)
                : CLUSTER_URL(organizationId, cluster.id),
            },
            contentLeft: (
              <Icon
                name="icon-solid-check"
                className={`text-sm ${clusterId === cluster.id ? 'text-green-400' : 'text-transparent'}`}
              />
            ),
          }))
        : [],
    },
  ]

  const projectMenu: MenuData = [
    {
      title: 'Projects',
      search: true,
      sortAlphabetically: true,
      button: {
        label: (
          <span>
            New <Icon iconName="circle-plus" iconStyle="regular" className="ml-0.5" />
          </span>
        ),
        onClick: () => createProjectModal(),
      },
      items: projects
        ? projects?.map((project: Project) => ({
            name: project.name,
            link: {
              url: ENVIRONMENTS_URL(project.organization?.id, project.id) + ENVIRONMENTS_GENERAL_URL,
            },
            contentLeft: (
              <Icon
                iconName="check"
                className={`text-sm ${projectId === project.id ? 'text-green-400' : 'text-transparent'}`}
              />
            ),
          }))
        : [],
    },
  ]

  const environmentMenu: MenuData = [
    {
      title: 'Environments',
      search: true,
      sortAlphabetically: true,
      items: environments
        ? environments?.map((environment: Environment) => ({
            name: environment.name,
            link: {
              url: `${SERVICES_URL(organizationId, projectId, environment.id)}${SERVICES_GENERAL_URL}`,
            },
            contentLeft: environment.cloud_provider.provider && (
              <span className="flex items-center gap-3">
                <EnvironmentMode mode={environment.mode} variant="shrink" />
                <Icon className="mt-0.5 w-4" name={environment.cloud_provider.provider} />
              </span>
            ),
            isActive: environmentId === environment.id,
          }))
        : [],
    },
  ]

  const { data: services = [] } = useServices({ environmentId })

  const applicationMenu: MenuData = [
    {
      title: 'Services',
      search: true,
      sortAlphabetically: true,
      items: services.map((service) => ({
        name: service.name,
        link: {
          url:
            service.serviceType === 'DATABASE'
              ? `${DATABASE_URL(organizationId, projectId, environmentId, service.id)}${DATABASE_GENERAL_URL}`
              : `${APPLICATION_URL(organizationId, projectId, environmentId, service.id)}${APPLICATION_GENERAL_URL}`,
        },
        contentLeft: (
          <div className="flex items-center">
            <ServiceStateChip mode="deployment" environmentId={service.environment?.id} serviceId={service.id} />
            <div className="ml-3 mt-[1px]">
              <Icon
                name={match(service)
                  .with({ serviceType: 'HELM' }, () => IconEnum.HELM)
                  .with({ serviceType: 'DATABASE' }, () => IconEnum.DATABASE)
                  .with({ serviceType: 'JOB' }, (s) =>
                    s.job_type === 'LIFECYCLE' ? IconEnum.LIFECYCLE_JOB : IconEnum.CRON_JOB
                  )
                  .otherwise(() => IconEnum.APPLICATION)}
                width="16"
              />
            </div>
          </div>
        ),
        isActive: applicationId === service.id,
      })) as MenuItemProps[],
    },
  ]

  const squareContent = (text: string | undefined, margin = 'mr-2 mt-0.5') => (
    <div
      className={`h-4.5 flex w-4 items-center justify-center rounded-sm bg-neutral-200 text-center text-xs font-bold uppercase text-neutral-350 ${margin}`}
    >
      {text}
    </div>
  )

  const [prevUrl, setPrevUrl] = useState<string | null>()
  useEffect(() => {
    // We keep track of the previous logs url to be able to navigate back to it
    if (location.state?.prevUrl) setPrevUrl(location.state.prevUrl)
  }, [location.state?.prevUrl])

  const handleCloseLogs = useCallback(() => {
    const linkToCloseLogs = locationIsClusterLogs
      ? CLUSTERS_URL(organizationId)
      : SERVICES_URL(organizationId, projectId, environmentId)

    const doesAnyHistoryEntryExist = location.key !== 'default'
    if (prevUrl && doesAnyHistoryEntryExist) {
      navigate(prevUrl)
    } else {
      navigate(linkToCloseLogs)
    }
  }, [environmentId, location, locationIsClusterLogs, navigate, organizationId, projectId, prevUrl])

  useEffect(() => {
    const bindTouch = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && matchLogsRoute) handleCloseLogs()
    }
    document.addEventListener('keydown', bindTouch, false)

    return () => {
      document.removeEventListener('keydown', bindTouch, false)
    }
  }, [handleCloseLogs, matchLogsRoute])

  if (organizations?.length === 0) return <div />

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex h-full items-center">
        {organizationId && (projectId || clusterId || matchAuditLogs || matchClusters || matchSettings) && (
          <Tooltip content={currentOrganization?.name || ''}>
            <div className="mr-2">
              {currentOrganization?.logo_url ? (
                <img
                  src={currentOrganization?.logo_url}
                  className="h-4"
                  alt={`${currentOrganization?.name} organization`}
                />
              ) : (
                squareContent(currentOrganization?.name.charAt(0), '')
              )}
            </div>
          </Tooltip>
        )}
        {clusterId && (
          <BreadcrumbItem
            isLast={!projectId}
            label="Cluster"
            data={clusters}
            menuItems={clustersMenu}
            paramId={clusterId}
            link={matchLogsRoute ? INFRA_LOGS_URL(organizationId, clusterId) : CLUSTER_URL(organizationId, clusterId)}
          />
        )}
        {projectId && (
          <BreadcrumbItem
            isLast={!environmentId}
            label="Project"
            data={projects}
            menuItems={projectMenu}
            paramId={projectId}
            link={`${ENVIRONMENTS_URL(organizationId, projectId)}${ENVIRONMENTS_GENERAL_URL}`}
          />
        )}
        {environmentId && (
          <>
            <div className="mx-3 mt-3 h-auto w-4 text-center text-neutral-300">/</div>
            <div className="flex items-center">
              {environmentId && (
                <>
                  <BreadcrumbItem
                    isLast={!(applicationId || databaseId)}
                    label="Environment"
                    data={environments}
                    menuItems={environmentMenu}
                    paramId={environmentId}
                    link={SERVICES_URL(organizationId, projectId, environmentId) + SERVICES_GENERAL_URL}
                  />
                  {(applicationId || databaseId) && (
                    <>
                      <div className="mx-3 mt-3 h-auto w-4 text-center text-neutral-300">/</div>
                      <div className="flex items-center">
                        <BreadcrumbItem
                          isLast={true}
                          label="Service"
                          data={services}
                          menuItems={applicationMenu}
                          paramId={applicationId || databaseId || ''}
                          link={
                            applicationId
                              ? APPLICATION_URL(organizationId, projectId, environmentId, applicationId) +
                                APPLICATION_GENERAL_URL
                              : DATABASE_URL(organizationId, projectId, environmentId, databaseId) +
                                DATABASE_GENERAL_URL
                          }
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {matchLogsRoute && (
          <div className="flex">
            <div className="ml-3 mt-2 flex h-6 items-center rounded-[3px] bg-purple-800 px-1.5 text-ssm font-medium text-purple-300">
              LOGS
            </div>
          </div>
        )}
        {matchAuditLogs && (
          <BreadcrumbItem
            label={organizations.find(({ id }) => id === organizationId)?.name}
            data={[{ id: '0', name: 'Audit Logs' }]}
            menuItems={[]}
            paramId="0"
            isLast
            link=""
          />
        )}
        {matchSettings && (
          <BreadcrumbItem
            label={organizations.find(({ id }) => id === organizationId)?.name}
            data={[{ id: '0', name: 'Settings' }]}
            menuItems={[]}
            paramId="0"
            isLast
            link=""
          />
        )}
        {matchClusters && (
          <BreadcrumbItem
            label={organizations.find(({ id }) => id === organizationId)?.name}
            data={[{ id: '0', name: 'Clusters' }]}
            menuItems={[]}
            paramId="0"
            isLast
            link=""
          />
        )}
      </div>
      {(locationIsApplicationLogs || locationIsDeploymentLogs || locationIsClusterLogs) && (
        <div className="ml-auto">
          <Button
            className="gap-2"
            type="button"
            color="neutral"
            variant="surface"
            size="md"
            onClick={() => handleCloseLogs()}
          >
            Close logs
            <Icon iconName="xmark" className="text-sm" />
          </Button>
        </div>
      )}
    </div>
  )
}

export const BreadcrumbMemo = memo(Breadcrumb, (prevProps, nextProps) => {
  return equal(prevProps, nextProps)
})
