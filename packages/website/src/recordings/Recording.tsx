import Infoline from "component/Infoline";
import LazyLoad from "react-lazyload";

const VIDEO_CLASSNAMES =
  "aspect-square w-full bg-light-1 dark:bg-dark-1 border-2 border-light-1 dark:border-dark-1";

export default function Recording({
  url,
  name,
  lazyload = false,
}: {
  url: string;
  name: string;
  lazyload?: boolean;
}) {
  const video = (
    <video controls className={VIDEO_CLASSNAMES}>
      <source src={url} type="video/mp4" />
    </video>
  );
  return (
    <div key={url}>
      {lazyload ? (
        <LazyLoad
          once
          offset={200}
          placeholder={<div className={VIDEO_CLASSNAMES} />}
        >
          {video}
        </LazyLoad>
      ) : (
        video
      )}
      <Infoline shareUrl={`https://share.mattb.tech/recordings/${name}`}>
        {name}
      </Infoline>
    </div>
  );
}
