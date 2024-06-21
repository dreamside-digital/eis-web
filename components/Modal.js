'use client'

import { useState } from "react";
import Modal from "react-modal";
import { XMarkIcon, PlayCircleIcon } from '@heroicons/react/24/solid'

Modal.setAppElement('#root');

export default function NewsModal() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <div className="absolute inset-0 p-36 md:p-40 flex flex-col justify-center items-center text-center font-title font-medium md:text-4xl text-navy hover:text-aubergine">
          <PlayCircleIcon />
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
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
          <iframe className="absolute inset-0 h-full w-full" width="560" height="315" src="https://www.youtube.com/embed/fsNuXnYkudQ?si=mvA28LjPFsN1raFI?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          <button className="absolute -top-10 right-2 bg-beige rounded-full text-navy flex gap-1 items-center uppercase font-medium p-1 px-2" onClick={() => setShowModal(false)}>Close<XMarkIcon className="h-6 w-6" /></button>
        </div>
      </Modal>
    </>
  );
}