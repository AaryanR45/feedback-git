import { useEffect } from "react";

export default function Popup({ setShow, children, title, narrow }) {
  function close(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setShow(false);
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={close}>
      <div
        className={`bg-white mx-auto rounded-lg max-h-[90vh] overflow-y-auto w-full ${narrow ? 'md:max-w-sm' : 'md:max-w-2xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-h-[40px]">
          <button onClick={close} className="absolute top-4 right-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          {!!title && <h2 className="py-4 text-center border-b">{title}</h2>}
        </div>

        {children}
      </div>
    </div>
  );
}
