'use client'

import { useState } from "react";
import Modal from "react-modal";
import { XMarkIcon, PlayCircleIcon } from '@heroicons/react/24/solid'

Modal.setAppElement('#root');

export default function VideoModal() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <div className="absolute inset-0 pb-8 flex flex-col justify-center items-center text-center font-title font-medium md:text-4xl text-dark hover:text-highlight">
          <PlayCircleIcon className="min-h-8 min-w-8 h-24 w-24 md:h-32 md:w-32" />
        </div>
      </button>
      <Modal 
        isOpen={showModal}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setShowModal(false)}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 20
          },
          content: {
            position: 'absolute',
            top: '60px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: 'none',
            background: 'transparent',
            overflow: 'visible',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '0'
          }
        }}
      >
        <div className="h-full w-full relative">
          <iframe className="absolute inset-0 h-full w-full" width="560" height="315" src="https://www.youtube.com/embed/t2wUqLgP2b0?si=96TlIeMacgcHElIf?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          <button className="absolute -top-10 right-2 bg-light hover:bg-white text-dark flex gap-1 items-center uppercase font-medium p-1 px-2" onClick={() => setShowModal(false)}>Close<XMarkIcon className="h-6 w-6" /></button>
        </div>
      </Modal>
    </>
  );
}