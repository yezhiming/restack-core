export const SHOW_MODAL="SHOW_MODAL"
export const HIDE_MODAL="HIDE_MODAL"

export function showModal(modalType, modalProps) {
  return {
    type: SHOW_MODAL,
    modalType,
    modalProps
  }
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  }
}

export default function modal() {

  const initialState = {
    modalType: null,
    modalProps: {}
  }

  const modal = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_MODAL:
        return {
          modalType: action.modalType,
          modalProps: action.modalProps
        }
      case HIDE_MODAL:
        return initialState;
      default:
        return state;
    }
  }

  return {
    reducers: {
      modal: modal
    }
  }
}
