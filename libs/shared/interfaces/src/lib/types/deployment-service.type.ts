import { Commit, StateEnum } from 'qovery-typescript-axios'

export interface DeploymentService {
  id?: string
  created_at?: string
  updated_at?: string
  name?: string
  status?: StateEnum
  commit?: Commit
  type?: string
  execution_id?: string
}
