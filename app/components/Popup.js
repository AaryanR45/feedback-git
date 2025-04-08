import Button from "@/app/components/Button";
export default function Popup({ setShow, children,title }) {
  return (
    <div>
      {" "}
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center" onClick={()=>setShow(false)}>
        <div className="w-full">
          <div className="bg-white max-w-2xl mx-auto rounded-lg overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="relative min-h-[40px]">
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {!!title &&(
                <h2 className="py-4 text-center border-b">{title}</h2>
              )}
              
            </div>

          {children}
          </div>
        </div>
      </div>
    </div>
  );
}
