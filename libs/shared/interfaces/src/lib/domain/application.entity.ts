import { Application, Commit, Instance, Link, Status } from 'qovery-typescript-axios'
import { LoadingStatus } from '../types/loading-status.type'
import { ServiceRunningStatus } from './service-running-status.interface'

export interface ApplicationEntity extends Application {
  status?: Status
  links?: {
    loadingStatus: LoadingStatus
    items?: Link[]
  }
  instances?: {
    loadingStatus: LoadingStatus
    items?: Instance[]
  }
  commits?: {
    loadingStatus: LoadingStatus
    items?: Commit[]
  }
  running_status?: ServiceRunningStatus
}
