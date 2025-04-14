export default function Avatar({ url = null }) {
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-300 flex items-center justify-center">
        {url ? (
          <img
            src={url}
            alt="avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'; 
            }}
          />
        ) : (
          <span className="text-white text-xs">No Img</span>
        )}
      </div>
    );
  }
  