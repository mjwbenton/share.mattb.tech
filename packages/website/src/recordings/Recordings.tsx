import EmbeddedWrapper from "component/EmbeddedWrapper";
import { TopRightSpinner } from "component/Spinner";
import { useRecordings } from "./recordingsDataProvider";
import Recording from "./Recording";

export default function Recordings() {
  const { loading, recordings } = useRecordings();

  if (!recordings) {
    return null;
  }

  return (
    <EmbeddedWrapper>
      <TopRightSpinner show={loading} />
      <div className="space-y-16">
        {recordings?.map((recording, i) => {
          const lazyload = i !== 0;
          return (
            <Recording
              key={recording.name}
              url={recording.url}
              name={recording.name}
              lazyload={lazyload}
            />
          );
        })}
      </div>
    </EmbeddedWrapper>
  );
}
