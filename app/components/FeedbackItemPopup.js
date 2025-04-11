import Popup from "./Popup";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComment";
export default function FeedbackItemPopup({ title,setShow,description,votes }) {
  return (
<Popup title={''} setShow={setShow}>
  <div className="p-8">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
<p className="text-gray-600">
  {description}
</p>

  </div>
<div className="flex justify-end px-8 py-2 border-b">
<Button primary="true">
<span className="triangle-up"></span>
  Upvote {votes}</Button>
</div>
<div>
  <FeedbackItemPopupComments/>
</div>
</Popup>
  );
}
