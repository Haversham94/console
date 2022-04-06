import { IconEnum } from '@console/shared/enums'
import { Link } from 'react-router-dom'
import { Avatar } from '../../avatar/avatar'
import { ButtonIcon, ButtonIconStyle } from '../../buttons/button-icon/button-icon'
import ModalArrow from '../../modals/modal-arrow/modal-arrow'

export function Navigation() {
  return (
    <div className="bg-white w-14 h-full fixed top-0 left-0">
      <Link
        to={'/'}
        className="flex w-14 h-14 items-center justify-center border-b border-element-light-lighter-400 z-10"
      >
        <img className="w-[28px]" src="/assets/logos/logo-icon.svg" alt="Qovery logo" />
      </Link>

      <div className="flex flex-col justify-between h-[calc(100%-7rem)] px-3 py-5">
        <div className="flex flex-col gap-3">
          <ButtonIcon icon="icon-solid-gauge-high" style={ButtonIconStyle.ALT} active={true} />
          <ButtonIcon icon="icon-solid-layer-group" style={ButtonIconStyle.ALT} />
          <ButtonIcon icon="icon-solid-clock-rotate-left" style={ButtonIconStyle.ALT} />
        </div>
        <div>
          <div className="flex flex-col gap-3">
            <ButtonIcon icon="icon-solid-wheel" style={ButtonIconStyle.ALT} />
            <ButtonIcon icon="icon-solid-circle-info" style={ButtonIconStyle.ALT} />
          </div>
        </div>
      </div>

      <div className="flex w-14 h-14 items-center justify-center border-t border-element-light-lighter-400">
        <Avatar icon={IconEnum.GITLAB} link="/overview"></Avatar>
      </div>
    </div>
  )
}

export default Navigation
